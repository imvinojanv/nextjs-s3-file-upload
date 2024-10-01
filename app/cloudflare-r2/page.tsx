"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CloudflareR2 = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploadStatus('Getting pre-signed URL...');

        try {
            // 1. Get the pre-signed URL from your API
            const res = await fetch(`/api/cloudflare-r2/presigned?fileName=${file.name}&fileType=${file.type}`);
            const data = await res.json();

            if (!res.ok) {
                setUploadStatus(`Error: ${data.error}`);
                return;
            }
            console.log("signed URL: ", data.publicUrl);

            setUploadStatus('Uploading to Cloudflare R2...');

            // 2. Use the pre-signed URL to upload the file
            const uploadRes = await fetch(data.signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            if (uploadRes.ok) {
                setUploadStatus('Upload successful!');
                setFileUrl(data.publicUrl); // Set the public URL after successful upload
            } else {
                setUploadStatus('Upload failed.');
            }
        } catch (error) {
            setUploadStatus('Upload failed.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange}/>

            <Button className="mt-4" onClick={handleUpload}>Start upload</Button>

            {uploadStatus && <p>{uploadStatus}</p>}
            {fileUrl && (
                <div>
                    <p>Uploaded File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
                    <img src={fileUrl} alt="Uploaded file" />
                </div>
            )}
        </div>
    )
}

export default CloudflareR2