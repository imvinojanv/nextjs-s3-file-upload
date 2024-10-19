import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { Jimp } from 'jimp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = `${Date.now()}-${file.name.trim().replace(/\s+/g, '-').toLowerCase()}`;

        if (!file || !fileName) {
            return NextResponse.json({ error: 'File or fileName missing' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Upload original image
        await writeFile(`./public/uploads/${fileName}`, fileBuffer);

        // Create a thumbnail using Jimp
        const image = await Jimp.read(fileBuffer);
        image.resize({ w: 200 });  // Resize to 200px width, and set quality to 60%

        const thumbnailBuffer = await image.getBuffer("image/jpeg");

        // Upload thumbnail image
        await writeFile(`./public/uploads/thumb/${fileName}`, thumbnailBuffer);

        return NextResponse.json({ url: `/uploads/${fileName}`, thumbUrl: `/uploads/thumb/${fileName}` }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
