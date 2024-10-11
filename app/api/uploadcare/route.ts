import { NextRequest, NextResponse } from "next/server";

const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
const UPLOADCARE_SECRET_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_SECRET_KEY;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Create Uploadcare's upload URL
        const uploadUrl = `https://upload.uploadcare.com/base/`;

        const formBody = new FormData();
        formBody.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY as string);
        formBody.append("UPLOADCARE_STORE", "1"); // Store the file
        formBody.append("file", file);

        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            body: formBody,
        });

        if (!uploadResponse.ok) {
            throw new Error("Failed to upload to Uploadcare");
        }

        const uploadResult = await uploadResponse.json();
        const fileUrl = `https://ucarecdn.com/${uploadResult.file}/`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
