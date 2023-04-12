import { NetworkError, ResponseNotOkError } from "./constant";
import { Store } from "./store";

type FetchArgs = Parameters<typeof fetch>;

async function fetchRequest<T>(
  fetchArg: FetchArgs,
  errMessage: string
): Promise<T> | never {
  const res = await fetch(...fetchArg).catch((err) => {
    throw new NetworkError(err);
  });

  if (!res.ok) {
    console.error(res);
    throw new ResponseNotOkError(errMessage, await res.json());
  }

  return (await res.json()) as T;
}

async function fetchRequestFromUuid(
  store: Store,
  fetchArg: FetchArgs,
  errMessage: string
): Promise<Response> | never {
  const accessToken = (await store.getUserData()).access_token;

  if (fetchArg[1] === undefined) {
    fetchArg[1] = {};
  }

  fetchArg[1].headers = {
    ...fetchArg[1].headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await fetch(...fetchArg).catch((err) => {
    throw new NetworkError(err);
  });

  if (!res.ok) {
    console.error(res);
    throw new ResponseNotOkError(errMessage, await res.json());
  }

  return res;
}

export { fetchRequest, fetchRequestFromUuid };
