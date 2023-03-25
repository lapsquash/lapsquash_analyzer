import { DefineMethods } from "aspida";
import { mockMethods } from "aspida-mock";
import { z } from "zod";

const validator = {
  post: {
    reqBody: z.object({
      code: z.string().length(785),
    }),
    resBody: z.object({
      credential: z.string(),
    }),
  },
};

type Methods = DefineMethods<{
  post: {
    status: 200;
    reqBody: z.infer<typeof validator["post"]["reqBody"]>;
    resBody: z.infer<typeof validator["post"]["resBody"]>;
  };
}>;

mockMethods<Methods>({});

export { validator };
export type { Methods };
export default { mockMethods };
