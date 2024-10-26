"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ImageGalleryProps {
    processedImages: DbImagesType[];
}

const ImageGallery = ({ processedImages }: ImageGalleryProps) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    
    return (
        <div className='mx-auto max-w-[1960px] p-4'>
            <h1 className='mt-2 text-center text-2xl font-semibold tracking-wide'>IMAGE GALLERY</h1>
            <div className="mt-6 columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
                {processedImages.map((image) => (
                    <Link
                        key={image.id}
                        href={image.img_url}
                        target='_blank'
                        className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                    >
                        <Image
                            alt="Next.js Conf photo"
                            className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
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
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ImageGallery