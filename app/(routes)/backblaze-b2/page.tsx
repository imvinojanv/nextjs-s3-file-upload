"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const BackblazeB2Upload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
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

        setUploadStatus('Fetching presigned URL...');

        // Replace spaces with hyphens in the file name or use encodeURIComponent
        const fileName = encodeURIComponent(`${Date.now()}-${file.name.trim().replace(/\s+/g, '-')}`);

        try {
            // Step 1: Fetch the presigned URL
            const response = await fetch(`/api/backblaze-b2?fileName=${fileName}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                const presignedUrl = data.url;
                setPresignedUrl(presignedUrl);
                setUploadStatus("Presigned URL fetched!");

                // Step 2: Upload the file to the presigned URL
                setUploadStatus('Uploading file...');

                const formData = new FormData();
                formData.append('file', file);

                const uploadResponse = await fetch(`/api/backblaze-b2?fileName=${fileName}`, {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    setFileUrl(uploadData.url);
                    setUploadStatus('Upload successful!');
                } else {
                    const uploadErrorData = await uploadResponse.json();
                    setUploadStatus(`Upload failed: ${uploadErrorData.error}`);
                }
            } else {
                const errorData = await response.json();
                setUploadStatus(`Failed to fetch presigned URL: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setUploadStatus('An error occurred during the process.');
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />

            <Button onClick={handleUpload} className='mt-4'>
                Upload
            </Button>

            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}

            {presignedUrl && (
                <div className="mt-4">
                    <p>Presigned URL:</p>
                    <a href={presignedUrl} target="_blank" rel="noopener noreferrer">
                        {presignedUrl}
                    </a>
                </div>
            )}

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

export default BackblazeB2Upload;