import { getApiEndpoint } from "lib/constant";
import { fetchRequestFromUuid } from "lib/request";
import { Store } from "lib/store";
import { resValidator } from "lib/types/res_req";
import { protectedProcedure } from "procedures";
import { router } from "trpc";
import { project } from "./project/meta";

export const lapsq = router({
  getProjectList: protectedProcedure
    .output(resValidator.getProjectList)
    .query(async (opts) => {
      const url = getApiEndpoint(
        `/drives/${opts.ctx.env.DRIVE_ID}/root:/${opts.ctx.uuid}:/children`
      );

      const response = await fetchRequestFromUuid(
        new Store(opts.ctx.env.DB, opts.ctx.uuid),
        [url],
        "Project list request failed"
      );

      return response.json();
    }),

  project,
});
