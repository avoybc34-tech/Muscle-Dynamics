import { Text } from "../components/Typography";
import React, { useEffect, useState } from "react";
import { View, Pressable, Image } from "react-native";
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
import { Brand, TrainingHero, Week } from "../components/Visuals";
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
    d = s.data,
    r = useResource<Workout[]>("workouts");
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
  const featured = r.data?.[0],
    m = d.membership;
  return (
    <Screen
      refresh={refresh}
      onRefresh={async () => {
        setRefresh(true);
        try {
          await s.load();
          await r.reload();
        } finally {
          setRefresh(false);
        }
      }}
    >
      <Brand
        name={s.user?.name || "Member"}
        avatar={
          s.user?.avatarId && !s.demo
            ? {
                uri: s.origin + "/v1/files/" + s.user.avatarId,
                headers: { Authorization: "Bearer " + s.token() },
              }
            : undefined
        }
        onPress={() => n.navigate("Profile")}
      />
      {!!s.dataError && (
        <ErrorBox
          message={s.dataError}
          retry={() => s.load().catch(() => {})}
        />
      )}
      {r.busy ? (
        <Skeleton />
      ) : r.error ? (
        <ErrorBox message={r.error} retry={r.reload} />
      ) : featured ? (
        <TrainingHero
          title={featured.title}
          meta={`${featured.durationMinutes} min · ${featured.exercises.length} exercises`}
          action="Start workout"
          onPress={() => n.navigate("WorkoutDetail", { workout: featured })}
        />
      ) : (
        <Empty
          title="Your next session starts here"
          text="Your gym has not published a training plan yet."
        />
      )}
      <Week activities={d.activities} onPress={() => n.navigate("Activity")} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Manage membership"
        onPress={() => n.navigate("Membership")}
      >
        <Card style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 5 }}>
              <H2>{m?.planName || "Your membership"}</H2>
              <P muted>
                {m
                  ? `${m.status === "ACTIVE" ? "Valid until" : "Status: " + m.status + " ·"} ${date(m.endsAt)}`
                  : "Explore gym-published plans"}
              </P>
            </View>
            <Ionicons name="chevron-forward" size={22} color={T.text} />
          </View>
        </Card>
      </Pressable>
      {d.announcements.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Read gym updates"
          onPress={() => n.navigate("Updates")}
        >
          <Card style={{ padding: 16, backgroundColor: T.bg, gap: 4 }}>
            <Text style={{ fontSize: 11, color: T.accent }}>Gym update</Text>
            <P muted>{d.announcements[0].title}</P>
          </Card>
        </Pressable>
      ) : null}
      <Card>
        <Row
          icon="calendar-outline"
          title="Class schedule"
          subtitle={`${d.bookings.length} upcoming booking${d.bookings.length === 1 ? "" : "s"}`}
          onPress={() => n.navigate("Classes")}
        />
        <Row
          icon="analytics-outline"
          title="Log your progress"
          subtitle="Your own measurements, over time"
          onPress={() => n.navigate("ProgressEntry")}
        />
      </Card>
    </Screen>
  );
}
export function Workouts({ navigation: n }: any) {
  const r = useResource<Workout[]>("workouts"),
    [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(r.data?.map((x) => x.category))],
    filtered = r.data?.filter(
      (w) => category === "All" || w.category === category,
    );
  return (
    <Screen
      title="Find your focus."
      subtitle="Trainer-published plans, built for your gym."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {categories.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            accessibilityLabel={c + " workout category"}
            onPress={() => setCategory(c)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: c === category ? T.primary : T.line,
              backgroundColor: c === category ? T.primary : "transparent",
            }}
          >
            <Text
              style={{
                color: c === category ? "white" : T.muted,
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {c === "All" ? "All plans" : c}
            </Text>
          </Pressable>
        ))}
      </View>
      {r.busy ? (
        <Skeleton />
      ) : r.error ? (
        <ErrorBox message={r.error} retry={r.reload} />
      ) : !filtered?.length ? (
        <Empty
          title="Your next routine is on its way"
          text="Your gym has not published a workout in this category yet."
        />
      ) : (
        filtered.map((w, i) =>
          i === 0 ? (
            <TrainingHero
              key={w.id}
              eyebrow={w.category}
              title={w.title}
              meta={`${w.durationMinutes} min · ${w.level} · ${w.exercises.length} exercises`}
              action="View workout"
              onPress={() => n.navigate("WorkoutDetail", { workout: w })}
            />
          ) : (
            <Card key={w.id}>
              <Row
                icon="barbell-outline"
                title={w.title}
                subtitle={`${w.durationMinutes} min · ${w.level} · ${w.exercises.length} exercises`}
                onPress={() => n.navigate("WorkoutDetail", { workout: w })}
              />
            </Card>
          ),
        )
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
      title="Keep moving."
      subtitle="Your plan, paid-through date and payment records."
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
      title="Progress, over time."
      subtitle="Your training history and personal progress."
    >
      <Week activities={d?.activities || []} />
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
      title="Your profile."
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
              borderRadius: 44,
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
      {u?.role !== "MEMBER" ? (
        <Card>
          <Row
            icon="business-outline"
            title={u?.role === "STAFF" ? "Staff workspace" : "Owner workspace"}
            subtitle="Gym management and restricted administrative tools"
            onPress={() => n.navigate("Owner")}
          />
        </Card>
      ) : null}
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
