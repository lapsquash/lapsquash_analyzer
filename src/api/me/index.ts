import { getApiEndpoint } from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { resValidator } from "lib/types/res_req";
import { protectedProcedure } from "procedures";
import { router } from "trpc";
import { photo } from "./photo";

export const me = router({
  info: protectedProcedure
    .output(resValidator.userInfoResponse)
    .query(async (opts) => {
      const response = await fetchRequestFromUuid(
        new Store(opts.ctx.env.DB, opts.ctx.uuid),
        [getApiEndpoint("/me")],
        "User info request failed"
      );
      return await response.json();
    }),

  photo,
});
