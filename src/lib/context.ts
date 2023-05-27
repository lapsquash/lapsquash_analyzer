import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { type ENV } from "./constant";
import { stateManager } from "./state";

export type Context = {
  env: ENV;
  bearer?: string;
};

export function createContext({ req }: FetchCreateContextFnOptions): Context {
  const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
  const env = stateManager.getEnv();
  return { env, bearer };
}
