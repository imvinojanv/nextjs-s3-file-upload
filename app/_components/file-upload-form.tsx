import { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploadForm = () => {
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const onDrop = async (files: File[]) => {
        const file = files[0];

        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileData = event.target?.result;
            if (fileData) {
                const presignedURL = new URL('/api/s3/presigned', window.location.href);
                presignedURL.searchParams.set('fileName', file.name);
                presignedURL.searchParams.set('contentType', file.type);

                fetch(presignedURL.toString())
                    .then((res) => res.json())
                    .then((res) => {
                        const body = new Blob([fileData], { type: file.type });
                        console.log("signedUrl:", res.signedUrl.split('?')[0]);
                        
                        fetch(res.signedUrl, {
                            body,
                            method: 'PUT',
                        }).then(() => {
                            fetch('/api/s3/upload/image', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    objectName: file.name,
                                    objectUrl: res.signedUrl.split('?')[0],
                                }),
                            });
                            setUploadedUrl(res.signedUrl.split('?')[0]);
                        });
                    });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg">
            <input {...getInputProps()} />
            <p>Drag & drop a file here, or click to select one</p>
            {uploadedUrl && (
                <p className="mt-4">
                    File uploaded! View it <a href={uploadedUrl} className="underline">here</a>.
                </p>
            )}
        </div>
    );
}

export default FileUploadForm