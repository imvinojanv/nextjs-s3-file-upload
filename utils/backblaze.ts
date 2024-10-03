// /utils/b2.ts
import B2 from 'backblaze-b2';

const b2 = new B2({
    applicationKeyId: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY_ID!,
    applicationKey: process.env.NEXT_PUBLIC_B2_APPLICATION_KEY!,
});

export async function authorizeB2() {
    try {
        await b2.authorize(); // Authorize Backblaze B2
        console.log('B2 authorized');
    } catch (error) {
        console.error('Error authorizing B2:', error);
        throw error;
    }
}

export default b2;