'use client';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import BasicSingleFileUpload from './_components/basic-single-file-upload';
import CustomFileInput from './_components/custom-file-input';
import MultiFileUpload from './_components/multi-file-upload';
import PresignedFileUpload from './_components/presigned-file-upload';

const NextS3UploadPage = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <Tabs defaultValue="basic" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="basic">Basic Single File Upload</TabsTrigger>
                    <TabsTrigger value="custom-file-input">Custom File Input</TabsTrigger>
                    <TabsTrigger value="multi-file">Multi Files Upload</TabsTrigger>
                    <TabsTrigger value="presigned">Presigned Files Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Single Image Upload</p>
                    <BasicSingleFileUpload />
                </TabsContent>
                <TabsContent value="custom-file-input" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Custom File Input</p>
                    <CustomFileInput />
                </TabsContent>
                <TabsContent value="multi-file" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Multi File Upload</p>
                    <MultiFileUpload />
                </TabsContent>
                <TabsContent value="presigned" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Multi File Upload</p>
                    <PresignedFileUpload />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default NextS3UploadPage