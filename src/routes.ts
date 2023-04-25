import { me } from "api/me";
import { router } from "./trpc";
import { auth } from "api/auth";

export const appRouter = router({ auth, me });

export type AppRouter = typeof appRouter;
