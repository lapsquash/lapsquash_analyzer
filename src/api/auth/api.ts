import { zValidator } from "@hono/zod-validator";
import { validator } from ".";
import {
  createHono,
  ENV,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
} from "lib/constant";
import { fetchRequest } from "lib/request";
import { UserInfoResponse } from "lib/types/res_req";
import { Jwt } from "lib/jwt";

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

async function requestTokens(env: ENV, code: string): Promise<TokenResponse> {
  const tokenEndpoint = `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`;

  const body: TokenRequest = {
    client_id: env.CLIENT_ID,
    scope: "https://graph.microsoft.com/.default",
    code: code,
    redirect_uri: "http://localhost:8787/callback",
    grant_type: "authorization_code",
    client_secret: env.CLIENT_SECRET,
  };

  return await fetchRequest<TokenResponse>(
    [tokenEndpoint, { method: "POST", body: new URLSearchParams(body) }],
    "Token request failed",
  );
}

async function requestUserInfo(accessToken: string): Promise<UserInfoResponse> {
  const userInfoEndpoint = getApiEndpoint("/me");

  return await fetchRequest(
    [userInfoEndpoint, { headers: { Authorization: `Bearer ${accessToken}` } }],
    "User info request failed",
  );
}

auth.post("/", zValidator("json", validator.post.reqBody), async (c) => {
  let tokenRequest: TokenResponse | undefined;
  let userInfo: UserInfoResponse | undefined;

  try {
    tokenRequest = await requestTokens(c.env, c.req.valid("json").code);
    console.log({ tokenRequest });
    userInfo = await requestUserInfo(tokenRequest.access_token);
    console.log({ userInfo });
  } catch (err) {
    if (err instanceof ResponseNotOkError) {
      console.error(err);
      return c.json(JSON.parse(err.message), 403);
    }
    if (err instanceof NetworkError) {
      console.error(err);
      return c.json(JSON.parse(err.message), 500);
    }
    return c.json({ message: "Unknown error", reason: String(err) }, 500);
  }

  try {
    userInfo = await requestUserInfo(tokenRequest.access_token);
    console.log({ userInfo });
  } catch (err) {
    if (err instanceof ResponseNotOkError) {
      console.error(err);
      return c.json(JSON.parse(err.message), 403);
    }
    if (err instanceof NetworkError) {
      console.error(err);
      return c.json(JSON.parse(err.message), 500);
    }
    return c.json({ message: "Unknown error", reason: String(err) }, 500);
  }

  const credential = await new Jwt(c.env).createJwt(userInfo.id);
  validator.post.resBody.parse({ credential });

  return c.json({ credential }, 200);
});

export { auth };
