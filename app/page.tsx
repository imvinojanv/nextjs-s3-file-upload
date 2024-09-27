"use client"

import FileUploadForm from "@/components/file-upload-form"
import FileUploaderDialog from "./_components/file-uploader-dialog"

const Home = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-6">Upload your file</h1>
            <FileUploadForm />
            <div className="mt-8">
                <FileUploaderDialog />
            </div>
        </div>
    )
}

export default Home