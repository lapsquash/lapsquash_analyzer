import { protectedProcedure, publicProcedure } from "procedures";
import { z } from "zod";
import { middleware, router } from "./trpc";

const temp = middleware(async (opts) => {
  const projectId = opts.input as string;
  return await opts.next({
    ...opts,
    ctx: {
      projectId,
    },
  });
});

export const appRouter = router({
  hello: publicProcedure.query(({ ctx }) => {
    return ctx.env.CLIENT_ID;
  }),
  hello2: protectedProcedure.query(({ ctx }) => {
    return ctx.uuid;
  }),
  hello3: protectedProcedure
    .input(z.string())
    .output(z.string())
    .use(temp)
    .query(({ input, ctx }) => {
      return input;
    }),
});

export type AppRouter = typeof appRouter;
