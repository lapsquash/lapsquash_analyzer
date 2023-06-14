import { getApiEndpoint } from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { resValidator } from "lib/types/res_req";
import { protectedProcedure } from "procedures";
import { router } from "trpc";
import { z } from "zod";

export const project = router({
  getMeta: protectedProcedure
    .input(
      z.object({
        uuid: z.string().uuid(),
      })
    )
    .output(resValidator.getProjectMeta)
    .query(async (opts) => {
      const url = getApiEndpoint(
        `/drives/${opts.ctx.env.DRIVE_ID}/root:/${opts.ctx.uuid}/${opts.input.uuid}/meta.json:/content`
      );

      const response = await fetchRequestFromUuid(
        new Store(opts.ctx.env.DB, opts.ctx.uuid),
        [url],
        "Project list request failed"
      );
      return response.json();
    }),
});
