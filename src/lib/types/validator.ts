import { z } from "zod";

const customValidator = {
  jwtPayload: z.object({
    sub: z.string(),
    iat: z.number(),
  }),
};

export { customValidator };
