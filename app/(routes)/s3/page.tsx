"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import FileUploadForm from "@/app/_components/file-upload-form";
import FileUploaderDialog1 from "@/app/_components/file-uploader-dialog-1";
import FileUploaderDialog2 from "../_components/file-uploader-dialog-2";

const S3Page = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <Tabs defaultValue="basic" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="1">Type 1</TabsTrigger>
                    <TabsTrigger value="2">Type 2</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Basic file upload</p>
                    <FileUploadForm />
                </TabsContent>
                <TabsContent value="1" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Upload bulk files and set URLs</p>
                    <FileUploaderDialog1 />
                </TabsContent>
                <TabsContent value="2" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Upload bulk files and set URLs</p>
                    <FileUploaderDialog2 />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default S3Page