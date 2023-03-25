import { Hono } from "hono";

type Bindings = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  TENANT_ID: string;
};

const createHono = () => new Hono<{ Bindings: Bindings }>();

export { createHono };
