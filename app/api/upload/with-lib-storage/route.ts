import { NextRequest, NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import { neon } from '@neondatabase/serverless';

import { s3Client } from "@/utils/s3-client";

export async function POST(
    request: NextRequest,
) {
    const sql = neon(process.env.DATABASE_URL || "");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileKey = `${randomUUID()}-${file.name}`;
    const uploadParams = {
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
        Key: fileKey,
        Body: file,
        ContentType: file.type,
    };

    try {
        const upload = new Upload({
            client: s3Client,
            params: uploadParams,
        });

        await upload.done();

        const fileUrl = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileKey}`;

        // Store the file URL in the database
        const data = await sql`INSERT INTO s3 (name, img_url) VALUES (${file.name}, ${fileUrl})`;

        return NextResponse.json({ url: fileUrl, message: "Failed to upload file" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file: ", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}