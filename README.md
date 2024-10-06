# Next.js Multi Storage Provider File Upload Application

This project demonstrates how to build a file upload application using multiple storage providers such as AWS S3, EdgeStore, Bunny CDN, Cloudflare R2, Firebase Storage, Backblaze B2, Storj with S3, and Local Storage, built with Next.js, TypeScript, TailwindCSS, and Shadcn UI.

## Table of Contents

-   [Project Setup](#project-setup)
-   [Database Setup (Neon)](#database-setup-neon)
-   [AWS S3 Integration](#aws-s3-integration)
-   [Edgestore Integration](#edgestore-integration)
-   [Edgestore with AWS S3 Integration](#edgestore-with-aws-s3-integration)
-   [Bunny CDN Integration](#bunny-cdn-integration)
-   [Next-S3-Upload Integration](#next-s3-upload-integration)
-   [Cloudflare R2 Integration](#cloudflare-r2-integration)
-   [Firebase Storage Integration](#firebase-storage-integration)
-   [Backblaze B2 Integration](#backblaze-b2-integration)
-   [Local Storage Setup](#local-storage-setup)

## Project Setup

1. **Create a new Next.js project with TypeScript and Tailwind CSS:**
    ```bash
    npx create-next-app@latest project-name --typescript --tailwind
    ```
2. **Initialize Shadcn UI:**
    ```bash
    npx shadcn@latest init
    ```

## Database Setup (Neon)

1. **Create a new database in Neon.**
2. **Copy the database connection string and paste it into the `.env` file:**
    ```bash
    DATABASE_URL=your_database_url
    ```
3. **Install Neon's serverless package:**
    ```bash
    npm install @neondatabase/serverless
    ```

## AWS S3 Integration

1. **Create a new AWS S3 bucket** (use default settings).
2. **Enable the 'Block public access'** for public access.
3. **Set bucket policies to public.**
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::your_bucket_name/*"
            }
        ]
    }
    ```
4. **Set bucket CORS to allow to share resources.**
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 9000
        }
    ]
    ```
5. **Create an IAM user** with `AmazonS3FullAccess` permissions.
6. **Generate access keys** and store them in your `.env` file:
    ```bash
    NEXT_AWS_S3_REGION=your_region
    NEXT_AWS_S3_ACCESS_KEY_ID=your_access_key_id
    NEXT_AWS_S3_SECRET_ACCESS_KEY=your_secret_access_key
    NEXT_AWS_S3_BUCKET_NAME=your_bucket_name
    ```
7. **Install necessary dependencies:**
    ```bash
    npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
    ```
    UI for Drag and Drop file upload
    ```bash
    npm install react-dropzone
    ```
8. **Create an utils integration for S3 client**
    - `/utils/s3-client.ts`
9. **Create API routes:**
    - `app/api/presigned/route.ts`
    - `app/api/s3/upload/image/route.ts`
10. **Create a file upload UI using `react-dropzone`.**

## Example `.env` File

```bash
# S3 Configuration
NEXT_AWS_S3_REGION=your_region
NEXT_AWS_S3_ACCESS_KEY_ID=your_access_key_id
NEXT_AWS_S3_SECRET_ACCESS_KEY=your_secret_access_key
NEXT_AWS_S3_BUCKET_NAME=your_bucket_name

# Next-S3-Upload Configuration
S3_UPLOAD_KEY=
S3_UPLOAD_SECRET=
S3_UPLOAD_REGION=
S3_UPLOAD_BUCKET=

# Cloudflare Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_REGION=auto
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_ENDPOINT=

# Edgestore Configuration
EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
EDGE_STORE_JWT_SECRET=

# Bunny CDN Configuration
NEXT_PUBLIC_BUNNY_CDN_ACCESS_KEY=your_password
NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=storage_zone_name
NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL=

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Backblaze B2 Configuration
NEXT_PUBLIC_B2_APPLICATION_KEY_ID=
NEXT_PUBLIC_B2_APPLICATION_KEY=
NEXT_PUBLIC_B2_BUCKET_NAME=
NEXT_PUBLIC_B2_BUCKET_ID=
# NEXT_PUBLIC_B2_ENDPOINT=

# Storj S3 Configuration
NEXT_PUBLIC_STORJ_S3_ACCESS_KEY=
NEXT_PUBLIC_STORJ_S3_SECRET_KEY=
NEXT_PUBLIC_STORJ_S3_REGION=
NEXT_PUBLIC_STORJ_S3_BUCKET_NAME=
NEXT_PUBLIC_STORJ_S3_ENDPOINT=https://gateway.storjshare.io

# Database Configuration
DATABASE_URL=
```
