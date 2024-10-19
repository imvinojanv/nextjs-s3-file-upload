import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises'; // mkdir for directory creation
import sharp from 'sharp';
import path from 'path';

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

        // Define paths
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const thumbDir = path.join(uploadDir, 'thumb');
        const originalImagePath = path.join(uploadDir, fileName);
        const thumbnailImagePath = path.join(thumbDir, fileName);

        console.log("Directories:", uploadDir, thumbDir);

        // Ensure directories exist
        await mkdir(uploadDir, { recursive: true });  // Create uploads folder if it doesn't exist
        await mkdir(thumbDir, { recursive: true });   // Create thumb folder if it doesn't exist

        // Upload original image
        await writeFile(originalImagePath, fileBuffer);
        console.log(`Original image uploaded to: ${originalImagePath}`);

        // Generate and upload thumbnail image
        try {
            const thumbnailBuffer = await sharp(fileBuffer)
                .resize(100, 100, { fit: 'inside' })
                .jpeg({ quality: 80 })  // Set quality to 60%
                .toBuffer();

            console.log("Thumbnail buffer created");

            // Upload thumbnail image
            await writeFile(thumbnailImagePath, thumbnailBuffer);
            console.log(`Thumbnail image uploaded to: ${thumbnailImagePath}`);
        } catch (sharpError) {
            console.error("Error creating thumbnail with sharp:", sharpError);
            return NextResponse.json({ error: 'Thumbnail generation failed' }, { status: 500 });
        }

        // Return URLs
        return NextResponse.json({
            url: `/uploads/${fileName}`,
            thumbUrl: `/uploads/thumb/${fileName}`,
        }, { status: 200 });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
