"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ImagePreviewOverlay from './image-preview-overlay';

interface ImageGalleryProps {
    processedImages: DbImagesType[];
}

const ImageGallery = ({ processedImages }: ImageGalleryProps) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    
    return (
        <div className="mx-auto max-w-[1960px] p-4">
            <h1 className="mt-2 text-center text-2xl font-semibold tracking-wide">IMAGE GALLERY</h1>
            <div className="mt-6 columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
                {processedImages.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className="group relative mb-5 block w-full cursor-zoom-in"
                    >
                        <Image
                            alt={image.name}
                            className="transform rounded-lg brightness-90 transition group-hover:brightness-110"
                            style={{ transform: "translate3d(0, 0, 0)" }}
                            placeholder="blur"
                            blurDataURL={image.blurPlaceholder as string}
                            src={image.img_url}
                            width={720}
                            height={480}
                            sizes="(max-width: 640px) 100vw,
                                    (max-width: 1280px) 50vw,
                                    (max-width: 1536px) 33vw,
                                    25vw"
                        />
                    </button>
                ))}
            </div>

            {selectedImageIndex !== null && (
                <ImagePreviewOverlay
                    images={processedImages}
                    initialIndex={selectedImageIndex}
                    onClose={() => setSelectedImageIndex(null)}
                />
            )}
        </div>
    )
}

export default ImageGallery