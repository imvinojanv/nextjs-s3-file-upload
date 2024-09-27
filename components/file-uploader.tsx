"use client";

import * as React from "react";
import Image from "next/image";
import { Cross2Icon, FileTextIcon, UploadIcon } from "@radix-ui/react-icons";
import Dropzone, { type DropzoneProps, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useControllableState } from "@/hooks/use-controllable-state";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: File[];
    onValueChange?: (files: File[]) => void;
    onUpload?: (files: File[]) => Promise<void>;
    progresses?: Record<string, number>;
    accept?: DropzoneProps["accept"];
    maxSize?: DropzoneProps["maxSize"];
    maxFileCount?: DropzoneProps["maxFiles"];
    multiple?: boolean;
    disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
    const {
        value: valueProp,
        onValueChange,
        onUpload,
        progresses,
        accept = {
            "image/*": [],
        },
        maxSize = 1024 * 1024 * 2,
        maxFileCount = 1,
        multiple = false,
        disabled = false,
        className,
        ...dropzoneProps
    } = props;

    const [files, setFiles] = useControllableState({
        prop: valueProp,
        onChange: onValueChange,
    });

    const onDrop = React.useCallback(
        async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
                toast.error("Cannot upload more than 1 file at a time");
                return;
            }

            if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
                toast.error(`Cannot upload more than ${maxFileCount} files`);
                return;
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            const updatedFiles = files ? [...files, ...newFiles] : newFiles;

            setFiles(updatedFiles);

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    toast.error(`File ${file.name} was rejected`);
                });
            }

            if (
                onUpload &&
                updatedFiles.length > 0 &&
                updatedFiles.length <= maxFileCount
            ) {
                try {
                    await onUpload(updatedFiles);
                    setFiles([]);
                    toast.success("Files uploaded successfully");
                } catch (error: any) {
                    toast.error(`Failed to upload files: ${error.message}`);
                }
            }
        },
        [files, maxFileCount, multiple, onUpload, setFiles]
    );

    function onRemove(index: number) {
        if (!files) return;
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onValueChange?.(newFiles);
    }

    React.useEffect(() => {
        return () => {
            if (!files) return;
            files.forEach((file) => {
                if (isFileWithPreview(file)) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [files]);

    const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

    return (
        <div className="relative flex flex-col gap-6 overflow-hidden">
            <Dropzone
                onDrop={onDrop}
                accept={accept}
                maxSize={maxSize}
                maxFiles={maxFileCount}
                multiple={maxFileCount > 1 || multiple}
                disabled={isDisabled}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isDragActive && "border-muted-foreground/50",
                            isDisabled && "pointer-events-none opacity-60",
                            className
                        )}
                        {...dropzoneProps}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <UploadIcon
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="font-medium text-muted-foreground">
                                    Drop the files here
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <UploadIcon
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="flex flex-col gap-px">
                                    <p className="font-medium text-muted-foreground">
                                        Drag {`'n'`} drop files here, or click to select files
                                    </p>
                                    <p className="text-sm text-muted-foreground/70">
                                        You can upload
                                        {maxFileCount > 1
                                            ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount}
                                            files (up to ${formatBytes(maxSize)} each)`
                                            : ` a file with ${formatBytes(maxSize)}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dropzone>
            {files?.length ? (
                <ScrollArea className="h-fit w-full px-3">
                    <div className="flex max-h-48 flex-col gap-4">
                        {files?.map((file, index) => (
                            <FileCard
                                key={index}
                                file={file}
                                onRemove={() => onRemove(index)}
                                progress={progresses?.[file.name]}
                            />
                        ))}
                    </div>
                </ScrollArea>
            ) : null}
        </div>
    );
}

interface FileCardProps {
    file: File;
    onRemove: () => void;
    progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5">
                {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    {progress ? <Progress value={progress} /> : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                >
                    <Cross2Icon className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return "preview" in file && typeof file.preview === "string";
}

interface FilePreviewProps {
    file: File & { preview: string };
}

function FilePreview({ file }: FilePreviewProps) {
    if (file.type.startsWith("image/")) {
        return (
            <Image
                src={file.preview}
                alt={file.name}
                width={48}
                height={48}
                loading="lazy"
                className="aspect-square shrink-0 rounded-md object-cover"
            />
        );
    }

    return (
        <FileTextIcon
            className="size-10 text-muted-foreground"
            aria-hidden="true"
        />
    );
}
