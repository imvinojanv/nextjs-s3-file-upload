"use client";

import { useState } from "react";

import {
    MultiImageDropzone,
    type FileState,
} from "@/components/edgestore/multi-image-dropzone";
import { useEdgeStore } from '@/utils/edgestore';

const MultiImageUploader = () => {
    const [fileStates, setFileStates] = useState<FileState[]>([]);
    const { edgestore } = useEdgeStore();
    function updateFileProgress(key: string, progress: FileState['progress']) {
        setFileStates((fileStates) => {
            const newFileStates = structuredClone(fileStates);
            const fileState = newFileStates.find(
                (fileState) => fileState.key === key,
            );
            if (fileState) {
                fileState.progress = progress;
            }
            return newFileStates;
        });
    }

    return (
        <div>
            <MultiImageDropzone
                value={fileStates}
                dropzoneOptions={{
                    maxFiles: 6,
                }}
                onChange={(files) => {
                    setFileStates(files);
                }}
                onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                    await Promise.all(
                        addedFiles.map(async (addedFileState) => {
                            try {
                                const res = await edgestore.publicFiles.upload({
                                    file: addedFileState.file as File,
                                    onProgressChange: async (progress) => {
                                        updateFileProgress(addedFileState.key, progress);
                                        if (progress === 100) {
                                            // wait 1 second to set it to complete
                                            // so that the user can see the progress bar at 100%
                                            await new Promise((resolve) => setTimeout(resolve, 1000));
                                            updateFileProgress(addedFileState.key, 'COMPLETE');
                                        }
                                    },
                                });
                                console.log(res);
                            } catch (err) {
                                updateFileProgress(addedFileState.key, 'ERROR');
                            }
                        }),
                    );
                }}
            />
        </div>
    );
}

export default MultiImageUploader