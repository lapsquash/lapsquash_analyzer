import {
  createHono,
  getApiEndpoint,
  NetworkError,
  ResponseNotOkError,
} from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { UserInfoResponse } from "lib/types/res_req";

const me = createHono();

async function requestUserInfo(uuid: string) {
  const userInfoEndpoint = getApiEndpoint("/me");

  return await fetchRequestFromUuid<UserInfoResponse>(
    uuid,
    [userInfoEndpoint],
    "User info request failed",
  );
}

me.get("/", async (c) => {
  console.log("me");

  try {
    const userInfo = await requestUserInfo("123");
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
  }

  return c.text("end");
});

export { me };
