"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/file-uploader";
import { toast } from "sonner";

const FileUploaderDialog = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("/api/upload/only-upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedUrls(data.urls);
                toast.success("Files uploaded successfully!");
                setFiles([]);
            } else {
                toast.error("Failed to upload files.");
            }
        } catch (error) {
            toast.error("An error occurred during file upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <Dialog onOpenChange={(open) => !open && setFiles([])}>
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
                    <FileUploader
                        maxFileCount={8}
                        maxSize={8 * 1024 * 1024}
                        onValueChange={setFiles}
                    />
                    {files.length > 0 && (
                        <Button onClick={handleUpload} disabled={isUploading} className="mt-4">
                            {isUploading ? "Uploading..." : "Upload to S3"}
                        </Button>
                    )}
                </DialogContent>
            </Dialog>
            {uploadedUrls.length > 0 && uploadedUrls.map(url => (
                <p key={url}>{url}</p>
            ))}
        </>
    );
};

export default FileUploaderDialog;
