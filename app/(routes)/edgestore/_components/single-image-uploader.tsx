'use client';

import Link from "next/link";
import { useState } from 'react';

import { SingleImageDropzone } from '@/components/edgestore/single-image-dropzone';
import { useEdgeStore } from '@/utils/edgestore';
import { Button } from '@/components/ui/button';

const SingleImageUploader = () => {
    const [file, setFile] = useState<File>();
    const [progress, setProgress] = useState(0);
    const [urls, setUrls] = useState<{
        url: string;
        thumbnailUrl: string | null;
    }>();
    const { edgestore } = useEdgeStore();

    return (
        <div className="container mx-auto py-12 px-4">
            <SingleImageDropzone
                width={200}
                height={200}
                value={file}
                dropzoneOptions={{
                    maxSize: 1024 * 1024 * 10, // 10MB
                }}
                onChange={(file) => {
                    setFile(file);
                }}
            />
            <div className="h-2 mt-4 w-48 border rounded overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all duration-150"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>
            <Button
                className="mt-4"
                onClick={async () => {
                    if (file) {
                        const res = await edgestore.myPublicImages.upload({
                            file,
                            input: { type: "post" },
                            onProgressChange: (progress) => {
                                console.log(progress);
                                setProgress(progress);
                            },
                        });
                        console.log(res);
                        // save your data here
                        setUrls({
                            url: res.url,
                            thumbnailUrl: res.thumbnailUrl,
                        });
                    }
                }}
            >
                Upload
            </Button>
            <div className="mt-4 flex flex-col gap-y-2">
                {urls?.url && (
                    <Link href={urls.url} target="_blank">
                        URL
                    </Link>
                )}
                {urls?.thumbnailUrl && (
                    <Link href={urls.thumbnailUrl} target="_blank">
                        THUMBNAIL
                    </Link>
                )}
            </div>
        </div>
    );
}

export default SingleImageUploader