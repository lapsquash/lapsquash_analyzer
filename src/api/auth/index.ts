import { DefineMethods } from "aspida";
import { mockMethods } from "aspida-mock";
import { z } from "zod";

const validator = {
  post: {
    reqBody: z.object({
      code: z.string(),
    }),
    resBody: z.object({
      credential: z.string(),
    }),
  },
};

export type Methods = DefineMethods<{
  post: {
    status: 200;
    reqBody: z.infer<typeof validator["post"]["reqBody"]>;
    resBody: z.infer<typeof validator["post"]["resBody"]>;
  };
}>;

export default mockMethods<Methods>({
  post: ({ reqBody }) => {
    return {
      status: 200,
      resBody: {
        credential: reqBody.code,
      },
    };
  },
});

export { validator };
