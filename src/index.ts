import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { createHono } from "lib/constant";
import { createContext } from "lib/context";
import { stateManager } from "lib/state";
import { appRouter } from "routes";

const app = createHono();

app.use(async (ctx, next) => {
  stateManager.set({ ...stateManager.get(), env: ctx.env });
  await next();
});

app.use("/*", cors());

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export default app;
