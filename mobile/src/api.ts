export class ApiError extends Error {
  constructor(
    message: string,
    public status = 0,
  ) {
    super(message);
  }
}
export async function request<T>(
  base: string,
  token: string | null,
  path: string,
  method = "GET",
  body?: object | FormData,
): Promise<T> {
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 20000);
  try {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = "Bearer " + token;
    let payload: BodyInit | undefined;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    const r = await fetch(base + "/api/" + path, {
      method,
      headers,
      body: payload,
      signal: controller.signal,
      credentials: "omit",
    });
    const text = await r.text();
    let d;
    try {
      d = JSON.parse(text);
    } catch {
      throw new ApiError(
        "This address did not return the gym API. Check the server URL.",
        r.status,
      );
    }
    if (!r.ok)
      throw new ApiError(
        d.error || "The request could not be completed.",
        r.status,
      );
    return d as T;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError")
      throw new ApiError("Connection timed out. Please try again.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
export function cleanServer(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw Error("Enter your gym’s full server URL.");
  }
  if (url.protocol !== "https:" && !(__DEV__ && url.protocol === "http:"))
    throw Error("Use your gym’s HTTPS server URL.");
  if (url.username || url.password)
    throw Error("Do not put passwords in the URL.");
  return url.origin;
}
export const money = (n: number) =>
  "PKR " +
  (n / 100).toLocaleString("en-PK", { maximumFractionDigits: n % 100 ? 2 : 0 });
export const date = (s?: string | null) =>
  s
    ? new Date(s).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
      })
    : "—";
export const time = (s: string) =>
  new Date(s).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  });
