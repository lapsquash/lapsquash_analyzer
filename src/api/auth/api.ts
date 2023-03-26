import { zValidator } from "@hono/zod-validator";
import { validator } from ".";
import {
  createHono,
  ENV,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
  StoreError,
} from "lib/constant";
import { fetchRequest } from "lib/request";
import {
  TokenRequest,
  TokenResponse,
  UserInfoResponse,
} from "lib/types/res_req";
import { Jwt } from "lib/jwt";
import { DBUsers } from "lib/types/db";
import { customValidator } from "lib/types/validator";
import { Store } from "lib/store";

const auth = createHono();

async function requestTokens(env: ENV, code: string): Promise<TokenResponse> {
  const tokenEndpoint = `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`;

  const body: TokenRequest = {
    client_id: env.CLIENT_ID,
    scope: "offline_access user.read Sites.ReadWrite.All",
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

auth.post("/", zValidator("json", validator.post.reqBody), async (ctx) => {
  let tokenRequest: TokenResponse | undefined;
  let userInfo: UserInfoResponse | undefined;

  try {
    tokenRequest = await requestTokens(ctx.env, ctx.req.valid("json").code);
    console.log({ tokenRequest });
    userInfo = await requestUserInfo(tokenRequest.access_token);
    console.log({ userInfo });
  } catch (err) {
    if (err instanceof ResponseNotOkError) {
      console.error(err);
      return ctx.json(JSON.parse(err.message), 403);
    }
    if (err instanceof NetworkError) {
      console.error(err);
      return ctx.json(JSON.parse(err.message), 500);
    }
    return ctx.json({ message: "Unknown error", reason: String(err) }, 500);
  }

  const credential = await new Jwt(ctx.env).create(userInfo.id);
  validator.post.resBody.parse({ credential });

  const nowUnix = Math.floor(Date.now() / 1000);

  const user: DBUsers = {
    uuid: userInfo.id,
    access_token: tokenRequest.access_token,
    expires_at: nowUnix + tokenRequest.expires_in,
    refresh_token: tokenRequest.refresh_token,
  };

  customValidator.db.users.parse(user);

  try {
    await new Store(ctx.env.DB, userInfo.id).putUser(user);
  } catch (err) {
    if (err instanceof StoreError) {
      return ctx.json(JSON.parse(err.message), {
        status: err.status ?? 500,
      });
    }
    return ctx.json({ message: "Unknown error", reason: String(err) }, 500);
  }

  return ctx.json({ credential }, 200);
});

export { auth };
