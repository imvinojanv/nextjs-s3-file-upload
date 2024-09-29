import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from "@/utils/s3-client";

export async function GET(
    request: NextRequest,
) {
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get('fileName');
    const contentType = searchParams.get('contentType');

    if (!fileName || !contentType) {
        return new Response(null, { status: 500 });
    }

    const fileKey = `${Date.now().toString()}-${fileName}`;     // for uniqueness of the url

    const uploadParams = {
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
        Key: fileKey,
        ContentType: contentType,
    };

    const command = new PutObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    if (signedUrl) return NextResponse.json({ signedUrl }, { status: 200 });
    return NextResponse.json(null, { status: 500 });
}