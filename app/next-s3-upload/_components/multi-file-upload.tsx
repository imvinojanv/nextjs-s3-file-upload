"use client"

import { useState } from "react";
import { useS3Upload } from "next-s3-upload";
import { Input } from "@/components/ui/input";

const MultiFileUpload = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const { uploadToS3 } = useS3Upload();

    const handleFilesChange = async ({ target }: any) => {
        const files = Array.from(target.files);

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const { url } = await uploadToS3(file as File);

            setUrls(current => [...current, url]);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Input
                type="file"
                name="file"
                multiple={true}
                onChange={handleFilesChange}
            />

            <div>
                {urls.map((url, index) => (
                    <div key={url}>
                        File {index}: ${url}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MultiFileUpload