import { Jwt } from "./jwt";
import { stateManager } from "./state";
import { InvalidJwtError } from "./constant";
import { JwtPayload } from "./types/res_req";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";

async function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  console.log("fetchCreateContext");
  const bearer = req.headers.get("Authorization")?.split(" ")[1];
  if (!bearer) return { uuid: undefined };

  const jwt = new Jwt(stateManager.getEnv());
  let payload: JwtPayload | undefined;
  try {
    payload = await jwt.decode(bearer);
  } catch (err) {
    if (err instanceof InvalidJwtError) {
      console.log("hey");
      return { uuid: undefined };
    }
  }

  const uuid = await jwt.toUuid(bearer);
  stateManager.set({ uuid });

  return { uuid };
}

type Context = inferAsyncReturnType<typeof createContext>;

function createRouter() {
  return;
}

export { createContext, createRouter };
export type { Context };
