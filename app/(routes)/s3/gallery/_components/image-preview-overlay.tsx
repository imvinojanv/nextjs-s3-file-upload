"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type ImagePreviewOverlayProps = {
    images: DbImagesType[];
    initialIndex: number;
    onClose: () => void;
};

const ImagePreviewOverlay = ({ images, initialIndex, onClose }: ImagePreviewOverlayProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        // Close overlay on pressing 'Escape' key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            // Re-enable background scrolling
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const currentImage = images[currentIndex];

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-md">
            {/* Close button */}
            <button
                className="absolute top-5 right-5 text-white text-2xl font-bold"
                onClick={onClose}
            >
                &times;
            </button>

            {/* Main preview image centered with max dimensions */}
            <div className="max-w-[80vw] max-h-[80vh] flex items-center justify-center">
                <Link
                    href={currentImage.img_url}
                    target='_blank'
                >
                    <Image
                        src={currentImage.img_url}
                        alt={currentImage.name}
                        width={720}
                        height={480}
                        className="rounded-lg transition-all duration-300"
                        placeholder="blur"
                        blurDataURL={currentImage.blurPlaceholder as string}
                    />
                </Link>
            </div>

            {/* Horizontal scrollable thumbnail list positioned at the bottom */}
            <div className="absolute bottom-10 flex w-full max-w-7xl justify-center overflow-x-auto space-x-2 px-4 py-2">
                {images.map((image, index) => (
                    <button
                        key={image.id}
                        onClick={() => setCurrentIndex(index)}
                        className='relative w-[300px] h-[80px]'
                    >
                        <Image
                            src={image.thumb_url}
                            alt={`Thumbnail ${index + 1}`}
                            width={180}
                            height={120}
                            className={`rounded-md cursor-pointer transition-transform duration-200 ${currentIndex === index
                                ? 'border-2 border-blue-500 brightness-110 opacity-100'
                                : 'opacity-80 hover:opacity-100'
                                } h-full transform object-cover transition`}
                            placeholder="blur"
                            blurDataURL={image.blurPlaceholder as string}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImagePreviewOverlay;