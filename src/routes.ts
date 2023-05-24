import { auth } from "api/auth";
import { me } from "api/me";
import { router } from "./trpc";

export const appRouter = router({
  me,
  auth,
});

export type AppRouter = typeof appRouter;
