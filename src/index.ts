import { auth } from "./api/auth/api";
import { createHono, InvalidJwtError } from "./lib/constant";
import { me } from "api/me/api";
import { Jwt } from "lib/jwt";
import { stateManager } from "lib/state";
import { JwtPayload } from "lib/types/res_req";

const app = createHono()
  .get("/", (ctx) => ctx.text("Hello Hono!"))
  .route("/api/auth", auth)
  .use("/api/*", async (ctx, next) => {
    console.log("middleware");

    const bearer = ctx.req.headers.get("Authorization")?.split(" ")[1];
    if (!bearer) {
      return ctx.json(
        { message: "Unauthorized", reason: "Bearer token not found" },
        401
      );
    }

    const jwt = new Jwt(ctx.env);

    let payload: JwtPayload | undefined;
    try {
      payload = await jwt.decode(bearer);
    } catch (err) {
      if (err instanceof InvalidJwtError) {
        return ctx.json(JSON.parse(err.message), 401);
      }
      return ctx.json({ message: "Unknown error", reason: String(err) }, 500);
    }

    const uuid = await jwt.toUuid(bearer);
    stateManager.set({ uuid });

    console.log({ payload });
    await next();
  })
  .route("/api/me", me);

export default app;
export type AppType = typeof app;
