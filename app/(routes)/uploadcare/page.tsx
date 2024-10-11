"use client";

import { useState } from 'react';
import UploadcareImage from '@uploadcare/nextjs-loader';
import { uploadFile } from '@uploadcare/upload-client'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const UPLOADCARE_PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

const UploadcareUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    // Using FileUploaderRegular
    const [files, setFiles] = useState<any[]>([]);
    const handleChangeEvent = (e: any) => {
        setFiles([
            ...e.allEntries.filter((file: any) => file.status === "success"),
        ]);
    };
    console.log(files);
    const handleUploadFailed = (e: any) => {
        console.log(e.errors[0]);
    };

    // Upload file with local api
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile || null);
    };
    const handleUploadWithLocalApi = async () => {
        if (!file) {
            setUploadStatus('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploadStatus('Uploading...');

        try {
            const response = await fetch('/api/uploadcare', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setFileUrl(data.url);
                setUploadStatus('Upload successful!');
            } else {
                const errorData = await response.json();
                setUploadStatus(`Upload failed: ${errorData.error}`);
            }
        } catch (error) {
            setUploadStatus('Error occurred during upload');
        }
    };

    // Upload file with Uploadcare API
    const handleUploadWithUploadcareApi = async () => {
        if (!file) {
            setUploadStatus('No file selected');
            return;
        }
        setUploadStatus('Uploading...');

        // fileData must be Blob or File or Buffer
        const result = await uploadFile(
            file,
            {
                publicKey: UPLOADCARE_PUBLIC_KEY as string,
                store: 'auto',
                metadata: {
                    subsystem: 'js-client',
                    pet: 'cat'
                }
            }
        );

        const resUrl = `https://ucarecdn.com/${result.uuid}/`;
        setFileUrl(resUrl);
        setUploadStatus('Upload successful!');
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />

            <div className='space-x-4'>
                <Button onClick={handleUploadWithLocalApi} className="mt-4">
                    Upload with Local API
                </Button>

                <Button onClick={handleUploadWithUploadcareApi} className="mt-4">
                    Upload with Uploadcare API
                </Button>
            </div>

            <div className='mt-4'>
                <FileUploaderRegular
                    sourceList="local, url, camera, dropbox"
                    classNameUploader="uc-light"
                    pubkey={UPLOADCARE_PUBLIC_KEY}
                    onChange={handleChangeEvent}
                    onFileUploadFailed={handleUploadFailed}
                    confirmUpload={true}        // Enables user confirmation for starting uploads.
                    imgOnly={true}      // Accept images only
                    maxLocalFileSizeBytes={10000000}     // Maximum file size: 10MB
                />
                {files.length > 0 &&
                    files.map((file) => (
                        <div key={file.uuid}>
                            <UploadcareImage
                                src={file.cdnUrl}
                                width={500}
                                height={500}
                                alt={file.name}
                            />
                            <p>{file.name}</p>
                        </div>
                    ))
                }
            </div>

            {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
            {fileUrl && (
                <div className="mt-4">
                    <p>Uploaded Image URL:</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {fileUrl}
                    </a>
                    <UploadcareImage
                        alt="Test image"
                        src={fileUrl}
                        width="400"
                        height="300"
                    />
                </div>
            )}
        </div>
    );
};

export default UploadcareUpload;
