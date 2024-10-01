'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const BunnyCDNPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/bunny-cdn', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setFileUrl(data.url); // This is the BunnyCDN URL
                console.log("URL:", data.url);
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error during upload:', error);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <div className='flex gap-4'>
                <Input
                    type="file"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                        }
                    }}
                    className='w-1/2 cursor-pointer'
                />
                <Button onClick={handleUpload}>Upload</Button>
            </div>

            {fileUrl && (
                <div>
                    <p>Uploaded File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
                    <img src={fileUrl} alt="Uploaded file" />
                </div>
            )}
        </div>
    );
}

export default BunnyCDNPage