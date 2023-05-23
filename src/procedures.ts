import { middleware, procedure } from "trpc";

export const checkCredential = middleware(async (opts) => {
  console.log("checkCredential");

  return await opts.next({
    ctx: {
      ...opts.ctx,
      uuid: "123",
    },
  });
});

export const checkProjectId = middleware(async (opts) => {
  console.log("checkProjectId");

  return await opts.next({
    ctx: {
      ...opts.ctx,
      projectId: "123",
    },
  });
});

// public
export const publicProcedure = procedure;

// protected
export const protectedProcedure = procedure.use(checkCredential);
