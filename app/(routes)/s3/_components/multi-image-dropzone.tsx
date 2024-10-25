'use client';

import { UploadCloudIcon, X } from 'lucide-react';
import * as React from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const variants = {
    base: 'relative bg-slate-100 bg-opacity-60 rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] min-w-[200px] border border-dashed border-gray-300 transition-colors duration-200 ease-in-out',
    image: 'border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-slate-900 rounded-md',
    active: 'border-2',
    disabled: 'bg-gray-100 cursor-default pointer-events-none bg-opacity-30',
    accept: 'border border-blue-500 bg-blue-500 bg-opacity-10',
    reject: 'border border-red-700 bg-red-700 bg-opacity-10',
};

type InputProps = {
    width: number;
    height: number;
    className?: string;
    value?: File[] | string[];
    onChange?: (files: File[]) => void | Promise<void>;
    disabled?: boolean;
    maxFiles?: number;
    dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
};

const ERROR_MESSAGES = {
    fileTooLarge(maxSize: number) {
        return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
    },
    fileInvalidType() {
        return 'Invalid file type.';
    },
    tooManyFiles(maxFiles: number) {
        return `You can only add ${maxFiles} file(s).`;
    },
    fileNotSupported() {
        return 'The file is not supported.';
    },
};

const MultiImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
    ({ dropzoneOptions, width, height, value = [], className, disabled, maxFiles, onChange }, ref) => {
        const fileUrls = React.useMemo(() => {
            return (value as (File | string)[]).map((file) =>
                typeof file === 'string' ? file : URL.createObjectURL(file)
            );
        }, [value]);

        const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, fileRejections } =
            useDropzone({
                accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/avif': [] },
                multiple: true,
                disabled,
                maxFiles,
                onDrop: (acceptedFiles) => {
                    const newFiles = [...(value as File[]), ...acceptedFiles].slice(0, 8);
                    void onChange?.(newFiles);
                },
                ...dropzoneOptions,
            });

        const dropZoneClassName = React.useMemo(
            () =>
                twMerge(
                    variants.base,
                    isFocused && variants.active,
                    disabled && variants.disabled,
                    isDragReject && variants.reject,
                    isDragAccept && variants.accept,
                    className
                ),
            [isFocused, isDragAccept, isDragReject, disabled, className]
        );

        const errorMessage = React.useMemo(() => {
            if (fileRejections[0]) {
                const { errors } = fileRejections[0];
                if (errors[0]?.code === 'file-too-large') {
                    return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
                } else if (errors[0]?.code === 'file-invalid-type') {
                    return ERROR_MESSAGES.fileInvalidType();
                } else if (errors[0]?.code === 'too-many-files') {
                    return ERROR_MESSAGES.tooManyFiles(maxFiles ?? 0);
                } else {
                    return ERROR_MESSAGES.fileNotSupported();
                }
            }
            return undefined;
        }, [fileRejections, dropzoneOptions]);

        return (
            <div className="grid grid-cols-3 gap-4">
                {fileUrls.map((url, index) => (
                    <div key={index} className="relative">
                        <img
                            className="h-full w-full rounded-md object-cover"
                            src={url}
                            alt={`Preview ${index + 1}`}
                        />
                        <div
                            className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                const newFiles = (value as File[]).filter((_, i) => i !== index);
                                void onChange?.(newFiles);
                            }}
                        >
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-white/70 bg-black transition-all duration-300 hover:h-6 hover:w-6">
                                <X className="text-white/70" width={16} height={16} />
                            </div>
                        </div>
                    </div>
                ))}
            <div>
                <div {...getRootProps({ className: dropZoneClassName, style: { width: "100%", height } })}>
                    <input ref={ref} {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center text-xs text-gray-400">
                        <UploadCloudIcon className="mb-2 h-7 w-7" />
                        <div className="text-gray-400">drag & drop to upload</div>
                        <div className="mt-3">
                            <Button disabled={disabled}>select</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
            </div>
            </div>
        );
    }
);
MultiImageDropzone.displayName = 'MultiImageDropzone';

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => {
        return (
            <button
                className={twMerge(
                    'focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
                    'border border-blue-600 bg-blue-500 text-gray-100 shadow hover:bg-blue-600',
                    'rounded-md px-3 pt-1 pb-1.5 text-xs',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

function formatFileSize(bytes?: number) {
    if (!bytes) {
        return '0 Bytes';
    }
    bytes = Number(bytes);
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export { MultiImageDropzone };