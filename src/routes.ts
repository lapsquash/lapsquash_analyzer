import { me } from "api/me";
import { mergeRouter, router } from "./trpc";
import { auth } from "api/auth";

export const appRouter = mergeRouter(auth, me);

export type AppRouter = typeof appRouter;
