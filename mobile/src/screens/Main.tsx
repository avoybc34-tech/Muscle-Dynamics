import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Screen,
  Card,
  H2,
  P,
  Label,
  Button,
  Row,
  Badge,
  Empty,
  ErrorBox,
  Skeleton,
  styles,
} from "../components/UI";
import { T, date, money } from "../theme";
import { useSession } from "../Session";
import type { Workout, Plan } from "../types";
export function useResource<T>(path: string) {
  const s = useSession();
  const [data, setData] = useState<T | null>(null),
    [busy, setBusy] = useState(true),
    [error, setError] = useState("");
  async function reload() {
    setBusy(true);
    setError("");
    try {
      setData(await s.api<T>(path));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    reload();
  }, [path, s.demo]);
  return { data, busy, error, reload };
}
export function Home({ navigation: n }: any) {
  const s = useSession(),
    d = s.data;
  const [refresh, setRefresh] = useState(false);
  if (!d)
    return (
      <Screen title="Your member space">
        {s.dataError ? (
          <ErrorBox
            message={s.dataError}
            retry={() => s.load().catch(() => {})}
          />
        ) : (
          <Skeleton />
        )}
      </Screen>
    );
  const m = d.membership,
    completed = d.activities.filter((a) => a.completedAt);
  return (
    <Screen
      onRefresh={async () => {
        setRefresh(true);
        try {
          await s.load();
        } finally {
          setRefresh(false);
        }
      }}
      refresh={refresh}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 8,
        }}
      >
        <View style={{ gap: 5, flex: 1 }}>
          <Label>YOUR DAILY MOMENTUM</Label>
          <Text numberOfLines={1} style={[styles.title, { fontSize: 28 }]}>
            Let's go, {s.user?.name.split(" ")[0]}.
          </Text>
          <P muted>One session closer to your goals.</P>
        </View>
        <Pressable
          accessibilityLabel="Open profile"
          onPress={() => n.navigate("Profile")}
          style={{
            height: 48,
            width: 48,
            borderRadius: 17,
            backgroundColor: T.raised,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: T.accent, fontSize: 20, fontWeight: "800" }}>
            {s.user?.name[0]}
          </Text>
        </Pressable>
      </View>
      {!!s.dataError && (
        <ErrorBox
          message={s.dataError}
          retry={() => s.load().catch(() => {})}
        />
      )}
      <LinearGradient
        colors={["#28483f", "#172f3a", "#152236"]}
        style={{ padding: 24, borderRadius: 27, gap: 16 }}
      >
        <View style={styles.row}>
          <Ionicons name="fitness-outline" color={T.accent} size={24} />
          <Label>SHOW UP FOR YOURSELF</Label>
        </View>
        <Text
          style={{
            color: T.text,
            fontSize: 33,
            lineHeight: 39,
            fontWeight: "800",
            letterSpacing: -1,
          }}
        >
          Your next chapter{`\n`}starts with a rep.
        </Text>
        <P muted>
          Explore your gym's training plans and make time for your next session.
        </P>
        <Button
          title="Find your workout"
          onPress={() => n.navigate("Workouts")}
        />
      </LinearGradient>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card style={{ flex: 1, padding: 16 }}>
          <Ionicons name="flash-outline" size={22} color={T.accent} />
          <Text style={{ color: T.text, fontSize: 29, fontWeight: "800" }}>
            {completed.length}
          </Text>
          <Text style={styles.tiny}>Completed sessions</Text>
        </Card>
        <Card style={{ flex: 1, padding: 16 }}>
          <Ionicons name="trending-up-outline" size={22} color={T.blue} />
          <Text style={{ color: T.text, fontSize: 29, fontWeight: "800" }}>
            {d.progress[0]?.weight ?? "—"}
            <Text style={styles.tiny}> kg</Text>
          </Text>
          <Text style={styles.tiny}>Latest logged weight</Text>
        </Card>
      </View>
      <H2>Your membership</H2>
      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Ionicons name="card-outline" size={25} color={T.accent} />
          <Badge value={m?.status || "NOT ACTIVE"} />
        </View>
        <H2>{m?.planName || "Find your fit."}</H2>
        <P muted>
          {m
            ? "Valid through " + date(m.endsAt)
            : "Choose an owner-published plan. Membership begins only after actual payment verification."}
        </P>
        <Button
          title={m ? "Manage membership" : "Explore plans"}
          outline
          onPress={() => n.navigate("Membership")}
        />
      </Card>
      <H2>Make it part of your week</H2>
      <Card>
        <Row
          icon="calendar-outline"
          title="Upcoming classes"
          subtitle={`${d.bookings.length} booking${d.bookings.length === 1 ? "" : "s"}`}
          onPress={() => n.navigate("Classes")}
        />
        <Row
          icon="analytics-outline"
          title="Log your progress"
          subtitle="Your own measurements, over time"
          onPress={() => n.navigate("ProgressEntry")}
        />
      </Card>
      {!!(d.announcements.length > 0) && (
        <>
          <H2>From your gym</H2>
          {d.announcements.slice(0, 2).map((a) => (
            <Card key={a.id}>
              <Label>GYM UPDATE</Label>
              <H2>{a.title}</H2>
              <P muted>{a.message}</P>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}
export function Workouts({ navigation: n }: any) {
  const r = useResource<Workout[]>("workouts"),
    [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(r.data?.map((x) => x.category))];
  return (
    <Screen
      title="Train with purpose."
      subtitle="Plans from your gym. Progress at your pace."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {categories.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 11,
              borderRadius: 30,
              backgroundColor: c === category ? T.accent : T.raised,
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                color: c === category ? T.bg : T.muted,
              }}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </View>
      {r.busy ? (
        <Skeleton />
      ) : r.error ? (
        <ErrorBox message={r.error} retry={r.reload} />
      ) : !r.data?.length ? (
        <Empty
          title="Your next routine is on its way"
          text="Your gym has not published a workout plan yet."
        />
      ) : (
        r.data
          .filter((w) => category === "All" || w.category === category)
          .map((w, i) => (
            <Pressable
              key={w.id}
              onPress={() => n.navigate("WorkoutDetail", { workout: w })}
            >
              <Card>
                <LinearGradient
                  colors={
                    i % 2 ? ["#363b59", "#182436"] : ["#214a42", "#142b32"]
                  }
                  style={{
                    borderRadius: 16,
                    padding: 22,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={
                      w.category === "Mobility"
                        ? "body-outline"
                        : "barbell-outline"
                    }
                    size={46}
                    color={T.accent}
                  />
                  <Text
                    style={{
                      color: T.text,
                      fontSize: 36,
                      fontWeight: "900",
                      opacity: 0.35,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                </LinearGradient>
                <Label>{w.category.toUpperCase()}</Label>
                <H2>{w.title}</H2>
                <P muted>
                  {w.durationMinutes} min · {w.level} · {w.exercises.length}{" "}
                  exercises
                </P>
              </Card>
            </Pressable>
          ))
      )}
      <Card>
        <Row
          icon="calendar-outline"
          title="Group classes"
          subtitle="Find a session and reserve your spot"
          onPress={() => n.navigate("Classes")}
        />
      </Card>
    </Screen>
  );
}
export function Membership({ navigation: n }: any) {
  const { data } = useSession(),
    m = data?.membership;
  return (
    <Screen
      title="Your membership."
      subtitle="A clear plan. A stronger routine."
    >
      <LinearGradient
        colors={["#263c55", "#16263a"]}
        style={{ borderRadius: 25, padding: 24, gap: 20 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Label>MUSCLE DYNAMICS</Label>
          <Badge value={m?.status || "INACTIVE"} />
        </View>
        <Text style={{ color: T.text, fontSize: 28, fontWeight: "800" }}>
          {m?.planName || "Your next chapter awaits."}
        </Text>
        <View style={{ flexDirection: "row", gap: 26 }}>
          <View>
            <Text style={styles.tiny}>MEMBER SINCE</Text>
            <P>{date(m?.startsAt)}</P>
          </View>
          <View>
            <Text style={styles.tiny}>VALID THROUGH</Text>
            <P>{date(m?.endsAt)}</P>
          </View>
        </View>
      </LinearGradient>
      <Button
        title={m ? "Renew or change plan" : "View membership plans"}
        onPress={() => n.navigate("Plans")}
      />
      <Card>
        <Row
          icon="receipt-outline"
          title="Payments & receipts"
          subtitle={`${data?.payments.filter((p) => p.status === "PENDING").length || 0} awaiting owner review`}
          onPress={() => n.navigate("Payments")}
        />
        <Row
          icon="notifications-outline"
          title="Membership reminders"
          subtitle="Manage notification permissions and preferences"
          onPress={() => n.navigate("NotificationSettings")}
        />
      </Card>
      <Card>
        <H2>Know where you stand.</H2>
        <P muted>
          Payments are verified by the gym, not by a screenshot. Same-plan
          active renewals extend your expiry. Other plan changes require owner
          review; no automatic refunds, recurring charges or proration.
        </P>
      </Card>
    </Screen>
  );
}
export function Activity({ navigation: n }: any) {
  const s = useSession(),
    d = s.data;
  return (
    <Screen
      title="Every session counts."
      subtitle="Your training history and personal progress."
    >
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card style={{ flex: 1 }}>
          <Label>WORKOUTS</Label>
          <H2>
            {d?.activities.filter((x) => x.completedAt).length || 0} completed
          </H2>
        </Card>
        <Card style={{ flex: 1 }}>
          <Label>PROGRESS</Label>
          <H2>{d?.progress.length || 0} entries</H2>
        </Card>
      </View>
      <Button
        title="Log a measurement"
        onPress={() => n.navigate("ProgressEntry")}
      />
      <Card>
        <Row
          icon="chatbox-ellipses-outline"
          title="Gym updates & messages"
          subtitle="Your notification history, without dashboard clutter"
          onPress={() => n.navigate("Updates")}
        />
      </Card>
      <H2>Workout history</H2>
      {!d?.activities.length ? (
        <Empty
          title="Your first session starts here"
          text="Start a workout to record sets and build your own history."
        />
      ) : (
        d.activities.map((a) => (
          <Card key={a.id}>
            <Badge value={a.completedAt ? "COMPLETED" : "IN PROGRESS"} />
            <H2>{a.title}</H2>
            <P muted>
              {date(a.startedAt)} · {a.sets.length} sets logged
              {a.completedAt
                ? " · " + Math.round(a.durationSeconds / 60) + " min"
                : ""}
            </P>
            <Button
              title={a.completedAt ? "View session" : "Resume session"}
              outline
              onPress={() => n.navigate("WorkoutSession", { activity: a })}
            />
          </Card>
        ))
      )}
      <H2>Measurements</H2>
      {d?.progress.map((p) => (
        <Card key={p.id}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <H2>{p.weight ?? "—"} kg</H2>
            <Text style={styles.tiny}>{date(p.createdAt)}</Text>
          </View>
          <P muted>Waist: {p.waist ?? "—"} cm</P>
          {!!p.notes && <P muted>{p.notes}</P>}
        </Card>
      ))}
    </Screen>
  );
}
export function Profile({ navigation: n }: any) {
  const s = useSession(),
    u = s.user;
  return (
    <Screen
      title="Your space."
      subtitle="Personal details, membership and preferences."
    >
      <Card style={{ alignItems: "center", paddingVertical: 28 }}>
        {u?.avatarId && !s.demo ? (
          <Image
            source={{
              uri: s.origin + "/v1/files/" + u.avatarId,
              headers: { Authorization: "Bearer " + s.token() },
            }}
            style={{ height: 88, width: 88, borderRadius: 30 }}
          />
        ) : (
          <View
            style={{
              height: 88,
              width: 88,
              borderRadius: 30,
              backgroundColor: T.raised,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 36, fontWeight: "800", color: T.accent }}>
              {u?.name[0]}
            </Text>
          </View>
        )}
        <H2>{u?.name}</H2>
        <P muted>{u?.email}</P>
        <P muted>{u?.phone}</P>
        <Badge value={s.data?.membership?.status || "NO MEMBERSHIP"} />
        <Button
          title="Edit personal details"
          outline
          onPress={() => n.navigate("EditProfile")}
        />
      </Card>
      <Card>
        <Row
          icon="card-outline"
          title="Membership"
          subtitle={s.data?.membership?.planName || "Explore available plans"}
          onPress={() => n.navigate("Membership")}
        />
        <Row
          icon="settings-outline"
          title="Settings"
          subtitle="Account, notifications and support"
          onPress={() => n.navigate("Settings")}
        />
        <Row
          icon="shield-checkmark-outline"
          title="Account security"
          subtitle="Password and active sessions"
          onPress={() => n.navigate("Security")}
        />
      </Card>
      {!!(u?.role === "OWNER") && (
        <Card>
          <Row
            icon="business-outline"
            title={s.user?.role === "STAFF" ? "Staff tools" : "Owner tools"}
            subtitle="Manage live gym data and payment reviews"
            onPress={() => n.navigate("Owner")}
          />
        </Card>
      )}
      <Button
        title={s.demo ? "Exit sample design" : "Log out"}
        outline
        onPress={async () => {
          const warning = await s.logout();
          if (warning)
            require("react-native").Alert.alert("Signed out", warning);
        }}
      />
    </Screen>
  );
}
