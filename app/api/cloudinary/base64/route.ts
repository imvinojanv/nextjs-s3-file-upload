import { NextRequest, NextResponse } from "next/server";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import cloudinary from "@/utils/cloudinary";

type UploadResponse =
    | { success: true; result?: UploadApiResponse }
    | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
    fileUri: string,
    fileName: string
): Promise<UploadResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload(fileUri, {
                invalidate: true,
                resource_type: "auto",
                filename_override: fileName,
                folder: "product-images", // any sub-folder name in your cloud
                use_filename: true,
            })
            .then((result) => {
                resolve({ success: true, result });
            })
            .catch((error) => {
                reject({ success: false, error });
            });
    });
};

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

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const mimeType = file.type;
        const encoding = "base64";
        const base64Data = fileBuffer.toString("base64");

        const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

        const res = await uploadToCloudinary(fileUri, file.name);

        if (res.success && res.result) {
            return NextResponse.json({
                message: "success",
                url: res.result.secure_url,
            });
        } else return NextResponse.json({ message: "failure" });
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
