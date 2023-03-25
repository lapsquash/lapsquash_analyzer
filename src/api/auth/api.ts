import { zValidator } from "@hono/zod-validator";
import { Bindings } from "hono/dist/types/types";
import { stringify } from "qs";
import { Methods, validator } from ".";
import { createHono } from "../../lib/constant";

type TokenRequest = {
  client_id: string;
  scope: "https://graph.microsoft.com/.default";
  code: string;
  redirect_uri: string;
  grant_type: "authorization_code";
  client_secret: string;
};

type TokenResponse = {
  token_type: "Bearer";
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};

const auth = createHono();

async function requestTokens(env: Bindings, code: string): Promise<Response> {
  const tokenEndpoint = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;

  const body: TokenRequest = {
    client_id: env.CLIENT_ID as string,
    scope: "https://graph.microsoft.com/.default",
    code: code,
    redirect_uri: "http://localhost:8787/callback",
    grant_type: "authorization_code",
    client_secret: env.CLIENT_SECRET as string,
  };

  return await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });
}

auth.post("/", zValidator("json", validator.post.reqBody), async (c) => {
  type ResBody = Methods["post"]["resBody"];

  const response = await requestTokens(c.env, c.req.valid("json").code).catch(
    (e) => {
      console.error(e);
      return new Response(e, { status: 500 });
    },
  );

  const body = await response.json();

  if (!response.ok) {
    return new Response(
      JSON.stringify({
        message: "Token request failed",
        reason: body,
      }),
      { status: 403 },
    );
  }

  return new Response(JSON.stringify(body), {
    status: 200,
  });
});

export { auth };
