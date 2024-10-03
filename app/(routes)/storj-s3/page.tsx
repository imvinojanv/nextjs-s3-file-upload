"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const StorjS3Upload = () => {
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

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send POST request to upload the file
            const response = await fetch('/api/storj-s3', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("RES:", data);
                setFileUrl(data.url);
                setUploadStatus('Upload successful!');
            } else {
                const errorData = await response.json();
                setUploadStatus(`Upload failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus('An error occurred during the upload.');
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />

            <Button onClick={handleUpload} className='mt-4'>
                Upload
            </Button>

            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}

            {fileUrl && (
                <div className="mt-4">
                    <p>Uploaded Image URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {fileUrl}
                    </a>
                    <img src={fileUrl} alt="Uploaded File" className="mt-4 max-w-xs" />
                </div>
            )}
        </div>
    );
};

export default StorjS3Upload;
