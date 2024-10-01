"use client"

import { useState } from "react";
import { useS3Upload } from "next-s3-upload";

import { Input } from "@/components/ui/input";

const CustomFileInput = () => {
    let [imageUrl, setImageUrl] = useState<string>();
    let { uploadToS3 } = useS3Upload();

    let handleFileChange = async (event: any) => {
        let file = event.target.files[0];
        let { url } = await uploadToS3(file as File);

        setImageUrl(url);
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input type="file" onChange={handleFileChange} />

            {imageUrl && <img src={imageUrl} />}
        </div>
    )
}

export default CustomFileInput