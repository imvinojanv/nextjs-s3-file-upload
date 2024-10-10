/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
            `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },
        ],
    },
};

export default nextConfig;
