import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
import { Readable } from "stream";

// Helper function to convert Buffer to a readable stream
function bufferToStream(buffer: Buffer) {
    const readable = new Readable();
    readable._read = () => {}; // _read is required, but you can noop it
    readable.push(buffer);
    readable.push(null); // Push null to signal end of the stream
    return readable;
}

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

        // Create a custom file name format
        const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));        // Remove the file extension
        const fileName = `${Date.now()}-${fileNameWithoutExtension.trim().replace(/\s+/g, '-').toLowerCase()}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Convert the buffer into a stream 
        const stream = bufferToStream(fileBuffer);

        // Wrap the upload logic inside a Promise
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    resource_type: "auto",
                    folder: 'next-image', // Specify the folder name here
                    public_id: fileName,  // Custom file name
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            // Pipe it into the Cloudinary upload stream
            stream.pipe(uploadStream);
        });

        // Ensure the result is valid and return the URL
        if (uploadResult && typeof uploadResult === "object") {
            return NextResponse.json(
                { url: (uploadResult as any).secure_url },
                { status: 200 }
            );
        }

        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
