import { DefineMethods } from "aspida";
import { mockMethods } from "aspida-mock";
import { z } from "zod";

const validator = {
  get: {
    resBody: z.object({
      id: z.string(),
      displayName: z.string(),
      mail: z.string(),
    }),
  },
};

export type Methods = DefineMethods<{
  get: {
    status: 200;
    resBody: z.infer<typeof validator["get"]["resBody"]>;
  };
}>;

export default mockMethods<Methods>({
  get: () => {
    return {
      status: 200,
      resBody: {
        id: "XXXXXXXX-XXXX-4XXX-xXXX-XXXXXXXXXXXX",
        displayName: "hyodoshun",
        mail: "hyodoshun@example.com",
      },
    };
  },
});

export { validator };
