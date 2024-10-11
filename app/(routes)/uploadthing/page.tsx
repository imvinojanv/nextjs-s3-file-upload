"use client"

import { useState } from 'react';

import { UploadButton, UploadDropzone } from '@/utils/uploadthing';

const UploadThingUpload = () => {
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    // Callback for when the upload is complete
    const handleUploadComplete = (files: any) => {
        const uploadedFile = files[0];
        setFileUrl(uploadedFile.url); // Get the file URL
        setUploadStatus("Upload successful!");
    };

    const handleUploadError = (error: any) => {
        console.error("Upload error:", error);
        setUploadStatus("Upload failed");
    };

    return (
        <div className="container mx-auto py-12 px-4">
            {/* <UploadButton
                endpoint="imageUpload" // Refer to the route defined in your file router
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
            /> */}

            <UploadDropzone
                endpoint="imageUpload"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
            />

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
    )
}

export default UploadThingUpload