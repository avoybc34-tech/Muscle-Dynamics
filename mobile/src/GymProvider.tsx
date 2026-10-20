import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ApiError, cleanServer, request } from "./api";
import type { User, Snapshot, Config, Screen, Plan, Payment } from "./types";
function useGymModel() {
  const [server, setServer] = useState(""),
    [token, setToken] = useState<string | null>(null),
    [user, setUser] = useState<User | null>(null),
    [data, setData] = useState<Snapshot | null>(null),
    [config, setConfig] = useState<Config | null>(null),
    [screen, setScreen] = useState<Screen>("connect"),
    [loading, setLoading] = useState(true),
    [selectedPlan, setSelectedPlan] = useState<Plan | null>(null),
    [payment, setPayment] = useState<Payment | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync("md_server"),
          env = process.env.EXPO_PUBLIC_API_URL;
        const base = stored || (env && !env.includes("YOUR-") ? env : "");
        if (!base) {
          setScreen("connect");
          return;
        }
        const clean = cleanServer(base);
        setServer(clean);
        const c = await request<Config>(clean, null, "config");
        if (!active) return;
        setConfig(c);
        const t = await SecureStore.getItemAsync("md_token");
        if (t) {
          try {
            const d = await request<Snapshot>(clean, t, "dashboard");
            if (!active) return;
            setToken(t);
            setUser(d.user);
            setData(d);
            setScreen("home");
          } catch (e) {
            if (e instanceof ApiError && e.status === 401)
              await SecureStore.deleteItemAsync("md_token");
            else Alert.alert("Connection", (e as Error).message);
            setScreen("login");
          }
        } else setScreen("welcome");
      } catch (e) {
        Alert.alert("Connect to your gym", (e as Error).message);
        setScreen("connect");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  async function api<T>(
    path: string,
    method = "GET",
    body?: object | FormData,
  ) {
    try {
      return await request<T>(server, token, path, method, body);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401 && token) {
        await SecureStore.deleteItemAsync("md_token");
        setToken(null);
        setUser(null);
        setData(null);
        setPayment(null);
        setSelectedPlan(null);
        setScreen("login");
      }
      throw e;
    }
  }
  async function connect(value: string) {
    const base = cleanServer(value),
      c = await request<Config>(base, null, "config");
    await SecureStore.setItemAsync("md_server", base);
    await SecureStore.deleteItemAsync("md_token");
    setServer(base);
    setConfig(c);
    setToken(null);
    setUser(null);
    setData(null);
    setPayment(null);
    setSelectedPlan(null);
    setScreen("welcome");
  }
  async function signIn(path: string, body: object) {
    const result = await request<{ user: User; token: string }>(
      server,
      null,
      "auth/" + path,
      "POST",
      body,
    );
    await SecureStore.setItemAsync("md_token", result.token);
    setToken(result.token);
    setUser(result.user);
    const snapshot = await request<Snapshot>(server, result.token, "dashboard");
    setData(snapshot);
    setScreen(path === "register" ? "plans" : "home");
  }
  async function refresh() {
    const d = await api<Snapshot>("dashboard");
    setData(d);
    setUser(d.user);
    return d;
  }
  async function logout() {
    let warning = "";
    try {
      if (token) await api("auth/logout", "POST", {});
    } catch (e) {
      warning = (e as Error).message;
    } finally {
      await SecureStore.deleteItemAsync("md_token");
      setToken(null);
      setUser(null);
      setData(null);
      setPayment(null);
      setSelectedPlan(null);
      setScreen("login");
    }
    if (warning)
      Alert.alert(
        "Logged out on this phone",
        "The server could not confirm session revocation. " + warning,
      );
  }
  return {
    server,
    token,
    user,
    data,
    config,
    screen,
    setScreen,
    loading,
    selectedPlan,
    setSelectedPlan,
    payment,
    setPayment,
    api,
    connect,
    signIn,
    refresh,
    logout,
    setUser,
  };
}
const Context = createContext<ReturnType<typeof useGymModel> | null>(null);
export function GymProvider({ children }: { children: React.ReactNode }) {
  return <Context.Provider value={useGymModel()}>{children}</Context.Provider>;
}
export function useGym() {
  const gym = useContext(Context);
  if (!gym) throw Error("Gym provider missing");
  return gym;
}
