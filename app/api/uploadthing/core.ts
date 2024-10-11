import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeUserId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    imageUpload: f({ image: { maxFileSize: "8MB" } })
        .middleware(async ({ req }) => {
            const user = await auth(req);
            if (!user) throw new UploadThingError("Unauthorized");
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File uploaded to:", file.url);
            
            return { uploadedBy: metadata.userId };     // Whatever is returned to `onClientUploadComplete` callback
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
