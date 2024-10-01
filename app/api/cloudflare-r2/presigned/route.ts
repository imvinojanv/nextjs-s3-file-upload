import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(
    req: NextRequest,
) {
    const searchParams = req.nextUrl.searchParams;
    const fileName = searchParams.get('fileName');
    const fileType = searchParams.get('fileType');

    if (!fileName || !fileType) {
        return NextResponse.json({ error: 'Missing fileName or fileType' }, { status: 400 });
    }

    const client = new S3Client({
        region: 'auto', // Cloudflare R2 uses 'auto'
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
    });

    const key = `${Date.now()}-${fileName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
            Key: key,
            ContentType: fileType, // Pass the file type for proper upload behavior
        });

        // Generate the pre-signed URL valid for a set amount of time (e.g., 60 minutes)
        const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

        // Construct the public URL using your custom domain
        const publicUrl = `https://pub-076758bdb2ab4d448a5196ba04383a98.r2.dev/${key}`;

        return NextResponse.json({
            signedUrl, // For uploading
            publicUrl, // This is the public URL that can be accessed after the upload
            key, // Return the file key for future reference
        });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return NextResponse.json({ error: 'Failed to generate pre-signed URL' }, { status: 500 });
    }
}