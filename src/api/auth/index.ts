import { getApiEndpoint, type ENV } from "lib/constant";
import { Jwt } from "lib/jwt";
import { fetchRequest } from "lib/request";
import { Store } from "lib/store";
import { type DBUsers } from "lib/types/db";
import { type reqValidator, type resValidator } from "lib/types/res_req";
import { customValidator } from "lib/types/validator";
import { publicProcedure } from "procedures";
import { router } from "trpc";
import { z } from "zod";

async function requestTokens(
  env: ENV,
  redirectUri: string,
  code: string
): Promise<z.infer<(typeof resValidator)["token"]>> {
  const tokenEndpoint = `https://login.microsoftonline.com/${String(
    env.TENANT_ID
  )}/oauth2/v2.0/token`;

  const body: z.infer<(typeof reqValidator)["token"]> = {
    client_id: env.CLIENT_ID,
    scope: "offline_access user.read Sites.ReadWrite.All",
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  return fetchRequest(
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

async function requestUserInfo(
  accessToken: string
): Promise<z.infer<(typeof resValidator)["userInfo"]>> {
  const userInfoEndpoint = getApiEndpoint("/me");

  return fetchRequest(
    [userInfoEndpoint, { headers: { Authorization: `Bearer ${accessToken}` } }],
    "User info request failed"
  );
}

export const auth = router({
  getCredential: publicProcedure
    .input(z.object({ code: z.string(), redirectUri: z.string() }))
    .output(z.string())
    .query(async (opts) => {
      const { env } = opts.ctx;

      const tokenRequest = await requestTokens(
        env,
        opts.input.redirectUri,
        opts.input.code
      );
      const userInfo = await requestUserInfo(tokenRequest.access_token);

      const credential = await new Jwt(env).create(userInfo.id);
      const nowUnix = Math.floor(Date.now() / 1000);

      const user: DBUsers = {
        uuid: userInfo.id,
        access_token: tokenRequest.access_token,
        expires_at: nowUnix + Number(tokenRequest.expires_in),
        refresh_token: tokenRequest.refresh_token,
      };

      customValidator.db.user_credential.parse(user);
      await new Store(env.DB, userInfo.id).putUser(user);

      return credential;
    }),
});
