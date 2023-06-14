import { auth } from "api/auth";
import { lapsq } from "api/lapsq";
import { me } from "api/me";
import { router } from "./trpc";

export const appRouter = router({
  me,
  auth,
  lapsq,
});

export type AppRouter = typeof appRouter;
