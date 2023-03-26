import { NetworkError, ResponseNotOkError } from "./constant";

type FetchArgs = Parameters<typeof fetch>;

async function fetchRequest<T>(
  fetchArg: FetchArgs,
  errMessage: string,
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

function uuid2credential(bearer: string): string {
  const credential = bearer.split(" ")[1];
  if (credential === undefined) {
    throw new Error("Credential is undefined");
  }
  return "123";
}

async function fetchRequestFromUuid<T>(
  uuid: string,
  fetchArg: FetchArgs,
  errMessage: string,
): Promise<T> | never {
  const accessToken = uuid2credential(uuid);

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

  return (await res.text()) as T;
}

export { fetchRequest, fetchRequestFromUuid };
