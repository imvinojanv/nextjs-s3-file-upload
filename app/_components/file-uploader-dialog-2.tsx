"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader2 } from "@/components/file-uploader-2";

const FileUploaderDialog2 = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const handleUpload = async (
        files: File[],
        setProgress: (fileName: string, progress: number) => void
    ) => {
        const urls: string[] = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);

            const xhr = new XMLHttpRequest();

            // xhr.upload.onprogress = (event) => {
            //     if (event.lengthComputable) {
            //         const percentComplete = (event.loaded / event.total) * 100;
            //         console.log(`Uploading ${file.name}: ${percentComplete}%`);
            //         setProgress(file.name, percentComplete);
            //     }
            // };
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    let percentComplete = (event.loaded / event.total) * 100;
                    if (percentComplete > 76) {
                        percentComplete = 76; // Hold the progress bar at 95%
                    }
                    setProgress(file.name, percentComplete);
                }
            };
    
            xhr.open("POST", "/api/s3/upload", true);
    
            const startTime = performance.now();
    
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const endTime = performance.now();
                    const uploadTime = (endTime - startTime) / 1000;
                    console.log(`Time to upload ${file.name}: ${uploadTime} seconds`);
    
                    if (xhr.status === 200) {
                        setProgress(file.name, 100); // Ensure progress is set to 100%
                        const response = JSON.parse(xhr.responseText);
                        urls.push(response.url);
                        setUploadedUrls((prevUrls) => [...prevUrls, response.url]);
                        console.log(`File uploaded: ${response.url}`);
                    } else {
                        console.error(`Failed to upload file: ${file.name}`);
                    }
                }
            };
    
            xhr.send(formData);
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Upload files {files.length > 0 && `(${files.length})`}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Upload files</DialogTitle>
                    <DialogDescription>
                        Drag and drop your files here or click to browse.
                    </DialogDescription>
                </DialogHeader>
                <FileUploader2
                    maxFileCount={8}
                    maxSize={8 * 1024 * 1024}
                    onValueChange={setFiles}
                    onUpload={handleUpload}
                />
                <div className="mt-4">
                    <h3 className="text-lg font-medium">Uploaded URLs:</h3>
                    <ul className="list-disc pl-5">
                        {uploadedUrls.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FileUploaderDialog2;
