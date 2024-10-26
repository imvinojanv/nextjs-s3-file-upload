import fetchImageDetailsFromDB from '@/actions/fetch-image-details-from-db';
import { generateBlurPlaceholder } from '@/actions/generate-blur-placeholder';
import ImageGallery from './_components/image-gallery2';

async function processImagePlaceholders(images: DbImagesType[]) {
    const updatedImages = await Promise.all(images.map(async (image) => {
        const blurPlaceholder = await generateBlurPlaceholder(image.thumb_url);
        return { ...image, blurPlaceholder };
    }));
    return updatedImages;
}

const GalleryPage = async () => {
    const data = await fetchImageDetailsFromDB();
    const processedImages = await processImagePlaceholders(data);

    return <ImageGallery processedImages={processedImages}/>
}

export default GalleryPage