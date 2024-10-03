import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/utils/storj-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.NEXT_PUBLIC_STORJ_S3_BUCKET_NAME!;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = `${Date.now()}-${file.name.trim().replace(/\s+/g, '-')}`;

        if (!file || !fileName) {
            return NextResponse.json({ error: 'File or fileName missing' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Upload the file to Storj S3 bucket
        const uploadCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type,
        });

        await s3Client.send(uploadCommand);

        // Construct the Storj file URL
        const fileUrl = `https://link.storjshare.io/raw/<access-grant-id>/${bucketName}/${fileName}`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
