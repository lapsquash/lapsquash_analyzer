import { Hono } from "hono";
import { todo } from "./todo/api";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));
app.route("/api/todo", todo);

export default app;
