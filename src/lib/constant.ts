import { Hono } from "hono";

type ENV = {
  HOST_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  TENANT_ID: string;
};

const createHono = () => new Hono<{ Bindings: ENV }>();

const getApiEndpoint = (path: string) =>
  "https://graph.microsoft.com/v1.0" + path;

class NetworkError extends Error {
  constructor(reason: string) {
    super(JSON.stringify({ message: "Network Error", reason: reason }));
  }
}

class ResponseNotOkError extends Error {
  constructor(message: string, reason: string) {
    super(JSON.stringify({ message, reason }));
  }
}

class InvalidJwtError extends Error {
  constructor() {
    super(
      JSON.stringify({
        message: "Invalid JWT",
        reason: "Decoding JWT token was failed",
      }),
    );
  }
}

export {
  createHono,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
  InvalidJwtError,
};
export type { ENV };
