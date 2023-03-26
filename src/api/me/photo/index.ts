import { DefineMethods } from "aspida";
import { mockMethods } from "aspida-mock";

export type Methods = DefineMethods<{
  get: {
    status: 200;
    resHeaders: {
      "Content-Type": "image/png";
    };
    resBody: ArrayBuffer;
  };
}>;

export default mockMethods<Methods>({
  get: () => {
    return {
      status: 200,
      resHeaders: {
        "Content-Type": "image/png",
      },
      resBody: new ArrayBuffer(0),
    };
  },
});
