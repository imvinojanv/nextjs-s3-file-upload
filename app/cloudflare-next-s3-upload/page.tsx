"use client"

import { useState } from "react";
import { usePresignedUpload } from "next-s3-upload";

import { Button } from "@/components/ui/button";

const CloudflareNextS3Upload = () => {
    let [imageUrl, setImageUrl] = useState<string>();
    let { FileInput, openFileDialog, uploadToS3 } = usePresignedUpload();

    let handleFileChange = async (file: File) => {
        let { url } = await uploadToS3(file, {
            endpoint: {
                request: {
                    url: "/api/cloudflare-next-s3-upload",
                    body: {},
                    headers: {}
                }
            }
        });

        console.log("URL", url);
        setImageUrl(url);

        // setImageUrl(
        //     url.replace(
        //         "https://30055f483357d04a365758d2d60d5f84.r2.cloudflarestorage.com/nextjs-file-upload",

        //         "https://pearsonlanka.life"
        //     )
        // );
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <FileInput onChange={handleFileChange} />

            <Button onClick={openFileDialog}>Upload file</Button>

            {imageUrl && <img src={imageUrl} />}
        </div>
    )
}

export default CloudflareNextS3Upload