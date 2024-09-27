import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUploadForm = () => {
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.url) {
            setUploadedUrl(data.url);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg">
            <input {...getInputProps()} />
            <p>Drag & drop a file here, or click to select one</p>
            {uploadedUrl && (
                <p className="mt-4">
                    File uploaded! View it <a href={uploadedUrl}>here</a>.
                </p>
            )}
        </div>
    );
}

export default FileUploadForm