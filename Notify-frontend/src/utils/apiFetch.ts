import { apiLocation } from "./apiLocation";

export default async function apiFetch(
  urlArg: RequestInfo | URL,
  method: string,
  body: Object = {},
) {
  const reqOption: RequestInit = {
    headers: {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "127.0.0.1",
    },
    method: method,
    credentials: "include",
  };

  const url = apiLocation + urlArg;

  if (method == "POST") reqOption.body = JSON.stringify(body);

  const res = await fetch(url, reqOption);

  return res;
}
