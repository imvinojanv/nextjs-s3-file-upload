"use client";

import { useRef } from "react";
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { Button } from "@/components/ui/button";

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

const authenticator = async () => {
    try {
        const response = await fetch(`/api/imagekit`, { method: "GET" });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const onError = (err: any) => {
    console.log("Error", err);
};

const onSuccess = (res: any) => {
    console.log("Success", res);
};

const onUploadProgress = (progress: any) => {
    console.log("Progress", progress);
};

const onUploadStart = (evt: any) => {
    console.log("Start", evt);
};

const NextImageKit = () => {
    const ikUploadRefTest = useRef<any>(null);

    return (
        <div className="container mx-auto py-12 px-4">
            <h1>ImageKit Image Viewer</h1>
            <IKImage
                urlEndpoint={urlEndpoint}
                path="/Personal/gplus-launch-poster.jpg"
                width={400}
                height={400}
                alt="Alt text"
            />

            {/* Setting ImageKit context */}
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                <h1>Setting ImageKit context</h1>
                {/* Image from S3 */}
                <IKImage
                    path="/IMG-20240821-WA0037.jpg"
                    width={400}
                    height={400}
                    alt="S3 Image"
                />

                {/* From ImageKit Storage */}
                <IKImage
                    path="/Personal/gplus-launch-poster.jpg"
                    width={400}
                    height={400}
                    alt="Alt text"
                />
                <IKImage
                    src="https://ik.imagekit.io/vinojan/Personal/gplus-launch-poster.jpg"
                    width="400"
                    height="400"
                    alt="Alt text"
                />
            </ImageKitProvider>

            {/* File upload */}
            <ImageKitProvider
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={authenticator}
            >
                <h1>ImageKit File upload</h1>
                {/* <IKUpload
                    fileName="test-upload.png"
                    onError={onError}
                    onSuccess={onSuccess}
                /> */}
                <IKUpload
                    fileName="test-upload.jpg"
                    tags={["sample-tag1", "sample-tag2"]}
                    customCoordinates={"10,10,10,10"}
                    isPrivateFile={false}
                    useUniqueFileName={true}
                    responseFields={["tags"]}
                    validateFile={(file) => file.size < 20000000}
                    folder={"/sample-folder"}
                    overwriteFile={true}
                    overwriteAITags={true}
                    overwriteTags={true}
                    overwriteCustomMetadata={true}
                    onError={onError}
                    onSuccess={onSuccess}
                    onUploadProgress={onUploadProgress}
                    onUploadStart={onUploadStart}
                    transformation={{
                      pre: "l-text,i-Vinojan,fs-50,l-end",      // Overlay text: Vinojan
                      post: [
                        {
                          type: "transformation",
                          value: "w-100",
                        },
                      ],
                    }}
                    style={{display: 'none'}}   // hide the default input and use the custom upload button
                    ref={ikUploadRefTest}
                />
                <p>Custom Upload Button</p>
                {ikUploadRefTest && <Button onClick={() => ikUploadRefTest.current?.click()}>Upload</Button>}
            </ImageKitProvider>
        </div>
    );
};

export default NextImageKit;
