import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { neon } from '@neondatabase/serverless';
import sharp from "sharp";

import { s3Client } from "@/utils/s3-client";

export async function POST(request: NextRequest) {
    if (!process.env.DATABASE_URL) return NextResponse.json(null, { status: 500 });

    const sql = neon(process.env.DATABASE_URL);

    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files.length) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadResults = await Promise.all(
        files.map(async (file) => {
            const timestamp = Date.now().toString();
            const sanitizedFileName = file.name.trim().replace(/\s+/g, "-").toLowerCase();
            const fileName = `${timestamp}-${sanitizedFileName}`;
            const thumbFileName = `thumbnails/${timestamp}-${sanitizedFileName}`;

            try {
                // Convert file to buffer
                const arrayBuffer = await file.arrayBuffer();
                const fileBuffer = Buffer.from(arrayBuffer);

                // Original image upload parameters
                const orgUploadParams = {
                    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
                    Key: fileName,
                    Body: fileBuffer,
                    ContentType: file.type,
                };

                // Create thumbnail
                const thumbBuffer = await sharp(fileBuffer)
                    .resize(200, 200, { fit: "inside" })
                    .jpeg({ quality: 80 })
                    .toBuffer();

                // Thumbnail upload parameters
                const thumbUploadParams = {
                    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
                    Key: thumbFileName,
                    Body: thumbBuffer,
                    ContentType: file.type,
                };

                // Upload original and thumbnail images
                const orgCommand = new PutObjectCommand(orgUploadParams);
                const thumbCommand = new PutObjectCommand(thumbUploadParams);

                await Promise.all([s3Client.send(orgCommand), s3Client.send(thumbCommand)]);

                const fileUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;
                const thumbUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${thumbFileName}`;

                try {
                    // Create the user table if it does not exist
                    await sql('CREATE TABLE IF NOT EXISTS "s3" (name TEXT, img_url TEXT, thumb_url TEXT)');
            
                    // Store the file URL in the database
                    await sql`INSERT INTO s3 (name, img_url, thumb_url) VALUES (${file.name}, ${fileUrl}, ${thumbUrl})`;
            
                    return {
                        fileName: file.name,
                        url: fileUrl,
                        thumbUrl,
                    };
                } catch (error) {
                    console.error("Error uploading file: ", error);
                    return { fileName: file.name, error: "Failed to updated in database" };
                }
            } catch (error) {
                console.error("Error uploading file: ", error);
                return { fileName: file.name, error: "Failed to upload file" };
            }
        })
    );

    return NextResponse.json(uploadResults, { status: 200 });
}