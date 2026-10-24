import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import {
  Screen,
  Card,
  Row,
  H2,
  P,
  Button,
  Input,
  Toggle,
  ErrorBox,
  Empty,
  Badge,
  Skeleton,
} from "../components/UI";
import { useSession } from "../Session";
import { useResource } from "./Main";
import { registerPush } from "../services/push";
import { date } from "../theme";
import type { Preferences } from "../types";
export function Settings({ navigation: n }: any) {
  const s = useSession();
  return (
    <Screen title="Settings." subtitle="Your account. Your preferences.">
      <Card>
        <H2>Account</H2>
        <Row
          icon="person-outline"
          title="Personal information"
          onPress={() => n.navigate("EditProfile")}
        />
        <Row
          icon="shield-checkmark-outline"
          title="Security & sessions"
          onPress={() => n.navigate("Security")}
        />
        <Row
          icon="notifications-outline"
          title="Notification preferences"
          onPress={() => n.navigate("NotificationSettings")}
        />
      </Card>
      <Card>
        <H2>Support & information</H2>
        <Row
          icon="help-circle-outline"
          title="Help & support"
          onPress={() => n.navigate("Support")}
        />
        <Row
          icon="document-text-outline"
          title="Terms & privacy"
          onPress={() => n.navigate("Policies")}
        />
        <Row
          icon="mail-outline"
          title="Gym updates & history"
          onPress={() => n.navigate("Updates")}
        />
        <Row
          icon="information-circle-outline"
          title="App version"
          subtitle={
            (Constants.expoConfig?.version || "2.0.0") + " · Muscle Dynamics"
          }
        />
      </Card>
      <Card>
        <H2>Account data</H2>
        <P muted>
          For data access or deletion, submit a verified request to the gym.
          Financial records may need to be retained under its published policy.
          This does not instantly delete your account.
        </P>
        <Button
          title="Request account deletion"
          outline
          onPress={() =>
            Alert.alert(
              "Request deletion review?",
              "The gym will verify your identity and respond through support. No immediate deletion is promised.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Submit request",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await s.api("support", "POST", {
                        subject: "Account deletion request",
                        message:
                          "Please contact me to verify my identity and review deletion/retention of my account data under the gym privacy policy.",
                      });
                      await s.load();
                      Alert.alert(
                        s.demo ? "Sample request" : "Request submitted",
                        s.demo
                          ? "No real request was sent."
                          : "Track the request in Support.",
                      );
                    } catch (e) {
                      Alert.alert("Could not submit", (e as Error).message);
                    }
                  },
                },
              ],
            )
          }
        />
      </Card>
    </Screen>
  );
}
export function EditProfile() {
  const s = useSession();
  const [name, setName] = useState(s.user?.name || ""),
    [phone, setPhone] = useState(s.user?.phone || ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function avatar() {
    if (s.demo)
      return Alert.alert(
        "Demo mode",
        "Profile photo upload requires a real connected account.",
      );
    try {
      const pick = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (pick.canceled) return;
      const file = pick.assets[0];
      if ((file.fileSize || 0) > 5 * 1024 * 1024)
        throw Error("Choose a photo under 5 MB.");
      setBusy(true);
      const form = new FormData();
      form.append("file", {
        uri: file.uri,
        type: file.mimeType || "image/jpeg",
        name: "avatar.jpg",
      } as unknown as Blob);
      await s.api("avatar", "POST", form);
      await s.load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title="Personal information."
      subtitle="Your email stays tied to your secure account."
    >
      <Button
        title="Change profile photo"
        outline
        busy={busy}
        onPress={avatar}
      />
      <Input label="Full name" value={name} onChange={setName} />
      <Card>
        <P muted>{s.user?.email}</P>
      </Card>
      <Input label="Phone number" value={phone} onChange={setPhone} />
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Save changes"
        busy={busy}
        onPress={async () => {
          if (name.trim().length < 2 || phone.trim().length < 6)
            return setError("Enter your full name and a valid phone number.");
          setBusy(true);
          setError("");
          try {
            await s.api("profile", "PATCH", {
              name: name.trim(),
              phone: phone.trim(),
            });
            await s.load();
            Alert.alert(
              "Saved",
              s.demo
                ? "Sample profile changed in memory."
                : "Your profile is updated.",
            );
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
export function NotificationSettings() {
  const s = useSession();
  const [prefs, setPrefs] = useState<Preferences>(s.user!.preferences),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const labels: Record<keyof Preferences, string> = {
    push: "Push notifications",
    membership: "Membership & expiry reminders",
    payments: "Payment review updates",
    announcements: "Gym announcements",
    workouts: "New workout plans",
    promotions: "Promotional updates",
  };
  return (
    <Screen
      title="Stay in the loop."
      subtitle="Choose what reaches your phone. You can change system permissions at any time."
    >
      <Card>
        {(Object.keys(labels) as (keyof Preferences)[]).map((k) => (
          <Toggle
            key={k}
            title={labels[k]}
            value={prefs[k]}
            onChange={(value) => setPrefs({ ...prefs, [k]: value })}
          />
        ))}
      </Card>
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Save preferences"
        busy={busy}
        onPress={async () => {
          setBusy(true);
          setError("");
          try {
            await s.api("preferences", "PATCH", prefs);
            await s.load();
            Alert.alert(
              "Preferences saved",
              s.demo
                ? "Sample settings only."
                : "These preferences control future gym push delivery.",
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      <Button
        title="Enable notifications on this device"
        outline
        busy={busy}
        onPress={async () => {
          if (s.demo)
            return setError(
              "Push registration is not available in the isolated demo.",
            );
          setBusy(true);
          setError("");
          try {
            await registerPush(s.api);
            Alert.alert(
              "Device registered",
              "The backend must also enable its configured push worker. Registration is not proof of delivery.",
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      <Button
        title="Open system notification settings"
        outline
        onPress={() =>
          Linking.openSettings().catch(() =>
            setError("Open Settings manually for this app."),
          )
        }
      />
      <Card>
        <P muted>
          Push requires a real configured project, native credentials, a signed
          device build, network access and permission. iOS/Android can restrict
          delivery in force-stopped or power-saving states. No delivery is
          claimed until physically tested.
        </P>
      </Card>
    </Screen>
  );
}
export function Security() {
  const s = useSession(),
    r = useResource<
      {
        id: string;
        deviceName: string;
        createdAt: string;
        current: boolean;
      }[]
    >("sessions");
  const [current, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Screen
      title="Account security."
      subtitle="Keep your password private and review active sessions."
    >
      <Card>
        <H2>Change password</H2>
        <Input
          label="Current password"
          value={current}
          onChange={setCurrent}
          secure
        />
        <Input
          label="New password · 10+ characters"
          value={password}
          onChange={setPassword}
          secure
        />
        <Input
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          secure
        />
        <Button
          title="Update password & sign out"
          busy={busy}
          onPress={async () => {
            if (password.length < 10 || password !== confirm)
              return setError(
                "Use matching passwords with at least 10 characters.",
              );
            if (s.demo) return setError("No password exists in demo mode.");
            setBusy(true);
            setError("");
            try {
              await s.api("password", "POST", {
                currentPassword: current,
                password,
              });
              await s.logout();
              Alert.alert(
                "Password changed",
                "All previous sessions were revoked. Sign in again.",
              );
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </Card>
      {!!error && <ErrorBox message={error} />}
      <H2>Active sessions</H2>
      {r.busy ? (
        <Skeleton />
      ) : r.error ? (
        <ErrorBox message={r.error} retry={r.reload} />
      ) : (
        r.data?.map((x) => (
          <Card key={x.id}>
            <H2>{x.deviceName}</H2>
            <P muted>
              {date(x.createdAt)}
              {x.current ? " · This session" : ""}
            </P>
            {!!!x.current && (
              <Button
                title="Revoke this session"
                outline
                onPress={async () => {
                  try {
                    await s.api("sessions/" + x.id, "DELETE");
                    await r.reload();
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              />
            )}
          </Card>
        ))
      )}
      {!!s.demo && <P muted>Demo has no persisted sessions.</P>}
    </Screen>
  );
}
export function Support() {
  const s = useSession();
  const [subject, setSubject] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Screen
      title="We've got your back."
      subtitle="Contact your gym. Never send passwords, PINs or bank-login details."
    >
      <Card>
        <H2>Quick answers</H2>
        <P>When does membership start?</P>
        <P muted>
          After the owner verifies actual funds. Uploading a receipt alone
          grants no membership.
        </P>
        <P>Where are my reminders?</P>
        <P muted>
          Enable device permission and your notification preferences. The gym
          must also configure push delivery.
        </P>
        <P>Can I change plans?</P>
        <P muted>
          Choose a published plan and request it through the payment flow.
          Active plan changes require owner review; no automatic refund or
          proration.
        </P>
      </Card>
      <Input label="Subject" value={subject} onChange={setSubject} />
      <Input label="Message" value={message} onChange={setMessage} multiline />
      {!!error && <ErrorBox message={error} />}
      <Button
        title={s.demo ? "Save sample message" : "Send support message"}
        busy={busy}
        onPress={async () => {
          if (subject.trim().length < 3 || message.trim().length < 3)
            return setError(
              "Enter a subject and message of at least 3 characters.",
            );
          setBusy(true);
          setError("");
          try {
            await s.api("support", "POST", {
              subject: subject.trim(),
              message: message.trim(),
            });
            await s.load();
            setSubject("");
            setMessage("");
            Alert.alert(
              "Saved",
              s.demo
                ? "No real message was sent."
                : "Your gym can now reply to this ticket.",
            );
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      <H2>Your conversations</H2>
      {s.data?.tickets.map((t) => (
        <Card key={t.id}>
          <Badge value={t.status} />
          <H2>{t.subject}</H2>
          <P muted>{t.message}</P>
          {!!t.reply && <P>{t.reply}</P>}
          <P muted>{date(t.createdAt)}</P>
        </Card>
      ))}
    </Screen>
  );
}
export function Policies() {
  const s = useSession();
  const [error, setError] = useState("");
  useEffect(() => {
    s.fetchConfig().catch((e) => setError(e.message));
  }, [s.origin]);
  return (
    <Screen title="Terms & privacy.">
      {!!error && <ErrorBox message={error} />}
      <Card>
        <H2>Membership terms</H2>
        <P muted>
          {s.config?.termsText || "The gym has not published its terms yet."}
        </P>
      </Card>
      <Card>
        <H2>Privacy policy</H2>
        <P muted>
          {s.config?.privacyText ||
            "The gym has not published its privacy policy yet."}
        </P>
      </Card>
      <Card>
        <H2>Contact your gym</H2>
        <P muted>
          {[
            s.config?.phone,
            s.config?.email,
            s.config?.address,
            s.config?.hours,
          ]
            .filter(Boolean)
            .join("\n") || "Contact details are not configured."}
        </P>
      </Card>
    </Screen>
  );
}
export function Updates() {
  const s = useSession(),
    [error, setError] = useState("");
  return (
    <Screen
      title="Your gym updates."
      subtitle="A private history of account and gym messages."
    >
      {!s.data?.notifications.length ? (
        <Empty
          title="You're all caught up"
          text="Verified payment updates and gym messages will appear here."
        />
      ) : (
        <Button
          title="Mark all read"
          outline
          onPress={async () => {
            try {
              await s.api("notifications/read", "POST", {
                ids: s.data!.notifications.map((x) => x.id),
              });
              await s.load();
            } catch (e) {
              setError((e as Error).message);
            }
          }}
        />
      )}
      {!!error && <ErrorBox message={error} />}
      {s.data?.notifications.map((x) => (
        <Card key={x.id}>
          <Badge value={x.readAt ? "READ" : "NEW"} />
          <H2>{x.title}</H2>
          <P>{x.message}</P>
          <P muted>{date(x.createdAt)}</P>
        </Card>
      ))}
    </Screen>
  );
}
