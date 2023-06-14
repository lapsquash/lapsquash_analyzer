import { getApiEndpoint } from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { resValidator } from "lib/types/res_req";
import { protectedProcedure } from "procedures";
import { router } from "trpc";

export const photo = router({
  meta: protectedProcedure
    .output(resValidator.photoMeta)
    .query(async (opts) => {
      const response = await fetchRequestFromUuid(
        new Store(opts.ctx.env.DB, opts.ctx.uuid),
        [getApiEndpoint("/me/photo")],
        "User photo request failed"
      );

      return response.json();
    }),

  content: protectedProcedure.query<ArrayBuffer>(async (opts) => {
    const response = await fetchRequestFromUuid(
      new Store(opts.ctx.env.DB, opts.ctx.uuid),
      [getApiEndpoint("/me/photo/$value")],
      "User photo request failed"
    );

    return response.arrayBuffer();
  }),
});
