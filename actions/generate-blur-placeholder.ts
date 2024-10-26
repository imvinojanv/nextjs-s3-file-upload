"use server"

import sharp from 'sharp';

export async function generateBlurPlaceholder(thumbUrl: string): Promise<string | null> {
    try {
        const response = await fetch(thumbUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Get the image as a buffer
        const imageBuffer = await response.arrayBuffer();

        // Resize and blur the image, then convert it to a base64-encoded string
        const placeholder = await sharp(Buffer.from(imageBuffer))
            .resize({ width: 20 })  // Small width for the blur effect
            .blur()  // Apply a blur effect
            .toBuffer();

        // Convert the buffer to base64
        return `data:image/jpeg;base64,${placeholder.toString('base64')}`;
    } catch (error) {
        console.log("Error generating blur placeholder: ", error);
        return null
    }
}