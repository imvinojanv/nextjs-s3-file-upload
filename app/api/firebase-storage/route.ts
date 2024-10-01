import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Create a storage reference
        const storageRef = ref(storage, `uploads/${file.name}`);

        // Start the upload task
        return new Promise((resolve, reject) => {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Calculate progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);

                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.error('Upload failed:', error);
                    resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
                },
                async () => {
                    // Handle successful upload
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(NextResponse.json({ url: downloadURL }, { status: 200 }));
                }
            );
        });
    } catch (error) {
        console.error('Error processing upload:', error);
        return NextResponse.json({ error: 'Error processing file upload' }, { status: 500 });
    }
}