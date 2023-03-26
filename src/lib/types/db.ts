import { z } from "zod";
import { customValidator } from "./validator";

type DBUsers = z.infer<typeof customValidator["db"]["users"]>;

export type { DBUsers };
