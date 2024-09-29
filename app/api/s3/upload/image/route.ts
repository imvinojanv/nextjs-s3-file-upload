import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';

export async function POST(
    request: NextRequest,
) {
    const { objectName, objectUrl } = await request.json();

    if (!process.env.DATABASE_URL) return NextResponse.json(null, { status: 500 });

    const sql = neon(process.env.DATABASE_URL);

    try {
        // Create the user table if it does not exist
        await sql('CREATE TABLE IF NOT EXISTS "s3" (name TEXT, img_url TEXT)');

        // Store the file URL in the database
        // await sql('INSERT INTO s3 (name, img_url) VALUES ($1, $2)', [objectName, objectUrl]);
        await sql`INSERT INTO s3 (name, img_url) VALUES (${objectName}, ${objectUrl})`;

        return NextResponse.json({ message: "Successfully uploaded the file" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file: ", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}