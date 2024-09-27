"use client"

import FileUploadForm from "@/components/file-upload-form"

const Home = () => {
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-2xl font-bold mb-6">Upload your file</h1>
            <FileUploadForm />
        </div>
    )
}

export default Home