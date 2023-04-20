import { TRPCError, initTRPC } from "@trpc/server";
import { JwtPayload } from "@tsndr/cloudflare-worker-jwt";
import { InvalidJwtError } from "lib/constant";
import { Jwt } from "lib/jwt";
import { stateManager } from "lib/state";
const t = initTRPC.create();

export const middleware = t.middleware;
export const router = t.router;
export const mergeRouter = t.mergeRouters;
export const publicProcedure = t.procedure;
const isAuth = middleware(async ({ ctx, next }) => {
  console.log("fetchCreateContext");
  const bearer = stateManager.get().bearer;
  if (!bearer) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Bearer token not found",
    });
  }

  const jwt = new Jwt(stateManager.getEnv());
  let payload: JwtPayload | undefined;
  try {
    payload = await jwt.decode(bearer);
  } catch (err) {
    if (err instanceof InvalidJwtError) {
      console.log("hey");
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid bearer token",
      });
    }
  }

  const uuid = await jwt.toUuid(bearer);
  const env = stateManager.getEnv();
  return next({
    ctx: { uuid, env },
  });
});

export const protectedProcedure = t.procedure.use(isAuth);
