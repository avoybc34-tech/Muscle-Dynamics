import React, { useEffect, useState } from "react";
import { View, Text, Alert, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  Screen,
  Button,
  Input,
  Card,
  H2,
  P,
  Label,
  ErrorBox,
  styles,
} from "../components/UI";
import { useSession } from "../Session";
import { T } from "../theme";
import { send } from "../services/client";
const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export function Welcome({ navigation: n }: any) {
  const s = useSession();
  return (
    <Screen>
      <View style={{ paddingTop: 45, gap: 35 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{ backgroundColor: T.accent, padding: 13, borderRadius: 16 }}
          >
            <Text style={{ fontWeight: "900", fontSize: 22, color: T.bg }}>
              MD
            </Text>
          </View>
          <Text style={{ color: T.text, fontWeight: "800", letterSpacing: 2 }}>
            MUSCLE{`\n`}DYNAMICS
          </Text>
        </View>
        <LinearGradient
          colors={["#20394a", "#111f31"]}
          style={{
            borderRadius: 30,
            padding: 30,
            gap: 20,
            minHeight: 260,
            justifyContent: "space-between",
          }}
        >
          <Ionicons name="barbell-outline" size={70} color={T.accent} />
          <Label>YOUR STRONGER CHAPTER</Label>
          <Text
            style={{
              color: T.text,
              fontSize: 45,
              fontWeight: "800",
              lineHeight: 49,
              letterSpacing: -2,
            }}
          >
            Built by{`\n`}showing up.
          </Text>
        </LinearGradient>
        <P muted>
          Your training, membership and progress. One focused space to keep
          moving forward.
        </P>
        <Button
          title="Log in to your gym"
          onPress={() => n.navigate("Login")}
        />
        <Button
          title="Create an account"
          outline
          onPress={() => n.navigate("SignUp")}
        />
        <Pressable onPress={() => n.navigate("Connection")}>
          <Text style={[styles.link, { textAlign: "center" }]}>
            {s.origin ? "Gym server settings" : "Connect your gym server"}
          </Text>
        </Pressable>
        <Pressable onPress={() => s.enterDemo()}>
          <Text style={{ color: T.muted, textAlign: "center", padding: 12 }}>
            Explore sample design · no account
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
export function Connection({ navigation: n }: any) {
  const s = useSession();
  const [url, setUrl] = useState(s.origin),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Screen
      title="Your gym connection"
      subtitle="Use your gym's HTTPS API origin. No /v1 path, passwords or database address."
    >
      <Input label="API origin" value={url} onChange={setUrl} />
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Verify and connect"
        busy={busy}
        onPress={async () => {
          setBusy(true);
          setError("");
          try {
            const c = await s.connect(url);
            Alert.alert(
              "Connected",
              c.gymName + " is ready for account access.",
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      {!!(s.config?.ownerExists === false) && (
        <Button
          title="Set up first owner"
          outline
          onPress={() => n.navigate("OwnerSetup")}
        />
      )}
      <Card>
        <P muted>
          Hosting is configured separately. Missing services are reported
          honestly; the app never silently replaces live accounts with sample
          data.
        </P>
      </Card>
    </Screen>
  );
}
export function AuthForm({ navigation: n, route }: any) {
  const s = useSession(),
    signup = route.name === "SignUp";
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [accepted, setAccepted] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    s.fetchConfig().catch(() => {});
  }, [s.origin]);
  async function submit() {
    setError("");
    if (!emailValid(email.trim()))
      return setError("Enter a valid email address.");
    if (password.length < 10)
      return setError("Use a password of at least 10 characters.");
    if (
      signup &&
      (name.trim().length < 2 ||
        phone.trim().length < 6 ||
        password !== confirm ||
        !accepted)
    )
      return setError(
        "Check your name/phone, match both passwords and accept the published policies.",
      );
    setBusy(true);
    try {
      await s.login(signup ? "register" : "login", {
        email: email.trim().toLowerCase(),
        password,
        ...(signup
          ? { name: name.trim(), phone: phone.trim(), acceptTerms: true }
          : { deviceName: "Muscle Dynamics app" }),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title={signup ? "Your day one." : "Welcome back."}
      subtitle={
        signup
          ? "Create your secure member account."
          : "Sign in to pick up where you left off."
      }
    >
      {!!!s.origin && (
        <ErrorBox
          message="Connect your gym server before signing in."
          retry={() => n.navigate("Connection")}
        />
      )}
      {!!(signup && s.config && !s.config.registrationOpen) && (
        <ErrorBox message="The gym has not opened registration. Contact the owner to complete contacts and policies." />
      )}
      {!!signup && (
        <>
          <Input label="Full name" value={name} onChange={setName} />
          <Input label="Phone number" value={phone} onChange={setPhone} />
        </>
      )}
      <Input label="Email address" value={email} onChange={setEmail} email />
      <Input label="Password" value={password} onChange={setPassword} secure />
      {!!signup && (
        <>
          <Input
            label="Confirm password"
            value={confirm}
            onChange={setConfirm}
            secure
          />
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accepted }}
            onPress={() => setAccepted(!accepted)}
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              minHeight: 48,
            }}
          >
            <Ionicons
              name={accepted ? "checkbox" : "square-outline"}
              size={24}
              color={T.accent}
            />
            <Text style={{ color: T.muted, flex: 1, lineHeight: 21 }}>
              I agree to the gym's published membership terms and privacy
              policy.
            </Text>
          </Pressable>
          <Button
            title="Read terms and privacy"
            outline
            onPress={() => n.navigate("Policies")}
          />
        </>
      )}
      {!!error && <ErrorBox message={error} />}
      <Button
        title={signup ? "Create account" : "Log in"}
        busy={busy}
        disabled={!s.origin || (signup && s.config?.registrationOpen === false)}
        onPress={submit}
      />
      {!!!signup && (
        <Button
          title="Forgot your password?"
          outline
          onPress={() => n.navigate("Forgot")}
        />
      )}
      <Button
        title={signup ? "Already a member? Log in" : "New here? Create account"}
        outline
        onPress={() => n.replace(signup ? "Login" : "SignUp")}
      />
    </Screen>
  );
}
export function Recovery({ navigation: n, route }: any) {
  const s = useSession(),
    reset = route.name === "Reset";
  const [email, setEmail] = useState(""),
    [code, setCode] = useState(route.params?.token || ""),
    [pass, setPass] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  return (
    <Screen
      title={reset ? "A fresh start." : "Reset your password"}
      subtitle={
        reset
          ? "Paste the one-time code from your email."
          : "Reset links work only after the gym configures its mail service."
      }
    >
      {reset ? (
        <>
          <Input label="Reset code" value={code} onChange={setCode} />
          <Input label="New password" value={pass} onChange={setPass} secure />
          <Input
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            secure
          />
        </>
      ) : (
        <Input
          label="Registered email"
          value={email}
          onChange={setEmail}
          email
        />
      )}
      {!!error && <ErrorBox message={error} />}
      {!!success && (
        <Card>
          <P>{success}</P>
        </Card>
      )}
      <Button
        title={reset ? "Update password" : "Request reset code"}
        busy={busy}
        onPress={async () => {
          setError("");
          setSuccess("");
          if (reset && (pass.length < 10 || pass !== confirm))
            return setError("Use 10+ characters and matching passwords.");
          if (!reset && !emailValid(email))
            return setError("Enter a valid email.");
          setBusy(true);
          try {
            const r = await send<{ message?: string }>(
              s.origin,
              reset ? "auth/reset" : "auth/forgot",
              {
                method: "POST",
                body: reset
                  ? { token: code.trim(), password: pass }
                  : { email: email.toLowerCase().trim() },
              },
            );
            setSuccess(
              reset
                ? "Password updated. Log in with your new password."
                : r.message || "Check your email.",
            );
            if (reset) {
              setPass("");
              setConfirm("");
            }
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      <Button
        title={reset ? "Back to login" : "I already have a reset code"}
        outline
        onPress={() => n.navigate(reset ? "Login" : "Reset")}
      />
    </Screen>
  );
}
export function OwnerSetup() {
  const s = useSession();
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [setupToken, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Screen
      title="Make this your gym."
      subtitle="One-time owner setup. Keep the server bootstrap token private."
    >
      <Input
        label="Setup token"
        value={setupToken}
        onChange={setToken}
        secure
      />
      <Input label="Owner full name" value={name} onChange={setName} />
      <Input label="Owner email" value={email} onChange={setEmail} email />
      <Input label="Owner phone" value={phone} onChange={setPhone} />
      <Input
        label="Owner password · 10+ characters"
        value={password}
        onChange={setPassword}
        secure
      />
      <Input
        label="Confirm owner password"
        value={confirm}
        onChange={setConfirm}
        secure
      />
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Create first owner"
        busy={busy}
        onPress={async () => {
          setBusy(true);
          try {
            setError("");
            if (password.length < 10 || password !== confirm)
              throw Error(
                "Use matching passwords with at least 10 characters.",
              );
            await s.login("setup", {
              name,
              email: email.toLowerCase().trim(),
              phone,
              password,
              setupToken,
            });
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
    </Screen>
  );
}
