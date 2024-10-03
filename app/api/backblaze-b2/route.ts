import { NextRequest, NextResponse } from 'next/server';
import b2, { authorizeB2 } from '@/utils/backblaze';
import axios from 'axios';

// GET method to generate a presigned URL for file upload
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const fileName = searchParams.get('fileName');

        // Authorize Backblaze B2
        await authorizeB2();

        const fileUrl = `https://f005.backblazeb2.com/file/${process.env.NEXT_PUBLIC_B2_BUCKET_NAME}/${fileName}`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 });
    }
}

// POST method to handle file upload and return the public file URL
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const searchParams = req.nextUrl.searchParams;
        
        const file = formData.get('file') as File;
        const fileName = searchParams.get('fileName');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Authorize Backblaze B2
        await authorizeB2();

        const bucketId = process.env.NEXT_PUBLIC_B2_BUCKET_ID!;

        // Get Upload URL and Authorization Token
        const { data: uploadUrlData } = await b2.getUploadUrl({ bucketId });
        const uploadUrl = uploadUrlData.uploadUrl;
        const uploadAuthToken = uploadUrlData.authorizationToken;

        // Prepare the file for upload
        const arrayBuffer = await file.arrayBuffer();
        const fileContents = Buffer.from(arrayBuffer);

        // Upload the file
        const uploadResponse = await axios.post(uploadUrl, fileContents, {
            headers: {
                Authorization: uploadAuthToken,
                'X-Bz-File-Name': fileName,  // encoded file name
                'Content-Type': file.type,
                'X-Bz-Content-Sha1': 'do_not_verify',
            },
        });

        // Construct the file URL
        const fileUrl = `https://f005.backblazeb2.com/file/${process.env.NEXT_PUBLIC_B2_BUCKET_NAME}/${fileName}`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
