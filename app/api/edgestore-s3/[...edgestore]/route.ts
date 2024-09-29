import { initEdgeStore } from '@edgestore/server';
import {
    type CreateContextOptions,
    createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { AWSProvider } from '@edgestore/server/providers/aws';
import { z } from "zod";

type Context = {
    userId: string;
    userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
    console.log(req);
    
    return {
        userId: "1234",
        userRole: "admin",
    };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket(),

    myPublicImages: es
        .imageBucket({
            maxSize: 1024 * 1024 * 10, // 10MB
        })
        .input(
            z.object({
                type: z.enum(["post", "profile"]),
            })
        )
        // e.g. /post/my-file.jpg
        .path(({ input }) => [{ type: input.type }]),
});

const handler = createEdgeStoreNextHandler({
    provider: AWSProvider({
        accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
        region: process.env.NEXT_AWS_S3_REGION,
        bucketName: process.env.NEXT_AWS_S3_BUCKET_NAME,
        baseUrl: `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com`,
        jwtSecret: process.env.EDGE_STORE_JWT_SECRET,
    }),
    router: edgeStoreRouter,
    createContext,
});

export { handler as GET, handler as POST, handler as PUT };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;