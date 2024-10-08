import { initEdgeStore } from '@edgestore/server';
import {
    CreateContextOptions,
    createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
    userId: string;
    userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
    // get the session from your auth provider
    // const session = getSession(req);
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
            // accept: ['image/jpeg', 'image/png']
        })
        .input(
            z.object({
                type: z.enum(["post", "profile"]),
            })
        )
        // e.g. /post/my-file.jpg
        .path(({ input }) => [{ type: input.type }]),

    myProtectedFiles: es
        .fileBucket()
        // e.g. /123/my-file.pdf
        .path(({ ctx }) => [{ owner: ctx.userId }])
        .accessControl({
            OR: [
                {
                    userId: { path: "owner" },
                },
                {
                    userRole: { eq: "admin" },
                },
            ],
        }),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    createContext,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;