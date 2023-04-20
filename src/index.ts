import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "routes";
import { createHono } from "lib/constant";
import { createContext } from "lib/context";
import { stateManager } from "lib/state";

const app = createHono();

app.use(async (ctx, next) => {
  stateManager.set({ ...stateManager.get(), env: ctx.env });
  await next();
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

export default app;
