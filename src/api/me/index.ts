import { getApiEndpoint, NetworkError, ResponseNotOkError } from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { UserInfoResponse } from "lib/types/res_req";
import { stateManager } from "lib/state";
import { protectedProcedure, router } from "trpc";
import { TRPCError } from "@trpc/server";

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

async function requestUserPhoto(
  db: D1Database,
  uuid: string
): Promise<ArrayBuffer> {
  const userInfoEndpoint = getApiEndpoint("/me/photo/$value");

  const response = await fetchRequestFromUuid(
    new Store(db, uuid),
    [userInfoEndpoint],
    "User photo request failed"
  );

  return await response.arrayBuffer();
}

export const me = router({
  info: protectedProcedure.query(async (opts) => {
    let userInfo: UserInfoResponse | undefined;
    try {
      userInfo = await requestUserInfo(opts.ctx.env.DB, opts.ctx.uuid);
      console.log({ userInfo });
    } catch (err) {
      if (err instanceof ResponseNotOkError) {
        console.error(err);
      }
      if (err instanceof NetworkError) {
        console.error(err);
      }
    }

    if (!userInfo) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get user info",
      });
    }

    return { userInfo };
  }),

  photo: protectedProcedure.query(async (opts) => {
    let photo: ArrayBuffer | undefined;
    try {
      photo = await requestUserPhoto(opts.ctx.env.DB, opts.ctx.uuid);
    } catch (err) {
      if (err instanceof ResponseNotOkError) {
        console.error(err);
      }
      if (err instanceof NetworkError) {
        console.error(err);
      }
    }

    return photo ?? new ArrayBuffer(0);
  }),
});
