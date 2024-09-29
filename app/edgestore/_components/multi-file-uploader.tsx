"use client";

import { useState } from "react";

import {
    MultiFileDropzone,
    type FileState,
} from "@/components/edgestore/multi-file-dropzone";
import { useEdgeStore } from '@/utils/edgestore';

export default function MultiFileUploader() {
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const [urls, setUrls] = useState<string[]>([]);
    const { edgestore } = useEdgeStore();

    function updateFileProgress(key: string, progress: FileState["progress"]) {
        setFileStates((fileStates) => {
            const newFileStates = structuredClone(fileStates);
            const fileState = newFileStates.find(
                (fileState) => fileState.key === key
            );
            if (fileState) {
                fileState.progress = progress;
            }
            return newFileStates;
        });
    };
    console.log("URLs", urls);

    return (
        <div className="flex flex-col items-center m-6">
            <div className="flex gap-4">
                <MultiFileDropzone
                    value={fileStates}
                    onChange={(files) => {
                        setFileStates(files);
                    }}
                    onFilesAdded={async (addedFiles) => {
                        setFileStates([...fileStates, ...addedFiles]);
                        await Promise.all(
                            addedFiles.map(async (addedFileState) => {
                                try {
                                    const res = await edgestore.myProtectedFiles.upload({
                                        file: addedFileState.file,
                                        options: {
                                            temporary: true,
                                        },
                                        onProgressChange: async (progress) => {
                                            updateFileProgress(addedFileState.key, progress);
                                            if (progress === 100) {
                                                // wait 1 second to set it to complete
                                                // so that the user can see the progress bar at 100%
                                                await new Promise((resolve) =>
                                                    setTimeout(resolve, 1000)
                                                );
                                                updateFileProgress(addedFileState.key, "COMPLETE");
                                            }
                                        },
                                    });
                                    setUrls((prev) => [...prev, res.url]);
                                } catch (err) {
                                    updateFileProgress(addedFileState.key, "ERROR");
                                    console.error(err);
                                }
                            })
                        );
                    }}
                />
            </div>
        </div>
    );
}
