import { apiLocation } from "./apiLocation";

export default async function apiFetch(
  urlArg: RequestInfo | URL,
  method: string,
  body: Object = {},
) {
  const reqOption: RequestInit = {
    headers: {
      "Content-type": "application/json",
    },
    method: method,
    credentials: "include",
  };

  const url = apiLocation + urlArg;

  if (method == "POST") reqOption.body = JSON.stringify(body);

  let res = await fetch(url, reqOption);

  if (res.status === 401 && urlArg !== "/refresh") {
    const reqOptionTmp = {
      ...reqOption,
      method: "GET",
    };
    res = await fetch(apiLocation + "/refresh", reqOptionTmp);

    if (res.ok) {
      return await fetch(url, reqOption);
    }

    if (res.status === 401) {
      window.location.href = "/login";
    }
  }

  return res;
}
