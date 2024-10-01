'use client';

import Image from 'next/image';
import { useState } from "react";
import { useS3Upload, getImageData } from "next-s3-upload";

import { Button } from '@/components/ui/button';

const BasicSingleFileUpload = () => {
    let [imageUrl, setImageUrl] = useState<string>();
    let [height, setHeight] = useState<number | undefined>();
    let [width, setWidth] = useState<number | undefined>();
    let { FileInput, openFileDialog, uploadToS3, files } = useS3Upload();

    let handleFileChange = async (file: File) => {
        // let { url } = await uploadToS3(file)                    // It's automatically call the api: POST `/api/s3-upload`
        let { url, bucket, key } = await uploadToS3(file, {
            endpoint: {
                request: {
                    url: "/api/next-s3-upload",                 // It will call custom api: POST `/api/nexts3-upload`
                    body: {},
                    headers: {}
                }
            }
        });      
        let { height, width } = await getImageData(file);
        
        console.log("bucket: " + bucket);                       // nextjs-aws-bucket
        console.log("key: " + key);                             // next-s3-uploads/3e9df94b-6766-41a0-a462-7ee81de5a5a2/Blue-Illustration-Technology-LinkedIn-Banner.png
        console.log("Successfully uploaded to S3!", url);       // https://<bucket>.s3.ap-south-1.amazonaws.com/<key>

        setWidth(width);
        setHeight(height);
        setImageUrl(url);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <FileInput onChange={handleFileChange} />

            <Button onClick={openFileDialog}>Upload file</Button>

            <div className="pt-8">
                {files.map((file, index) => (
                    <div key={index}>
                        File #{index} progress: {file.progress}%
                    </div>
                ))}
            </div>

            {imageUrl && (
                <div>
                    <Image src={imageUrl} width={width} height={height} alt='img' />
                    <div>{imageUrl}</div>
                    <div>
                        {height}x{width}
                    </div>
                </div>
            )}
        </div>
    )
}

export default BasicSingleFileUpload