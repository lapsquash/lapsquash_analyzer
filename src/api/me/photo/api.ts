import {
  createHono,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
} from "lib/constant";
import { Jwt } from "lib/jwt";
import { fetchRequestFromUuid } from "lib/request";
import { stateManager } from "lib/state";
import { Store } from "lib/store";

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

const photo = createHono().get("/", async (ctx) => {
  console.log("me");

  const uuid = stateManager.get().uuid;
  if (!uuid) {
    return ctx.json({ error: "no uuid" }, 403);
  }

  let photo: ArrayBuffer | undefined;
  try {
    photo = await requestUserPhoto(ctx.env.DB, uuid);
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

  return ctx.body(photo ?? new ArrayBuffer(0));
});

export { photo };
