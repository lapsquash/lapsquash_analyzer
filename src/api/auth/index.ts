import { ENV, getApiEndpoint } from "lib/constant";
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
import { z } from "zod";
import { stateManager } from "lib/state";
import { publicProcedure, router } from "trpc";

async function requestTokens(env: ENV, code: string): Promise<TokenResponse> {
  const tokenEndpoint = `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`;

  const body: TokenRequest = {
    client_id: env.CLIENT_ID,
    scope: "offline_access user.read Sites.ReadWrite.All",
    code,
    redirect_uri: "http://localhost:8787/callback",
    grant_type: "authorization_code",
    client_secret: env.CLIENT_SECRET,
  };

  return await fetchRequest<TokenResponse>(
    [
      tokenEndpoint,
      {
        method: "POST",
        body: new URLSearchParams(body),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    ],
    "Token request failed"
  );
}

async function requestUserInfo(accessToken: string): Promise<UserInfoResponse> {
  const userInfoEndpoint = getApiEndpoint("/me");

  return await fetchRequest(
    [userInfoEndpoint, { headers: { Authorization: `Bearer ${accessToken}` } }],
    "User info request failed"
  );
}

export const authRouter = router({
  credential: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input: { code } }) => {
      const env = stateManager.getEnv();

      let tokenRequest: TokenResponse | undefined;
      let userInfo: UserInfoResponse | undefined;

      tokenRequest = await requestTokens(env, code);
      userInfo = await requestUserInfo(tokenRequest.access_token);

      const credential = await new Jwt(env).create(userInfo.id);
      const nowUnix = Math.floor(Date.now() / 1000);

      const user: DBUsers = {
        uuid: userInfo.id,
        access_token: tokenRequest.access_token,
        expires_at: nowUnix + tokenRequest.expires_in,
        refresh_token: tokenRequest.refresh_token,
      };

      customValidator.db.user_credential.parse(user);
      await new Store(env.DB, userInfo.id).putUser(user);

      return credential;
    }),
});
