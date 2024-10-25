import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { s3Client } from "@/utils/s3-client";

export async function POST(request: NextRequest) {
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
            const thumbFileName = `thumb/${timestamp}-${sanitizedFileName}`;

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
                    .jpeg({ quality: 60 })
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

                return {
                    fileName: file.name,
                    url: fileUrl,
                    thumbUrl,
                };
            } catch (error) {
                console.error("Error uploading file: ", error);
                return { fileName: file.name, error: "Failed to upload file" };
            }
        })
    );

    return NextResponse.json(uploadResults, { status: 200 });
}