"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const CloudinaryUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('No file selected');
            return;
        }

        setUploadStatus('Uploading file...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Make POST request to Cloudinary upload API
            const uploadResponse = await fetch('/api/cloudinary/upload-stream', {
                method: 'POST',
                body: formData,
            });

            if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                setFileUrl(uploadData.url);
                console.log("URL: " + uploadData.url);
                setUploadStatus('Upload successful!');
            } else {
                const uploadErrorData = await uploadResponse.json();
                setUploadStatus(`Upload failed: ${uploadErrorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus('An error occurred during the upload.');
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
                    <p>Uploaded File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {fileUrl}
                    </a>
                    <img src={fileUrl} alt="Uploaded File" className="mt-4 max-w-xs" />
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;