import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_STORJ_S3_REGION,
    endpoint: process.env.NEXT_PUBLIC_STORJ_S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_STORJ_S3_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_STORJ_S3_SECRET_KEY!,
    },
    forcePathStyle: true, // Required for Storj
});