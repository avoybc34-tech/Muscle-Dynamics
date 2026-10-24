import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { send, ApiError, normalizeOrigin } from "./services/client";
import { createDemo, demoConfig } from "./demo";
import type { Session, User, Dashboard, Config } from "./types";
const KEY = "md_session_v2",
  ORIGIN = "md_origin_v2",
  DEVICE = "md_push_token_v2";
function useModel() {
  const [origin, setOrigin] = useState(""),
    [user, setUser] = useState<User | null>(null),
    [data, setData] = useState<Dashboard | null>(null),
    [config, setConfig] = useState<Config | null>(null),
    [booting, setBooting] = useState(true),
    [bootError, setBootError] = useState(""),
    [demo, setDemo] = useState(false),
    [dataError, setDataError] = useState("");
  const auth = useRef<Session | null>(null),
    demoStore = useRef<ReturnType<typeof createDemo> | null>(null),
    refreshLock = useRef<Promise<Session> | null>(null),
    originRef = useRef("");
  async function store(s: Session) {
    await SecureStore.setItemAsync(
      KEY,
      JSON.stringify({ refreshToken: s.refreshToken }),
      { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY },
    );
    auth.current = s;
    setUser(s.user);
  }
  async function clear() {
    auth.current = null;
    if (Platform.OS !== "web") await SecureStore.deleteItemAsync(KEY);
    setUser(null);
    setData(null);
    setDemo(false);
    demoStore.current = null;
  }
  async function refreshSession() {
    if (refreshLock.current) return refreshLock.current;
    const pending = (async () => {
      const saved = await SecureStore.getItemAsync(KEY);
      if (!saved) throw new ApiError("Please log in again.", 401);
      const raw = JSON.parse(saved);
      const s = await send<Session>(originRef.current, "auth/refresh", {
        method: "POST",
        body: { refreshToken: raw.refreshToken },
      });
      await store(s);
      return s;
    })();
    refreshLock.current = pending;
    try {
      return await pending;
    } finally {
      refreshLock.current = null;
    }
  }
  const api = useCallback(async function api<T>(
    path: string,
    method = "GET",
    body?: object | FormData,
  ): Promise<T> {
    if (demoStore.current)
      return demoStore.current.request<T>(path, method, body);
    let s = auth.current;
    if (s && new Date(s.expiresAt).getTime() <= Date.now() + 15000) {
      try {
        s = await refreshSession();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) await clear();
        throw e;
      }
    }
    try {
      return await send<T>(originRef.current, path, {
        token: s?.accessToken,
        method,
        body,
      });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401 && s) {
        try {
          const fresh = await refreshSession();
          return await send<T>(originRef.current, path, {
            token: fresh.accessToken,
            method,
            body,
          });
        } catch (next) {
          if (next instanceof ApiError && next.status === 401) await clear();
          throw next;
        }
      }
      throw e;
    }
  }, []);
  async function load() {
    try {
      const d = await api<Dashboard>("dashboard");
      setData(d);
      setUser(d.user);
      setDataError("");
      return d;
    } catch (e) {
      setDataError((e as Error).message);
      throw e;
    }
  }
  async function bootstrap() {
    setBooting(true);
    setBootError("");
    if (Platform.OS === "web" && process.env.EXPO_PUBLIC_WEB_DEMO === "true") {
      await enterDemo();
      setBooting(false);
      return;
    }
    try {
      const server =
        (await SecureStore.getItemAsync(ORIGIN)) ||
        process.env.EXPO_PUBLIC_API_URL ||
        "";
      originRef.current = server;
      setOrigin(server);
      const saved = await SecureStore.getItemAsync(KEY);
      if (saved && server) {
        try {
          await refreshSession();
          await load();
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) await clear();
          else throw e;
        }
      }
    } catch (e) {
      setBootError((e as Error).message);
    } finally {
      setBooting(false);
    }
  }
  useEffect(() => {
    bootstrap();
  }, []);
  async function connect(value: string) {
    const base = normalizeOrigin(value);
    const c = await send<Config>(base, "config");
    await clear();
    await SecureStore.setItemAsync(ORIGIN, base);
    originRef.current = base;
    setOrigin(base);
    setConfig(c);
    return c;
  }
  async function fetchConfig() {
    if (demoStore.current) {
      const c = await demoStore.current.request<Config>("config");
      setConfig(c);
      return c;
    }
    const c = await send<Config>(originRef.current, "config");
    setConfig(c);
    return c;
  }
  async function login(path: "login" | "register" | "setup", body: object) {
    const s = await send<Session>(
      originRef.current,
      path === "setup" ? "setup" : "auth/" + path,
      {
        method: "POST",
        body,
      },
    );
    setDemo(false);
    demoStore.current = null;
    await store(s);
    await load();
  }
  async function enterDemo(role: "MEMBER" | "OWNER" | "STAFF" = "MEMBER") {
    demoStore.current = createDemo(role);
    setDemo(true);
    setConfig(demoConfig);
    const d = await demoStore.current.request<Dashboard>("dashboard");
    setUser(d.user);
    setData(d);
    setDataError("");
    setBootError("");
  }
  async function logout() {
    let warning = "";
    if (!demoStore.current && auth.current) {
      try {
        const device = await SecureStore.getItemAsync(DEVICE);
        if (device) await api("devices", "DELETE", { token: device });
        await api("auth/logout", "POST", {});
      } catch {
        warning =
          "Signed out locally. The server could not confirm session revocation.";
      }
    }
    await clear();
    await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    return warning;
  }
  return {
    origin,
    user,
    data,
    config,
    booting,
    bootError,
    dataError,
    demo,
    api,
    load,
    connect,
    login,
    enterDemo,
    logout,
    bootstrap,
    fetchConfig,
    setUser,
    setData,
    token: () => auth.current?.accessToken || "",
  };
}
const Context = createContext<ReturnType<typeof useModel> | null>(null);
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <Context.Provider value={useModel()}>{children}</Context.Provider>;
}
export function useSession() {
  const s = useContext(Context);
  if (!s) throw Error("Session provider missing");
  return s;
}
