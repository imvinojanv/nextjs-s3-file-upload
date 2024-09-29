import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import axios from 'axios';

export async function POST(
    request: NextRequest,
) {
    const sql = neon(process.env.DATABASE_URL || "");

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    try {
        const response = await axios.put(
            `https://storage.bunnycdn.com/${process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME}/${fileName}`,
            fileBuffer,
            {
                headers: {
                    'AccessKey': process.env.NEXT_PUBLIC_BUNNY_CDN_ACCESS_KEY,
                    'Content-Type': file.type,
                    'Content-Length': file.size.toString(),
                },
            }
        );

        const fileUrl = `${process.env.NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL}/${fileName}`;
        console.log("BUNNY URL:", fileUrl);

        // Store the file URL in the database
        await sql`INSERT INTO s3 (name, img_url) VALUES (${file.name}, ${fileUrl})`;

        return NextResponse.json({ url: fileUrl, message: "Successfully uploaded the file" }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}