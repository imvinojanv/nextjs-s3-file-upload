"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ImageKitUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("No file selected");
            return;
        }

        setUploadStatus("Generating presigned URL...");

        // Generate presigned auth parameters from the backend with the fileName
        const authResponse = await fetch(`/api/imagekit`, { method: "GET" });

        if (!authResponse.ok) {
            const error = await authResponse.json();
            setUploadStatus(error.message || "Failed to get presigned URL");
            return;
        }

        const authParams = await authResponse.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "publicKey",
            process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
        );
        formData.append("signature", authParams.signature);
        formData.append("expire", authParams.expire);
        formData.append("token", authParams.token);

        try {
            setUploadStatus("Uploading file...");
            const uploadResponse = await fetch("/api/imagekit", {
                method: "POST",
                body: formData,
            });

            if (uploadResponse.ok) {
                const data = await uploadResponse.json();
                setFileUrl(data.url);
                setUploadStatus("Upload successful");
            } else {
                const error = await uploadResponse.json();
                setUploadStatus(error.message || "Upload failed");
            }
        } catch (error) {
            setUploadStatus("An error occurred during upload");
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} className="mt-4">
                Upload
            </Button>
            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
            {fileUrl && (
                <div className="mt-4">
                    <p>Uploaded Image URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {fileUrl}
                    </a>
                    <img
                        src={fileUrl}
                        alt="Uploaded File"
                        className="mt-4 max-w-xs"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageKitUpload;
