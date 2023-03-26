import { auth } from "./api/auth/api";
import { createHono, InvalidJwtError } from "./lib/constant";
import { me } from "api/me/api";
import { Jwt } from "lib/jwt";
import { JwtPayload } from "lib/types/res_req";

const app = createHono();

app.get("/", (ctx) => ctx.text("Hello Hono!"));
app.route("/api/auth", auth);
app.use("/api/*", async (ctx, next) => {
  console.log("middleware");

  const bearer = ctx.req.headers.get("Authorization")?.split(" ")[1];
  if (!bearer) {
    return ctx.json(
      { message: "Unauthorized", reason: "Bearer token not found" },
      401,
    );
  }

  let payload: JwtPayload | undefined;
  try {
    payload = await new Jwt(ctx.env).decodeJwt(bearer);
  } catch (err) {
    if (err instanceof InvalidJwtError) {
      return ctx.json(JSON.parse(err.message), 401);
    }
    return ctx.json({ message: "Unknown error", reason: String(err) }, 500);
  }

  console.log({ payload });
  await next();
});
app.route("/api/me", me);

export default app;
