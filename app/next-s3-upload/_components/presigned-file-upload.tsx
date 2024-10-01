"use client"

import { useState } from "react";
import { usePresignedUpload } from "next-s3-upload";

import { Button } from "@/components/ui/button";

const PresignedFileUpload = () => {
    let [imageUrl, setImageUrl] = useState<string>();

    // instead of useS3Upload, we'll import and use the
    // usePresignedUpload hook
    let { FileInput, openFileDialog, uploadToS3 } = usePresignedUpload();

    let handleFileChange = async (file: File) => {
        let { url } = await uploadToS3(file);
        setImageUrl(url);
        console.log("Successfully uploaded to S3!", url);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <FileInput onChange={handleFileChange} />

            <Button onClick={openFileDialog}>Upload file</Button>

            {imageUrl && <img src={imageUrl} />}
        </div>
    )
}

export default PresignedFileUpload