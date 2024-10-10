import { NextRequest, NextResponse } from 'next/server';
import imageKit from '@/utils/imagekit';

export async function GET(req: NextRequest) {
    try {
        // Create a presigned URL for client-side uploads
        const authParams = imageKit.getAuthenticationParameters();
        return NextResponse.json(authParams);
    } catch (error) {
        console.error('Error generating auth parameters:', error);
        return NextResponse.json({ error: 'Error generating presigned URL' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name.trim().replace(/\s+/g, '-').toLowerCase()}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Upload the file to Imagekit
        const uploadResponse = await imageKit.upload({
            file: fileBuffer, 
            fileName: fileName.replace(/\.[^/.]+$/, ""), // Remove extension
            folder: 'next-image',
        });

        return NextResponse.json({ url: uploadResponse.url }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file to ImageKit:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
