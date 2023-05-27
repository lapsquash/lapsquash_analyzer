import { z } from "zod";

export const reqValidator = {
  tokenRequest: z.object({
    client_id: z.string(),
    scope: z.literal("offline_access user.read Sites.ReadWrite.All"),
    code: z.string(),
    redirect_uri: z.string(),
    grant_type: z.literal("authorization_code"),
    client_secret: z.string(),
  }),
};

export const resValidator = {
  tokenResponse: z.object({
    token_type: z.literal("Bearer"),
    scope: z.string(),
    expires_in: z.number(),
    ext_expires_in: z.number(),
    access_token: z.string(),
    refresh_token: z.string(),
  }),
  userInfoResponse: z.object({
    businessPhones: z.array(z.number()),
    displayName: z.array(z.string()),
    givenName: z.string().optional(),
    id: z.string(),
    jobTitle: z.string().optional(),
    mail: z.string(),
    mobilePhone: z.string().optional(),
    officeLocation: z.string().optional(),
    preferredLanguage: z.string().optional(),
    surname: z.string().optional(),
    userPrincipalName: z.string(),
  }),
  photoMetaResponse: z.object({
    "@odata.mediaContentType": z.enum(["image/jpeg", "image/png"]),
    id: z.literal("default"),
    height: z.number(),
    width: z.number(),
  }),
};
