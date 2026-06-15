import { apiLocation } from "./apiLocation";

export default async function apiFetch(
  urlArg: RequestInfo | URL,
  method: string,
  body?: Object | FormData,
) {
  const reqOption: RequestInit = {
    headers: {},
    method: method,
    credentials: "include",
  };

  const url = apiLocation + urlArg;

  if (body instanceof FormData) {
    reqOption.body = body;
  } else if (body) {
    reqOption.headers = {
      ...reqOption.headers,
      "Content-type": "application/json",
    };
    reqOption.body = JSON.stringify(body);
  }

  let res = await fetch(url, reqOption);

  if (res.status === 401 && urlArg !== "/refresh") {
    const reqOptionTmp = {
      ...reqOption,
      body: null,
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
