import { Hono } from "hono";
import { auth } from "./api/auth/api";
import { todo } from "./api/todo/api";
import { createHono } from "./lib/constant";

const app = createHono();

app.get("/", (c) => c.text("Hello Hono!"));
app.route("/api/auth", auth);

export default app;
