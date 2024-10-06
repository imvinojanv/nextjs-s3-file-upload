# Next.js Multi Storage Provider File Upload Application

This project demonstrates how to build a file upload application using multiple storage providers such as AWS S3, EdgeStore, Bunny CDN, Cloudflare R2, Firebase Storage, Backblaze B2, Storj with S3, and Local Storage, built with Next.js, TypeScript, TailwindCSS, and Shadcn UI.

## Table of Contents

- [Next.js Multi Storage Provider File Upload Application](#nextjs-multi-storage-provider-file-upload-application)
  - [Table of Contents](#table-of-contents)
  - [Project Setup](#project-setup)
  - [Database Setup (Neon)](#database-setup-neon)
  - [AWS S3 Integration](#aws-s3-integration)
  - [Edgestore Integration](#edgestore-integration)
  - [Edgestore with AWS S3 Integration](#edgestore-with-aws-s3-integration)
  - [Bunny CDN Integration](#bunny-cdn-integration)
  - [Cloudflare R2 Integration (with S3 client)](#cloudflare-r2-integration-with-s3-client)
  - [Firebase Storage Integration](#firebase-storage-integration)
  - [Backblaze B2 Integration](#backblaze-b2-integration)
  - [Next-S3-Upload Integration](#next-s3-upload-integration)
  - [Example `.env` File](#example-env-file)

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
    - `/app/(routes)/s3/page.tsx`

## Edgestore Integration

1. **Install dependencies:**
    ```bash
    npm install @edgestore/server @edgestore/react zod
    ```
2. **Create a new project in Edgestore** and copy the environment variables into `.env`.
   (Go to the [Edgestore](https://dashboard.edgestore.dev/))
    ```bash
    EDGE_STORE_ACCESS_KEY=your_access_key
    EDGE_STORE_SECRET_KEY=your_secret_access_key
    EDGE_STORE_JWT_SECRET=your_jwt_secret
    ```
3. **Follow the official Edgestore documentation** to create the following:
    - `app/api/edgestore/[...edgestore]/route.ts`
    - `utils/edgestore.ts`
4. **Create a layout component wrapped in `EdgeStoreProvider`.**
    - `/app/(routes)/edgestore/layout.tsx`
5. **Create UI components** for Single Image upload
    - `/app/(routes)/edgestore/_components/single-image-uploader.tsx`
    - `/components/edgestore/single-image-dropzone.tsx`
6. **Create UI components** for Multiple Image Upload
    - `/app/(routes)/edgestore/_components/multi-image-uploader.tsx`
    - `/components/edgestore/multi-image-dropzone.tsx`
7. **Create UI components** for Multiple File upload
    - `/app/(routes)/edgestore/_components/multi-file-uploader.tsx`
    - `/components/edgestore/multi-file-dropzone.tsx`

## Edgestore with AWS S3 Integration

1. **Create an API route** with AWS provider:
    - `app/api/edgestore-s3/[...edgestore]/route.ts`
2. **Create utils for Edgestore-S3 integration:**
    - `utils/edgestore-s3.ts`
3. **Create a layout component wrapped in `EdgeStoreProvider`.** (with setting the `basePath`)
4. **Create a page component** for uploading images using Edgestore with AWS S3:
    - `app/(routes)/edgestore-s3/page.tsx`

## Bunny CDN Integration

1. **Create a Bunny CDN account.** ([Bunny.net](https://bunny.net/))
2. **Create a new storage zone.** (Click 'Storage' > Create new storage zone > Will redirect to file manager dashboard)
3. **Get your password** from 'FTP & API Access'
4. **Update the `.env` file** with Bunny CDN variables:
    ```bash
    NEXT_PUBLIC_BUNNY_CDN_ACCESS_KEY=your_password
    NEXT_PUBLIC_BUNNY_STORAGE_ZONE_NAME=your_storage_zone_name
    NEXT_PUBLIC_BUNNY_STORAGE_BASE_URL=https://your_storage_zone_name.b-cdn.net
    ```
5. **Connect pull zone** to activate the public URL.
6. **Create an API route** for Bunny CDN:
    - `app/api/bunny-cdn/route.ts`
7. **Create a page component** for uploading images using Edgestore with Bunny:
    - `app/(routes)/bunny-cdn/page.tsx`

-   [Reference Article 🔗](https://50bytesjournal.hashnode.dev/nextjs-and-bunny-cdn-complete-guide-to-image-uploading-with-server-actions)

## Cloudflare R2 Integration (with S3 client)

1. **Install AWS SDK libraries** (If you don't installed)
    ```bash
     npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
    ```
2. **Create a Cloudflare R2 account.** ([Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/))
3. **Create a new R2 bucket** and configure CORS settings.
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"]
        }
    ]
    ```
4. **Connect the custom domain** activate the public access
    - (If the domain does not exist from Cloudflare DNS, you need to add the domain through the Cloudflare DNS)
    - Then allow the public access of the bucket
5. **Generate API tokens** by clicking the 'Manage R2 API Tokens' in R2 and store them in `.env`:
    ```bash
    NEXT_PUBLIC_CLOUDFLARE_R2_ACCESS_KEY=your_access_key
    NEXT_PUBLIC_CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
    CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
    CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
    CLOUDFLARE_R2_REGION=auto
    CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
    CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
    ```
6. **Create API routes** for Cloudflare R2:
    - `app/api/cloudflare-r2/route.ts`
    - `app/api/cloudflare-r2/presigned/route.ts`
7. **Create a page component** for uploading images using Edgestore with Bunny:
    - `app/(routes)/cloudflare-r2/page.tsx`

## Firebase Storage Integration

1. **Install Firebase SDK:**
    ```bash
    npm install firebase
    ```
2. **Create a new Firebase project.** ([Firebase](https://console.firebase.google.com/))
3. **Register your web app** and configure the `.env` with Firebase credentials.
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_web_app_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    ```
4. **Create utils for Firebase integration:**
    - `utils/firebase.ts`
5. **Create an API route** for Firebase Storage:
    - `app/api/firebase-storage/route.ts`
6. **Create a page component** for uploading images to Firebase storage:
    - `app/(routes)/firebase-storage/page.tsx`
7. **Ensure security rules** in the Firebase Console to control access.
    - Go to Storage > Rules and define appropriate access control rules

## Backblaze B2 Integration

1. **Install Backblaze B2 SDK:**

    ```bash
    npm install backblaze-b2 @types/backblaze-b2
    ```

2. **Create a Backblaze account and bucket**
3. **Generate API keys** and store them in `.env`.
    ```bash
    NEXT_PUBLIC_B2_APPLICATION_KEY_ID=your_app_key_id
    NEXT_PUBLIC_B2_APPLICATION_KEY=your_app_key
    NEXT_PUBLIC_B2_BUCKET_NAME=your_bucket_name
    NEXT_PUBLIC_B2_BUCKET_ID=your_bucket_id
    ```
4. **Create utils for Backblaze integration:**
    - `utils/backblaze.ts`
5. **Create an API route** for Backblaze B2 Storage:
    - `app/api/backblaze-b2/route.ts`
6. **Create a page component** for uploading images to Backblaze B2 storage:
    - `app/(routes)/backblaze-b2/page.tsx`

## Next-S3-Upload Integration

1. **Install Next-S3-Upload package:**
    ```bash
    npm install next-s3-upload
    ```
2. **Create IAM user** with the required policies (refer to the [Next-S3-Upload Documentation](https://next-s3-upload.codingvalue.com/setup)).
3. **Create access keys** and store them in `.env`.
    ```bash
    S3_UPLOAD_KEY=your_s3_key
    S3_UPLOAD_SECRET=your_s3_secret_key
    S3_UPLOAD_REGION=your_s3_region
    S3_UPLOAD_BUCKET=your_bucket_name
    ```
4. **Create API and frontend routes:**
   This library will automatically consider the default API route is: `/api/s3-upload`. - `app/api/s3-upload/route.ts` - `app/api/next-s3-upload/route.ts` (for Custom API routes)
5. **Create file upload components** for :
    - Single file upload
    - Custom file input field
    - Multiple file upload
    - presigned file upload
-   NOTE: Please see the documentation for more information!


🎉 You can now test your application and see that file uploads work seamlessly with multiple storage providers.

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
NEXT_PUBLIC_FIREBASE_API_KEY=
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
