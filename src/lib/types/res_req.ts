import { z } from "zod";
import { customValidator } from "./validator";

type TokenRequest = {
  client_id: string;
  scope: "https://graph.microsoft.com/.default";
  code: string;
  redirect_uri: string;
  grant_type: "authorization_code";
  client_secret: string;
};

type TokenResponse = {
  token_type: "Bearer";
  scope: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string;
};

type UserInfoResponse = {
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity";
  businessPhones: number[];
  displayName: string[];
  givenName: string | undefined;
  id: string;
  jobTitle: string | undefined;
  mail: string;
  mobilePhone: string | undefined;
  officeLocation: string | undefined;
  preferredLanguage: string | undefined;
  surname: string | undefined;
  userPrincipalName: string;
};

type JwtPayload = z.infer<typeof customValidator["jwtPayload"]>;

export type { TokenRequest, TokenResponse, UserInfoResponse, JwtPayload };
