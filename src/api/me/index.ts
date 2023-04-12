import {
  createHono,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
} from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { UserInfoResponse } from "lib/types/res_req";
import { photo } from "./photo";
import { stateManager } from "lib/state";

async function requestUserInfo(
  db: D1Database,
  uuid: string
): Promise<UserInfoResponse> {
  const userInfoEndpoint = getApiEndpoint("/me");

  const response = await fetchRequestFromUuid(
    new Store(db, uuid),
    [userInfoEndpoint],
    "User info request failed"
  );

  return await response.json();
}

const me = createHono().get("/", async (ctx) => {
  console.log("me");

  const uuid = stateManager.get().uuid;
  if (!uuid) {
    return ctx.json({ error: "no uuid" }, 403);
  }

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

  if (!userInfo) {
    return ctx.json({ error: "no user info" }, 403);
  }

  return ctx.jsonT(userInfo);
});

me.route("/photo", photo);

export { me };
