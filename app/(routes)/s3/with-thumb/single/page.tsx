"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadStatus('Uploading...');
        
        try {
            const res = await fetch('/api/s3/with-thumb/single', {
                method: 'POST',
                body: formData,
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('File URL:', data.url);
                setFileUrl(data.url);
                setThumbnailUrl(data.thumbUrl);
                setUploadStatus('Uploaded successfully...');
                console.log("Thumb:", data.thumbUrl);
            } else {
                const error = await res.json();
                console.error('Error:', error.message);
            }

            // setThumbnailUrl(signedUrlThumbnail.split('?')[0]); // Remove query params from the URL

            setUploadStatus('Upload complete!');
        } catch (error: any) {
            console.error('Upload error:', error);
            setUploadStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />

            <Button className="mt-4" onClick={handleUpload}>Start upload</Button>

            {uploadStatus && <p>{uploadStatus}</p>}
            {fileUrl && (
                <div>
                    <p>Uploaded File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
                    <img src={fileUrl} alt="Uploaded file" />
                </div>
            )}
            {thumbnailUrl && (
                <div>
                    <p>Thumbnail URL:</p>
                    <a href={thumbnailUrl} target="_blank" rel="noopener noreferrer">{thumbnailUrl}</a>
                    <img src={thumbnailUrl} alt="Thumbnail" />
                </div>
            )}
        </div>
    );
}

export default FileUpload;
