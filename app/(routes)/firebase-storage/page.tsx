"use client"

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FirebaseStorage = () => {
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

        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/firebase-storage', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setFileUrl(data.url);
                console.log("URL: ", data.url);
                setUploadStatus('Upload successful!');
            } else {
                const errorData = await res.json();
                setUploadStatus(`Upload failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Upload failed');
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />

            <Button onClick={handleUpload} className='mt-4'>Upload</Button>

            {uploadStatus && <p>{uploadStatus}</p>}
            {fileUrl && (
                <div>
                    <p>Uploaded File URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
                </div>
            )}
        </div>
    )
}

export default FirebaseStorage