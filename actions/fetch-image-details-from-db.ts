"use server"

import { neon } from '@neondatabase/serverless';

export default async function fetchImageDetailsFromDB(): Promise<DbImagesType[]> {
    const sql = neon(process.env.DATABASE_URL || "");

    try {
        const data = await sql`SELECT * FROM s3`;
        return new Promise((resolve) => resolve(data as DbImagesType[]));
    } catch (error) {
        console.error("Failed to fetch image details:", error);
        return [];
    }
}