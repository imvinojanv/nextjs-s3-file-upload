"use server";

import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "@/utils/s3-client";
import { randomUUID } from "crypto";

export async function handleFileUpload(files: File[]) {
    if (!files || files.length === 0) {
        return null;
    }

    const uploadPromises = files.map(async (file) => {
        const fileKey = `${randomUUID()}-${file.name}`;

        const uploadParams = {
            Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
            Key: fileKey,
            Body: file.stream(),
            ContentType: file.type,
        };

        const upload = new Upload({
            client: s3Client,
            params: uploadParams,
        });

        await upload.done();

        return `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileKey}`;
    });

    try {
        const fileUrls = await Promise.all(uploadPromises);
        return fileUrls;
    } catch (error) {
        console.error("Error uploading files: ", error);
        return null;
    }
}
