import { TRPCError } from "@trpc/server";
import { InvalidJwtError } from "lib/constant";
import { Jwt } from "lib/jwt";
import { middleware, procedure } from "trpc";

export const isAuthorized = middleware(async (opts) => {
  const bearer = opts.ctx.bearer;

  if (bearer == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bearer token not found",
    });
  }

  const jwt = new Jwt(opts.ctx.env);
  try {
    await jwt.decode(bearer);
  } catch (err) {
    if (err instanceof InvalidJwtError) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid bearer token",
      });
    }
  }

  const uuid = await jwt.toUuid(bearer);

  return await opts.next({
    ctx: {
      ...opts.ctx,
      uuid,
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
export const protectedProcedure = procedure.use(isAuthorized);
