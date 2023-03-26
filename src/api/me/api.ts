import {
  createHono,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
} from "lib/constant";
import { Jwt } from "lib/jwt";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { UserInfoResponse } from "lib/types/res_req";
import { photo } from "./photo/api";

const me = createHono();

async function requestUserInfo(
  db: D1Database,
  uuid: string,
): Promise<UserInfoResponse> {
  const userInfoEndpoint = getApiEndpoint("/me");

  const response = await fetchRequestFromUuid(
    new Store(db, uuid),
    [userInfoEndpoint],
    "User info request failed",
  );

  return await response.json();
}

me.get("/", async (ctx) => {
  console.log("me");

  const bearer = ctx.req.headers.get("Authorization")?.split(" ")[1];
  const uuid = await new Jwt(ctx.env).toUuid(bearer ?? "");

  let userInfo: UserInfoResponse | undefined;
  try {
    userInfo = await requestUserInfo(ctx.env.DB, uuid);
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
  }

  return ctx.json(userInfo);
});

me.route("/photo", photo);

export { me };
