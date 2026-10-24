export class ApiError extends Error {
  constructor(
    message: string,
    public status = 0,
  ) {
    super(message);
  }
}
export function normalizeOrigin(value: string) {
  if (!value.trim() || /[\r\n]/.test(value))
    throw Error("Enter your gym’s full HTTPS API origin.");
  const u = new URL(value.trim());
  if (u.protocol !== "https:" && !(__DEV__ && u.protocol === "http:"))
    throw Error("Use the HTTPS origin of your gym API.");
  if (
    u.username ||
    u.password ||
    u.search ||
    u.hash ||
    !["", "/"].includes(u.pathname)
  )
    throw Error(
      "Use an origin only, without passwords, paths or query strings.",
    );
  return u.origin;
}
export async function send<T>(
  origin: string,
  path: string,
  options: { token?: string; method?: string; body?: object | FormData } = {},
): Promise<T> {
  if (!origin)
    throw new ApiError(
      "Connect your gym server first. You can explore the separate demo without a server.",
    );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const multipart = options.body instanceof FormData;
    const r = await fetch(origin + "/v1/" + path, {
      method: options.method || "GET",
      headers: {
        ...(options.token ? { Authorization: "Bearer " + options.token } : {}),
        ...(!multipart && options.body
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body: options.body
        ? ((multipart
            ? options.body
            : JSON.stringify(options.body)) as BodyInit)
        : undefined,
      signal: controller.signal,
      credentials: "omit",
    });
    let data;
    try {
      data = await r.json();
    } catch {
      throw new ApiError(
        "This server did not return the gym API. Check its address.",
        r.status,
      );
    }
    if (!r.ok)
      throw new ApiError(data.error || "The request failed.", r.status);
    return data as T;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError")
      throw new ApiError(
        "Connection timed out. Check your connection and retry.",
      );
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
