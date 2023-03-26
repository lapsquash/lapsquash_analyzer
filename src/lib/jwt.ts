import jwt from "@tsndr/cloudflare-worker-jwt";
import { SignOptions } from "jsonwebtoken";
import { ENV, InvalidJwtError } from "./constant";
import { JwtPayload } from "./types/res_req";
import { customValidator } from "./types/validator";

export class Jwt {
  constructor(private env: ENV) {}

  async createJwt(uuid: string): Promise<string> {
    const nowUnix = Math.floor(Date.now() / 1000);

    const payload: JwtPayload = {
      sub: uuid,
      iat: nowUnix,
    };

    const option: SignOptions = {
      issuer: this.env.HOST_URL,
      subject: uuid,
      expiresIn: nowUnix + 60 * 60,
    };

    return await jwt.sign(payload, this.env.CLIENT_SECRET, option);
  }

  private async verifyJwt(bearer: string): Promise<unknown> {
    const isValid = await jwt.verify(bearer, this.env.CLIENT_SECRET);
    if (!isValid) throw new InvalidJwtError();

    const { payload } = jwt.decode(bearer);

    return payload;
  }

  async decodeJwt(bearer: string): Promise<JwtPayload> {
    const payload = await this.verifyJwt(bearer);

    if (payload === undefined) {
      throw new InvalidJwtError();
    }

    console.log({ payload });

    return customValidator.jwtPayload.parse(payload);
  }
}
