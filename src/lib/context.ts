import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { InvalidJwtError } from "./constant";
import { Jwt } from "./jwt";
import { stateManager } from "./state";

async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions): Promise<{ uuid: string | undefined }> {
  console.log("fetchCreateContext");
  const bearer = req.headers.get("Authorization")?.split(" ")[1];
  if (bearer == null) return { uuid: undefined };

  const jwt = new Jwt(stateManager.getEnv());
  try {
    await jwt.decode(bearer);
  } catch (err) {
    if (err instanceof InvalidJwtError) {
      console.log("hey");
      return { uuid: undefined };
    }
  }

  const uuid = await jwt.toUuid(bearer);
  return { uuid };
}

type Context = inferAsyncReturnType<typeof createContext>;

export { createContext };
export type { Context };
