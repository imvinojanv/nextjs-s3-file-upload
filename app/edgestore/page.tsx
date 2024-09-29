"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import SingleImageUploader from "./_components/single-image-uploader";
import MultiFileUploader from "./_components/multi-file-uploader";
import MultiImageUploader from "./_components/multi-image-uploader";

const EdgestorePage = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <Tabs defaultValue="single" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="single">Single Image Upload</TabsTrigger>
                    <TabsTrigger value="multi-image">Multi Images Upload</TabsTrigger>
                    <TabsTrigger value="multi-file">Multi Files Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="single" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Single Image Upload</p>
                    <SingleImageUploader />
                </TabsContent>
                <TabsContent value="multi-image" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Multi Image Upload</p>
                    <MultiImageUploader />
                </TabsContent>
                <TabsContent value="multi-file" className="pt-8">
                    <p className="mb-2 text-lg font-semibold">Multi File Upload</p>
                    <MultiFileUploader />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default EdgestorePage