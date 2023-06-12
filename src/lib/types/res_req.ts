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
    "@odata.context": z.string(),
    businessPhones: z.array(z.string()),
    displayName: z.string(),
    givenName: z.string().nullable(),
    jobTitle: z.string().nullable(),
    mail: z.string().email(),
    mobilePhone: z.string().nullable(),
    officeLocation: z.string().nullable(),
    preferredLanguage: z.string().nullable(),
    surname: z.string().nullable(),
    userPrincipalName: z.string().email(),
    id: z.string().uuid(),
  }),
  photoMetaResponse: z.object({
    "@odata.mediaContentType": z.enum(["image/jpeg", "image/png"]),
    id: z.literal("default"),
    height: z.number(),
    width: z.number(),
  }),
};
