import React, { useEffect, useState } from "react";
import { Text, View, Alert } from "react-native";
import {
  Screen,
  Card,
  H2,
  P,
  Label,
  Button,
  Input,
  ErrorBox,
  Skeleton,
  Badge,
  Empty,
  styles,
} from "../components/UI";
import { useSession } from "../Session";
import { useResource } from "./Main";
import { T, date } from "../theme";
import type { Activity, Workout, SetRecord, GymClass } from "../types";
export function WorkoutDetail({ route, navigation: n }: any) {
  const w = route.params.workout as Workout,
    s = useSession();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Screen
      title={w.title}
      subtitle={`${w.level} · ${w.durationMinutes} min · ${w.category}`}
    >
      <P muted>{w.description}</P>
      {w.exercises.map((x, i) => (
        <Card key={i}>
          <Label>EXERCISE {String(i + 1).padStart(2, "0")}</Label>
          <H2>{x.name}</H2>
          <P>
            {x.sets} sets · {x.reps} reps · {x.restSeconds}s rest
          </P>
          <P muted>{x.instructions}</P>
        </Card>
      ))}
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Start workout"
        busy={busy}
        onPress={async () => {
          setBusy(true);
          try {
            const a = await s.api<Activity>(
              "workouts/" + w.id + "/start",
              "POST",
              {},
            );
            await s.load();
            n.replace("WorkoutSession", { activity: a });
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
export function WorkoutSession({ route }: any) {
  const s = useSession(),
    initial = route.params.activity as Activity;
  const [activity, setActivity] = useState(initial),
    [records, setRecords] = useState<
      Record<string, { reps: string; weight: string }>
    >(() =>
      Object.fromEntries(
        initial.sets.map((x) => [
          `${x.exerciseIndex}:${x.setIndex}`,
          { reps: String(x.reps), weight: String(x.weight) },
        ]),
      ),
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [restUntil, setRestUntil] = useState(0),
    [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () =>
        setRemaining(Math.max(0, Math.ceil((restUntil - Date.now()) / 1000))),
      400,
    );
    return () => clearInterval(id);
  }, [restUntil]);
  async function save(complete: boolean) {
    const sets: SetRecord[] = [];
    for (const [key, value] of Object.entries(records)) {
      if (!value.reps && !value.weight) continue;
      const [exerciseIndex, setIndex] = key.split(":").map(Number),
        reps = Number(value.reps),
        weight = Number(value.weight || 0);
      if (
        !Number.isInteger(reps) ||
        reps < 0 ||
        reps > 500 ||
        !Number.isFinite(weight) ||
        weight < 0 ||
        weight > 1000
      )
        return setError("Enter valid reps (0–500) and weight (0–1000 kg).");
      sets.push({ exerciseIndex, setIndex, reps, weight });
    }
    setBusy(true);
    setError("");
    try {
      const a = await s.api<Activity>("activity/" + activity.id, "PATCH", {
        sets,
        complete,
      });
      setActivity(a);
      await s.load();
      Alert.alert(
        complete ? "Workout complete" : "Progress saved",
        s.demo
          ? "Sample activity updated in memory."
          : "Your own workout record is saved.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title={activity.title}
      subtitle={
        activity.completedAt
          ? "Completed session · " + date(activity.completedAt)
          : "Log your sets. Rest when you need to."
      }
    >
      {!!(remaining > 0) && (
        <Card>
          <Label>REST TIMER</Label>
          <Text style={{ color: T.accent, fontSize: 40, fontWeight: "800" }}>
            {remaining}s
          </Text>
          <Button title="Skip rest" outline onPress={() => setRestUntil(0)} />
        </Card>
      )}
      {activity.exerciseSnapshot.map((x, i) => (
        <Card key={i}>
          <Label>EXERCISE {i + 1}</Label>
          <H2>{x.name}</H2>
          <P muted>
            {x.sets} × {x.reps} · {x.restSeconds}s rest
          </P>
          <P muted>{x.instructions}</P>
          {Array.from({ length: x.sets }, (_, j) => {
            const key = i + ":" + j,
              v = records[key] || { reps: "", weight: "" };
            return (
              <View key={j} style={{ gap: 10 }}>
                <Label>SET {j + 1}</Label>
                {activity.completedAt ? (
                  <P>
                    {v.reps || "—"} reps · {v.weight || "—"} kg
                  </P>
                ) : (
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Reps"
                        value={v.reps}
                        numeric
                        onChange={(reps) =>
                          setRecords({ ...records, [key]: { ...v, reps } })
                        }
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Weight · kg"
                        value={v.weight}
                        numeric
                        onChange={(weight) =>
                          setRecords({ ...records, [key]: { ...v, weight } })
                        }
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
          {!!!activity.completedAt && (
            <Button
              title={"Start " + x.restSeconds + "s rest"}
              outline
              onPress={() => {
                setRestUntil(Date.now() + x.restSeconds * 1000);
                setRemaining(x.restSeconds);
              }}
            />
          )}
        </Card>
      ))}
      {!!error && <ErrorBox message={error} />}
      {!!!activity.completedAt && (
        <>
          <Button
            title="Save progress"
            outline
            busy={busy}
            onPress={() => save(false)}
          />
          <Button
            title="Finish workout"
            busy={busy}
            onPress={() => save(true)}
          />
        </>
      )}
    </Screen>
  );
}
export function ProgressEntry() {
  const s = useSession();
  const [weight, setWeight] = useState(""),
    [waist, setWaist] = useState(""),
    [notes, setNotes] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Screen
      title="Small steps. Real progress."
      subtitle="Measurements are private to your account. Numbers are not the whole picture."
    >
      <Input
        label="Weight · kg (optional)"
        value={weight}
        onChange={setWeight}
        numeric
      />
      <Input
        label="Waist · cm (optional)"
        value={waist}
        onChange={setWaist}
        numeric
      />
      <Input label="Notes" value={notes} onChange={setNotes} multiline />
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Save measurement"
        busy={busy}
        onPress={async () => {
          const w = weight ? Number(weight) : null,
            v = waist ? Number(waist) : null;
          if (
            (w !== null && (!Number.isFinite(w) || w < 20 || w > 500)) ||
            (v !== null && (!Number.isFinite(v) || v < 20 || v > 300))
          )
            return setError(
              "Enter a valid weight (20–500 kg) and waist (20–300 cm).",
            );
          if (!weight && !waist && !notes.trim())
            return setError("Enter at least one measurement or note.");
          setBusy(true);
          try {
            await s.api("progress", "POST", { weight: w, waist: v, notes });
            await s.load();
            setWeight("");
            setWaist("");
            setNotes("");
            Alert.alert(
              "Saved",
              s.demo ? "Sample entry only." : "Your progress entry is saved.",
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
export function Classes() {
  const s = useSession(),
    r = useResource<GymClass[]>("classes"),
    [busy, setBusy] = useState(""),
    [error, setError] = useState("");
  return (
    <Screen
      title="Find your next session."
      subtitle="Book a class your membership covers."
    >
      {r.busy ? (
        <Skeleton />
      ) : r.error ? (
        <ErrorBox message={r.error} retry={r.reload} />
      ) : !r.data?.length ? (
        <Empty
          title="No upcoming classes"
          text="Your gym will publish its real schedule here."
        />
      ) : (
        r.data.map((c) => {
          const b = s.data?.bookings.find((x) => x.classId === c.id);
          return (
            <Card key={c.id}>
              <Badge value={b ? "BOOKED" : "UPCOMING"} />
              <H2>{c.title}</H2>
              <P muted>{c.trainer}</P>
              <P>
                {new Date(c.startsAt).toLocaleString("en-PK")} ·{" "}
                {c._count.bookings}/{c.capacity} places
              </P>
              <Button
                title={b ? "Cancel booking" : "Book a place"}
                busy={busy === c.id}
                outline={!!b}
                onPress={async () => {
                  setBusy(c.id);
                  setError("");
                  try {
                    if (b) await s.api("bookings/" + b.id, "DELETE");
                    else await s.api("classes/" + c.id + "/book", "POST", {});
                    await s.load();
                    await r.reload();
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy("");
                  }
                }}
              />
            </Card>
          );
        })
      )}
      {!!error && <ErrorBox message={error} />}
    </Screen>
  );
}
