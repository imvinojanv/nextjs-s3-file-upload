"use client"

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiImageDropzone } from "../../_components/multi-image-dropzone";

const FileUpload = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string>('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    const handleUpload = async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));

        setUploadStatus('Uploading...');

        try {
            const res = await fetch('/api/s3/with-thumb/multi', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Response Data:', data);

                if (Array.isArray(data)) {
                    data.forEach((fileObj, index) => {
                        console.log(`File ${index + 1} Name:`, fileObj.fileName);
                        console.log(`File ${index + 1} URL:`, fileObj.url);
                        console.log(`File ${index + 1} Thumbnail:`, fileObj.thumbUrl);
                    });

                    setUploadStatus('Uploaded successfully...');
                } else {
                    throw new Error('Unexpected response format');
                }
            } else {
                const error = await res.json();
                console.error('Error:', error.error);
                setUploadStatus(`Error: ${error.error}`);
            }

        } catch (error: any) {
            console.error('Upload error:', error);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <MultiImageDropzone
                width={200}
                height={200}
                value={files}
                dropzoneOptions={{
                    maxSize: 1024 * 1024 * 8, // 8MB
                }}
                maxFiles={8}
                onChange={(files) => {
                    setFiles(files);
                    console.log("NO:", files.length);
                }}
            />

            <Button className="mt-4" onClick={handleUpload}>
                upload Images
            </Button>

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
