import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from "sharp";

import { s3Client } from "@/utils/s3-client";

export async function POST(
    request: NextRequest,
) {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Prepare the file for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${file.name.trim().replace(/\s+/g, '-').toLowerCase()}`;
    const thumbFileName = `thumbnails/thumb-${fileName}`;

    const orgUploadParams = {
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
    };

    const thumbBuffer = await sharp(fileBuffer)
        .resize(200, 200, { fit: 'inside' })
        .jpeg({ quality: 100 })  // Set quality to 60%
        .toBuffer();

    const thumbUploadParams = {
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
        Key: thumbFileName,
        Body: thumbBuffer,
        ContentType: file.type,
    };

    try {
        const orgCommand = new PutObjectCommand(orgUploadParams);
        const thumbCommand = new PutObjectCommand(thumbUploadParams);
        
        await Promise.all([s3Client.send(orgCommand), s3Client.send(thumbCommand)]);

        const fileUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;
        const thumbUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${thumbFileName}`;

        return NextResponse.json({ url: fileUrl, thumbUrl, message: "Successfully uploaded the file" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file: ", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}