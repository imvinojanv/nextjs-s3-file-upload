import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const fileName = `${Date.now()}-${file.name.trim().replace(/\s+/g, '-').toLowerCase()}`;

        if (!file || !fileName) {
            return NextResponse.json({ error: 'File or fileName missing' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        await writeFile(`./public/uploads/${fileName}`, fileBuffer);

        return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
