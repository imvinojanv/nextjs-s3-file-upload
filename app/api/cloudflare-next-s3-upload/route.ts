import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    bucket: "nextjs-file-upload",
    region: "ap-southeast-1",
    endpoint: "https://30055f483357d04a365758d2d60d5f84.r2.cloudflarestorage.com"
});