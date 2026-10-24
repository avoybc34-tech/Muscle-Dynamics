import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  AppState,
  Share,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
type PreviewAsset={uri:string;width:number;height:number;fileName:string;mimeType:string};
import { GymProvider, useGym } from "./src/GymProvider";
import { Logo, Button, Field, Head, Note, Badge, Empty, s, C } from "./src/ui";
import { money, date, time } from "./src/format";
import type { Plan, Account, Payment, GymClass, Screen } from "./src/types";
const message = (e: unknown) =>
  Alert.alert(
    "A quick heads-up",
    e instanceof Error ? e.message : "Please try again.",
  );
function Connect() {
 const {connect,setScreen}=useGym();
 return <><Head label="OFFLINE DESIGN PREVIEW" title="Explore your app." text="No API or account is needed. Every record is clearly labelled sample content. Changes stay in memory and reset on restart."/><Button title="Reset sample data and open dashboard" onPress={()=>{connect().catch(message);}}/><Button title="Preview welcome screen" outline onPress={()=>setScreen('welcome')}/><Note text="Real login, money transfers, password changes and messages are not connected. Do not enter personal information."/></>;
}
function Welcome() {
  const { setScreen, config } = useGym();
  return (
    <View style={s.welcome}>
      <Text style={s.welcomeEyebrow}>STRONGER THAN YESTERDAY.</Text>
      <Text style={s.welcomeTitle}>Show up.{`\n`}Get stronger.</Text>
      <Text style={[s.p, { color: "#9CACBF", fontSize: 13 }]}>
        Your membership. Your training. Your next chapter at{" "}
        {config?.gymName || "Muscle Dynamics"}.
      </Text>
      <View style={s.welcomeLine} />
      <Button title="Start your journey" onPress={() => setScreen("signup")} />
      <Button
        title="Already a member? Log in"
        outline
        onPress={() => setScreen("login")}
      />
      <Pressable onPress={() => setScreen("connect")}>
        <Text style={[s.link, { color: "#91A7C8" }]}>
          Preview settings
        </Text>
      </Pressable>
    </View>
  );
}
function Auth() {
  const { screen, setScreen, signIn, config, server } = useGym();
  const signup = screen === "signup";
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [password, setPassword] = useState(""),
    [accept, setAccept] = useState(false),
    [busy, setBusy] = useState(false);
  async function submit() {
    if (signup && !accept) {
      Alert.alert(
        "Membership terms",
        "Read and agree to the gym’s terms and privacy notice before creating an account.",
      );
      return;
    }
    setBusy(true);
    try {
      await signIn(signup ? "register" : "login", {
        ...(signup ? { name, phone, acceptTerms: true } : {}),
        email,
        password,
      });
    } catch (e) {
      message(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Head
        label="YOUR NEXT CHAPTER"
        title={signup ? "Make this your day one." : "Good to have you back."}
        text={
          signup
            ? "Sample signup layout. No real account will be created."
            : "Sample login layout. No password is required; do not enter real credentials."
        }
      />
      {signup && !config?.registrationOpen && (
        <Note
          warn
          text="The gym is preparing registration. Ask the owner to publish contact details and membership policies first."
        />
      )}
      {signup && (
        <>
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Phone number" value={phone} onChange={setPhone} />
        </>
      )}
      <Field label="Email address" value={email} onChange={setEmail} email />
      <Field label="Password" value={password} onChange={setPassword} secure />
      {signup && (
        <>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: accept }}
            onPress={() => setAccept(!accept)}
            style={s.checkbox}
          >
            <Ionicons
              name={accept ? "checkbox" : "square-outline"}
              size={22}
              color={C.blue}
            />
            <Text style={[s.small, { flex: 1, fontSize: 11 }]}>
              I agree to the gym’s membership terms and privacy notice.
            </Text>
          </Pressable>
          <View style={[s.row, { marginBottom: 20 }]}>
            <Pressable
              onPress={() => Alert.alert("Preview terms", "Sample design only. Real gym terms will be configured with the future backend.")}
            >
              <Text style={s.link}>Read terms</Text>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert("Preview privacy", "Nothing is sent to a server. Do not enter personal data.")}
            >
              <Text style={s.link}>Privacy notice</Text>
            </Pressable>
          </View>
        </>
      )}
      <Button
        title={signup ? "Create account" : "Log in"}
        busy={busy || (signup && !config?.registrationOpen)}
        onPress={submit}
      />
      <Pressable onPress={() => setScreen(signup ? "login" : "signup")}>
        <Text style={s.link}>
          {signup
            ? "Already a member? Log in"
            : "New here? Create your account"}
        </Text>
      </Pressable>
      {!signup && (
        <Button
          title="Forgot your password?"
          outline
          onPress={() =>
            Alert.alert(
              "Contact your gym",
              "The owner can verify your identity and reset your password securely.\n\n" +
                (config?.phone || config?.email || "Ask at the gym reception."),
            )
          }
        />
      )}
      <Pressable onPress={() => setScreen("connect")}>
        <Text style={[s.link, { color: C.muted }]}>Preview settings</Text>
      </Pressable>
    </>
  );
}
function Home() {
  const { user, data, setScreen } = useGym();
  const latest = data?.progress.find((p) => p.weight);
  return (
    <>
      <Head
        label="STRONGER THAN YESTERDAY"
        title={"Let’s go, " + user?.name.split(" ")[0] + "."}
        text="Small steps. Consistent effort. Your next stronger chapter."
      />
      <View style={s.stats}>
        <View style={s.stat}>
          <Ionicons name="calendar-outline" size={21} color={C.blue} />
          <Text style={s.statValue}>{data?.attendance.length || 0}</Text>
          <Text style={s.statLabel}>Recent gym visits</Text>
        </View>
        <View style={s.stat}>
          <Ionicons name="analytics-outline" size={21} color={C.blue} />
          <Text style={s.statValue}>{latest?.weight || "—"}</Text>
          <Text style={s.statLabel}>Latest weight · kg</Text>
        </View>
      </View>
      <View style={s.memberCard}>
        <Text style={[s.eyebrow, { color: "#8DADD6" }]}>
          YOUR COMMITMENT. YOUR POSSIBILITIES.
        </Text>
        <Text style={s.memberTitle}>
          {data?.membership?.planName || "Make today count."}
        </Text>
        {data?.membership ? (
          <>
            <Badge value={data.membership.status} />
            <Text style={[s.p, { color: "#A4BAD8", marginTop: 15 }]}>
              Valid until {date(data.membership.endsAt)}
            </Text>
          </>
        ) : (
          <Text style={[s.p, { color: "#A4BAD8" }]}>
            Find your plan. Pay the gym directly. Start after verification.
          </Text>
        )}
        <Button
          title={data?.membership ? "View membership" : "Explore memberships"}
          onPress={() => setScreen(data?.membership ? "membership" : "plans")}
        />
      </View>
      <View style={s.panel}>
        <Text style={s.h2}>Your next move.</Text>
        {(
          [
            ["plans", "Membership plans", "card-outline"],
            ["payments", "Payments & receipts", "receipt-outline"],
            ["notifications", "Gym updates", "notifications-outline"],
            ["support", "Talk to your gym", "help-buoy-outline"],
          ] as const
        ).map(([to, label, icon]) => (
          <Pressable
            key={to}
            style={s.featureRow}
            onPress={() => setScreen(to)}
          >
            <View style={s.row}>
              <Ionicons name={icon} size={19} color={C.blue} />
              <Text style={s.small}>{label}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={C.muted} />
          </Pressable>
        ))}
      </View>
      {!!data?.announcements.length && (
        <View style={s.panel}>
          <Text style={s.h2}>From your gym.</Text>
          {data.announcements.map((a) => (
            <View key={a.id} style={s.notification}>
              <Text style={s.notificationTitle}>{a.title}</Text>
              <Text style={s.p}>{a.message}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={s.panel}>
        <Text style={s.h2}>Recent check-ins</Text>
        {data?.attendance.length ? (
          data.attendance.slice(0, 5).map((a) => (
            <View style={s.featureRow} key={a.id}>
              <Text style={s.small}>{time(a.createdAt)}</Text>
              <Ionicons
                name="checkmark-circle-outline"
                color="#56956E"
                size={20}
              />
            </View>
          ))
        ) : (
          <Text style={s.p}>
            Your visits appear after gym staff record your check-in.
          </Text>
        )}
      </View>
    </>
  );
}
function Membership() {
  const { data, user, setScreen } = useGym(),
    m = data?.membership;
  return (
    <>
      <Head
        label="YOUR MEMBER CARD"
        title="My membership"
        text="No automatic charges. Renew when you’re ready."
      />
      <View style={s.memberCard}>
        <View style={[s.row, s.between]}>
          <Text style={[s.eyebrow, { color: "#8DADD6" }]}>MUSCLE DYNAMICS</Text>
          <Badge value={m?.status || "NOT STARTED"} />
        </View>
        <Text style={s.memberTitle}>
          {m?.planName || "Your next chapter awaits."}
        </Text>
        <Text style={[s.p, { color: "#A9BED8" }]}>{user?.name}</Text>
        <View style={[s.rule, { backgroundColor: "#3D5574" }]} />
        <Text style={[s.tiny, { color: "#839FC5" }]}>VALID UNTIL</Text>
        <Text style={[s.small, { color: "white", marginTop: 8 }]}>
          {date(m?.endsAt)}
        </Text>
      </View>
      {m && (
        <View style={s.panel}>
          <Text style={s.h2}>Your plan details</Text>
          <Text style={s.p}>
            Started: {date(m.startsAt)}
            {`\n`}Ends: {date(m.endsAt)}
            {`\n`}Status: {m.status}
            {`\n`}Renewal: manual
          </Text>
        </View>
      )}
      <Button
        title={m ? "Renew or change plan" : "Explore memberships"}
        onPress={() => setScreen("plans")}
      />
      <Button
        title="Payment history"
        outline
        onPress={() => setScreen("payments")}
      />
      <Note text="Active same-plan renewals extend your expiry. Expired plans restart on approval. An active plan change needs owner review. Your gym’s published terms apply." />
    </>
  );
}
function Plans() {
  const { api, setSelectedPlan, setPayment, setScreen } = useGym();
  const [plans, setPlans] = useState<Plan[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    api<Plan[]>("plans")
      .then(setPlans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <Head
        label="INVEST IN YOURSELF"
        title="Find your membership."
        text="Pay the gym directly. Upload a receipt. Start after verification."
      />
      {loading ? (
        <ActivityIndicator color={C.blue} />
      ) : plans.length ? (
        plans.map((p) => (
          <View
            key={p.id}
            style={[s.panel, p.highlight && { borderColor: C.blue }]}
          >
            {p.highlight && <Text style={s.eyebrow}>THE OWNER’S PICK</Text>}
            <Text style={s.h2}>{p.name}</Text>
            <Text style={s.p}>{p.tagline}</Text>
            <Text style={s.price}>{money(p.pricePaise)}</Text>
            <Text style={s.tiny}>/ {p.durationDays} days</Text>
            <View style={s.rule} />
            {p.features.map((f) => (
              <View
                key={f}
                style={[s.row, { alignItems: "flex-start", marginBottom: 15 }]}
              >
                <Ionicons name="checkmark" size={18} color={C.blue} />
                <Text style={[s.small, { fontSize: 12, flex: 1 }]}>{f}</Text>
              </View>
            ))}
            <Button
              title={"Choose " + p.name}
              onPress={() => {
                setSelectedPlan(p);
                setPayment(null);
                setScreen("pay");
              }}
            />
          </View>
        ))
      ) : (
        <Empty
          title="Plans are being prepared."
          text={error || "Contact the gym for membership availability."}
        />
      )}
    </>
  );
}
function Pay() {
  const { api, selectedPlan, payment, setPayment, refresh, setScreen } =
    useGym();
  const [options, setOptions] = useState<{
      accounts: Account[];
      instructions: string;
    } | null>(null),
    [accountId, setAccountId] = useState(""),
    [asset, setAsset] = useState<PreviewAsset | null>(null),
    [note, setNote] = useState(""),
    [paid, setPaid] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api<{ accounts: Account[]; instructions: string }>("payment-options")
      .then((d) => {
        setOptions(d);
        setAccountId(d.accounts[0]?.id || "");
      })
      .catch(message);
  }, []);
  async function create() {
    if (!selectedPlan || !accountId) return;
    setBusy(true);
    try {
      const p = await api<Payment>("payments", "POST", {
        planId: selectedPlan.id,
        accountId,
      });
      setPayment(p);
    } catch (e) {
      message(e);
    } finally {
      setBusy(false);
    }
  }
  async function pick() {
    const source=Image.resolveAssetSource(require('./assets/sample-receipt.png'));
    if(!source){Alert.alert('Sample receipt','Reload the preview to restore its bundled sample image.');return;}
    setAsset({uri:source.uri,width:600,height:800,fileName:'SAMPLE-NOT-A-PAYMENT.png',mimeType:'image/png'});
  }
  async function submit() {
    if (
      !payment ||
      (!asset && !payment.proofId) ||
      note.trim().length < 3 ||
      !paid
    ) {
      Alert.alert(
        "Complete your submission",
        "Use the sample receipt, add sample notes, and tick the preview checkbox. Do not pay anything.",
      );
      return;
    }
    setBusy(true);
    try {
      if (asset) {
        const form = new FormData();
        form.append("file", {
          uri: asset.uri,
          name: asset.fileName || "receipt.jpg",
          type: asset.mimeType || "image/jpeg",
        } as unknown as Blob);
        await api(`payments/${payment.id}/proof`, "POST", form);
      }
      await api(`payments/${payment.id}/submit`, "POST", { proofNote: note });
      await refresh();
      setPayment(null);
      setScreen("payments");
      Alert.alert(
        "Preview receipt saved",
        "Sample pending state only. No receipt was uploaded and no real payment occurred.",
      );
    } catch (e) {
      message(e);
    } finally {
      setBusy(false);
    }
  }
  if (!payment)
    return (
      <>
        <Head
          label="YOUR NEXT CHAPTER"
          title={selectedPlan?.name || "Membership payment"}
          text={
            selectedPlan
              ? money(selectedPlan.pricePaise) +
                " · " +
                selectedPlan.durationDays +
                " days"
              : ""
          }
        />
        <Note
          text={
            options?.instructions || "Loading the gym’s payment instructions…"
          }
        />
        {options?.accounts.map((a) => (
          <Pressable
            key={a.id}
            style={[s.accountOption, accountId === a.id && s.selected]}
            onPress={() => setAccountId(a.id)}
          >
            <Ionicons
              name={accountId === a.id ? "radio-button-on" : "radio-button-off"}
              size={21}
              color={C.blue}
            />
            <Text style={s.small}>{a.label}</Text>
          </Pressable>
        ))}
        {options && !options.accounts.length ? (
          <Empty
            title="Payment details are not ready."
            text="Ask the gym owner to publish a receiving account and instructions."
          />
        ) : (
          <Button
            title="Show receiving details"
            busy={
              busy || !options || !accountId || options.instructions.length < 10
            }
            onPress={create}
          />
        )}
        <Text style={s.p}>
          This is a sample checkout design. Do not transfer money. Nothing
          is submitted to a gym or payment service.
        </Text>
      </>
    );
  const a = payment.accountSnapshot;
  return (
    <>
      <Head
        label={payment.reference}
        title="Submit your receipt."
        text={payment.planName + " · " + money(payment.amountPaise)}
      />
      <View style={s.paymentAccount}>
        <Text style={s.h3}>{a.label}</Text>
        {[
          ["Bank", a.bankName],
          ["Account title", a.accountName],
          ["Account / wallet number", a.accountNumber],
          ["IBAN", a.iban],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <View key={k} style={{ marginBottom: 14 }}>
              <Text style={s.tiny}>{k}</Text>
              <Text selectable style={s.small}>
                {v}
              </Text>
            </View>
          ))}
        {!!a.note && <Text style={s.p}>{a.note}</Text>}
      </View>
      <Note text="Sample receipt preview only. No transfer, upload or verification occurs. Do not enter personal or financial information." />
      {asset && (
        <Image
          source={{ uri: asset.uri }}
          style={s.photo}
          resizeMode="contain"
        />
      )}
      <Button
        title={asset ? "Use sample receipt again" : "Attach sample receipt"}
        outline
        onPress={pick}
      />
      {!!payment.proofId && !asset && (
        <Text style={s.tiny}>
          A receipt is already attached. You can keep it or replace it.
        </Text>
      )}
      <Field
        label="Sample reference / notes — no personal details"
        value={note}
        onChange={setNote}
      />
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: paid }}
        style={s.checkbox}
        onPress={() => setPaid(!paid)}
      >
        <Ionicons
          name={paid ? "checkbox" : "square-outline"}
          size={23}
          color={C.blue}
        />
        <Text style={[s.small, { flex: 1, fontSize: 11 }]}>
          I understand this is sample content. No money was paid and no
          real receipt will be uploaded.
        </Text>
      </Pressable>
      <Button title="Preview pending state" busy={busy} onPress={submit} />
    </>
  );
}
function Payments() {
  const { data, setPayment, setScreen, server, token } = useGym();
  const [view, setView] = useState<string | null>(null);
  return (
    <>
      <Head
        label="PAY DIRECTLY. KEEP A RECORD."
        title="Payments & receipts"
        text="Payment history, private receipts and review decisions."
      />
      {view && (
        <>
          <Image
            source={{
              ...Image.resolveAssetSource(require("./assets/sample-receipt.png")),
            }}
            style={s.photo}
            resizeMode="contain"
          />
          <Button title="Close receipt" outline onPress={() => setView(null)} />
        </>
      )}
      {data?.payments.length ? (
        data.payments.map((p) => (
          <View key={p.id} style={s.panel}>
            <Text style={s.eyebrow}>
              {p.reference} / {date(p.createdAt)}
            </Text>
            <View style={[s.row, s.between]}>
              <Text style={[s.h3, { flex: 1 }]}>{p.planName}</Text>
              <Badge value={p.status} />
            </View>
            <Text style={s.price}>{money(p.amountPaise)}</Text>
            <Text style={s.p}>{p.accountSnapshot.label}</Text>
            {!!p.adminNote && (
              <Note
                text={"Gym note: " + p.adminNote}
                warn={p.status === "REJECTED"}
              />
            )}{" "}
            {p.status === "DRAFT" && (
              <Button
                title="Finish submission"
                onPress={() => {
                  setPayment(p);
                  setScreen("pay");
                }}
              />
            )}
            {!!p.proofId && (
              <Button
                title="View private receipt"
                outline
                onPress={() => setView(p.proofId)}
              />
            )}
            <Button
              title="Share SAMPLE preview record"
              outline
              onPress={() => {
                Share.share({
                  message: `MUSCLE DYNAMICS — OFFLINE SAMPLE RECORD\nSAMPLE ONLY. No payment occurred. Not a tax invoice or bank confirmation.\n\nReference: ${p.reference}\nPlan: ${p.planName}\nAmount: ${money(p.amountPaise)}\nStatus: ${p.status}\nGym note: ${p.adminNote || "—"}`,
                }).catch(message);
              }}
            />
          </View>
        ))
      ) : (
        <Empty
          title="No payments yet."
          text="Choose a membership to see the gym’s payment instructions."
        />
      )}
      <Button title="Explore memberships" onPress={() => setScreen("plans")} />
    </>
  );
}
function Progress() {
  const { data, api, refresh } = useGym();
  const [weight, setWeight] = useState(""),
    [waist, setWaist] = useState(""),
    [workouts, setWorkouts] = useState("1"),
    [calories, setCalories] = useState("0"),
    [notes, setNotes] = useState(""),
    [busy, setBusy] = useState(false);
  const weights = (
      data?.progress.filter((p) => p.weight).slice(0, 10) || []
    ).reverse(),
    max = Math.max(...weights.map((p) => p.weight || 0), 1);
  async function save() {
    setBusy(true);
    try {
      await api("progress", "POST", {
        weight: weight ? Number(weight) : null,
        waist: waist ? Number(waist) : null,
        workouts: Number(workouts),
        calories: Number(calories),
        notes,
      });
      await refresh();
      Alert.alert("Saved", "Progress saved. Keep showing up.");
    } catch (e) {
      message(e);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Head
        label="EVERY LITTLE WIN COUNTS"
        title="Your progress"
        text="Measurements are private to your account. Log what matters to you."
      />
      <View style={s.panel}>
        <Text style={s.h2}>Log your session</Text>
        <Field
          label="Weight · kg (optional)"
          value={weight}
          onChange={setWeight}
          numeric
        />
        <Field
          label="Waist · cm (optional)"
          value={waist}
          onChange={setWaist}
          numeric
        />
        <Field
          label="Workouts completed"
          value={workouts}
          onChange={setWorkouts}
          numeric
        />
        <Field
          label="Calories burned"
          value={calories}
          onChange={setCalories}
          numeric
        />
        <Field
          label="A note to yourself"
          value={notes}
          onChange={setNotes}
          multiline
        />
        <Button title="Save progress" busy={busy} onPress={save} />
      </View>
      <View style={s.panel}>
        <Text style={s.h2}>Your weight journey</Text>
        {weights.length ? (
          <ScrollView horizontal>
            <View style={s.chart}>
              {weights.map((p) => (
                <View key={p.id} style={s.chartCol}>
                  <Text style={s.tiny}>{p.weight}</Text>
                  <View
                    style={[
                      s.chartBar,
                      { height: 30 + ((p.weight || 0) / max) * 95 },
                    ]}
                  />
                  <Text style={s.tiny}>{new Date(p.createdAt).getDate()}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Empty title="Your first entry is your starting line." />
        )}
      </View>
      <Text style={s.h2}>Latest activity</Text>
      {data?.progress.slice(0, 20).map((p) => (
        <View key={p.id} style={s.panel}>
          <Text style={s.h3}>{date(p.createdAt)}</Text>
          <Text style={s.p}>
            {p.workouts} workouts · {p.calories} calories{`\n`}Weight:{" "}
            {p.weight ?? "—"} kg · Waist: {p.waist ?? "—"} cm
            {p.notes ? "\n" + p.notes : ""}
          </Text>
        </View>
      ))}
    </>
  );
}
function Classes() {
  const { api, data, refresh } = useGym();
  const [classes, setClasses] = useState<GymClass[]>([]),
    [busy, setBusy] = useState(""),
    [error, setError] = useState("");
  async function load() {
    setClasses(await api<GymClass[]>("classes"));
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  async function book(c: GymClass, booking?: { id: string }) {
    setBusy(c.id);
    try {
      if (booking) await api("bookings/" + booking.id, "DELETE");
      else await api(`classes/${c.id}/book`, "POST", {});
      await refresh();
      await load();
      Alert.alert(
        booking ? "Sample booking cancelled" : "Sample booking added",
        booking
          ? "The sample booking was removed from this preview."
          : "Preview only. No real class reservation was made.",
      );
    } catch (e) {
      message(e);
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <Head
        label="MAKE TIME FOR YOUR TRAINING"
        title="Class schedule"
        text="Pakistan time. Your membership must cover the class date."
      />
      {classes.length ? (
        classes.map((c) => {
          const booked = data?.bookings.find((b) => b.classId === c.id);
          return (
            <View key={c.id} style={s.panel}>
              <View style={[s.row, s.between]}>
                <Text style={[s.h2, { flex: 1 }]}>{c.title}</Text>
                {booked && <Badge value="CONFIRMED" />}
              </View>
              <Text style={s.p}>
                {time(c.startsAt)}
                {`\n`}With {c.trainer.name}
                {`\n`}
                {c.capacity - c._count.bookings} / {c.capacity} spots available
              </Text>
              <Button
                title={booked ? "Cancel booking" : "Book this class"}
                outline={!!booked}
                busy={
                  busy === c.id || (!booked && c._count.bookings >= c.capacity)
                }
                onPress={() => book(c, booked)}
              />
            </View>
          );
        })
      ) : (
        <Empty
          title="No upcoming classes."
          text={error || "The gym will publish its next sessions here."}
        />
      )}
    </>
  );
}
function Notifications() {
  const { data, api, refresh } = useGym();
  return (
    <>
      <Head
        label="YOUR GYM. YOUR UPDATES."
        title="Stay in the loop."
        text="Payment decisions and support replies appear here."
      />
      <Button
        title="Mark all read"
        outline
        onPress={async () => {
          try {
            await api("notifications/read", "POST", {
              ids: data?.notifications.map((n) => n.id) || [],
            });
            await refresh();
          } catch (e) {
            message(e);
          }
        }}
      />
      <View style={s.panel}>
        {data?.notifications.length ? (
          data.notifications.map((n) => (
            <View
              key={n.id}
              style={[
                s.notification,
                !n.readAt && {
                  borderLeftWidth: 2,
                  borderLeftColor: C.blue,
                  paddingLeft: 13,
                },
              ]}
            >
              <Text style={s.notificationTitle}>{n.title}</Text>
              <Text style={s.p}>{n.message}</Text>
              <Text style={s.tiny}>{time(n.createdAt)}</Text>
            </View>
          ))
        ) : (
          <Empty title="You’re all caught up." />
        )}
      </View>
    </>
  );
}
function Support() {
  const { api, data, refresh, config } = useGym();
  const [subject, setSubject] = useState(""),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <>
      <Head
        label="WE’RE IN YOUR CORNER"
        title="Talk to your gym."
        text={
          config?.phone ||
          config?.email ||
          "Replies arrive here and in your gym updates."
        }
      />
      <View style={s.panel}>
        <Field label="Subject" value={subject} onChange={setSubject} />
        <Field label="Your message" value={text} onChange={setText} multiline />
        <Button
          title="Send message"
          busy={busy}
          onPress={async () => {
            setBusy(true);
            try {
              await api("support", "POST", { subject, message: text });
              await refresh();
              setSubject("");
              setText("");
              Alert.alert(
                "Sample message saved",
                "Preview only. Nothing was sent to a gym or support inbox.",
              );
            } catch (e) {
              message(e);
            } finally {
              setBusy(false);
            }
          }}
        />
      </View>
      <Text style={s.h2}>Your conversations</Text>
      {data?.tickets.length ? (
        data.tickets.map((t) => (
          <View key={t.id} style={s.panel}>
            <View style={[s.row, s.between]}>
              <Text style={[s.h3, { flex: 1 }]}>{t.subject}</Text>
              <Badge value={t.status} />
            </View>
            <Text style={s.p}>{t.message}</Text>
            {!!t.reply && <Note text={"Gym reply: " + t.reply} />}
            <Text style={s.tiny}>{date(t.createdAt)}</Text>
          </View>
        ))
      ) : (
        <Empty title="No conversations yet." />
      )}
    </>
  );
}
function Profile() {
  const { user, setUser, api, logout, server, setScreen } = useGym();
  const [name, setName] = useState(user?.name || ""),
    [phone, setPhone] = useState(user?.phone || ""),
    [current, setCurrent] = useState(""),
    [newPassword, setNewPassword] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <>
      <Head
        label="YOUR MEMBER SPACE"
        title="My profile"
        text="Keep your details up to date."
      />
      <View style={s.panel}>
        <Field label="Full name" value={name} onChange={setName} />
        <Field
          label="Email address"
          value={user?.email || ""}
          editable={false}
        />
        <Field label="Phone number" value={phone} onChange={setPhone} />
        <Button
          title="Save details"
          busy={busy}
          onPress={async () => {
            setBusy(true);
            try {
              const u = await api<NonNullable<typeof user>>(
                "profile",
                "PATCH",
                { name, phone },
              );
              setUser(u);
              Alert.alert("Saved", "Sample profile updated in memory only.");
            } catch (e) {
              message(e);
            } finally {
              setBusy(false);
            }
          }}
        />
      </View>
      <View style={s.panel}>
        <Text style={s.h2}>Change your password</Text>
        <Field
          label="Sample current password — do not use a real password"
          value={current}
          onChange={setCurrent}
          secure
        />
        <Field
          label="Sample new password — changes are disabled"
          value={newPassword}
          onChange={setNewPassword}
          secure
        />
        <Button
          title="Update password"
          busy={busy}
          outline
          onPress={async () => {
            setBusy(true);
            try {
              await api("password", "POST", {
                currentPassword: current,
                newPassword,
              });
              await logout();
              Alert.alert(
                "Password changed",
                "Please log in again on your devices.",
              );
            } catch (e) {
              message(e);
            } finally {
              setBusy(false);
            }
          }}
        />
      </View>
      <Button
        title="Gym updates"
        outline
        onPress={() => setScreen("notifications")}
      />
      <Button
        title="Contact support"
        outline
        onPress={() => setScreen("support")}
      />
      <Button
        title="Membership terms & privacy"
        outline
        onPress={() => Alert.alert("Preview terms", "Sample design only. Real gym terms will be configured with the future backend.")}
      />
      {user?.role !== "MEMBER" && (
        <Button
          title="Open the admin website"
          outline
          onPress={() => Alert.alert("Offline preview", "Admin/backend is not included in this design-only build.")}
        />
      )}
      <Button
        title="Log out"
        outline
        onPress={() => {
          logout().catch(message);
        }}
      />
      <Text style={s.tiny}>
        For data access or account deletion requests, contact the gym through
        Support. The gym’s published privacy policy applies.
      </Text>
    </>
  );
}
const tabs = [
  ["home", "home-outline", "Home"],
  ["membership", "card-outline", "Membership"],
  ["classes", "calendar-outline", "Classes"],
  ["progress", "analytics-outline", "Progress"],
  ["profile", "person-outline", "Profile"],
] as const;
function Main() {
  const { loading, screen, setScreen, user, refresh } = useGym();
  const [showScreens,setShowScreens]=useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && user) refresh().catch(() => {});
    });
    return () => sub.remove();
  }, [user?.id]);
  if (loading)
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={C.blue} size="large" />
      </SafeAreaView>
    );
  const member =
    !!user && !["connect", "welcome", "login", "signup"].includes(screen);
  const content: Record<Screen, React.ReactNode> = {
    connect: <Connect />,
    welcome: <Welcome />,
    login: <Auth key="login" />,
    signup: <Auth key="signup" />,
    home: <Home />,
    membership: <Membership />,
    plans: <Plans />,
    payments: <Payments />,
    pay: <Pay />,
    progress: <Progress />,
    classes: <Classes />,
    notifications: <Notifications />,
    support: <Support />,
    profile: <Profile />,
  };
  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <View style={s.header}>
        <Pressable
          accessibilityLabel="Back to home"
          onPress={() => setScreen(user ? "home" : "welcome")}
        >
          <Logo />
        </Pressable>
        {member ? (
          <Pressable
            accessibilityLabel="Gym updates"
            style={s.avatar}
            onPress={() => setScreen("notifications")}
          >
            <Ionicons name="notifications-outline" size={19} color={C.blue} />
          </Pressable>
        ) : (
          screen !== "connect" && (
            <Pressable onPress={() => setScreen("connect")}>
              <Ionicons name="settings-outline" size={21} color={C.muted} />
            </Pressable>
          )
        )}
      </View>
      <View style={{backgroundColor:'#e9f0ff',paddingHorizontal:16,paddingVertical:8}}>
        <Text style={{fontSize:10,fontWeight:'800',color:'#174394'}}>OFFLINE PREVIEW · SAMPLE DATA · NO REAL PAYMENTS</Text>
        <Pressable accessibilityRole="button" onPress={()=>setShowScreens(!showScreens)}><Text style={{color:'#174394',paddingVertical:5,fontWeight:'700'}}>Browse all screens {showScreens?'−':'+'}</Text></Pressable>
        {showScreens&&<ScrollView horizontal showsHorizontalScrollIndicator={false}>{(['home','welcome','login','signup','membership','plans','payments','progress','classes','notifications','support','profile','connect'] as Screen[]).map(to=><Pressable key={to} onPress={()=>setScreen(to)} style={{padding:9,marginRight:6,borderRadius:8,backgroundColor:to===screen?'#c9dbff':'white'}}><Text style={{fontSize:12,color:'#123764'}}>{to==='connect'?'Reset preview':to}</Text></Pressable>)}</ScrollView>}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          key={screen}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            screen === "welcome" ? { flexGrow: 1 } : s.content
          }
          refreshControl={
            member ? (
              <RefreshControl
                refreshing={refreshing}
                tintColor={C.blue}
                onRefresh={async () => {
                  setRefreshing(true);
                  try {
                    await refresh();
                  } catch (e) {
                    message(e);
                  } finally {
                    setRefreshing(false);
                  }
                }}
              />
            ) : undefined
          }
        >
          {content[screen]}
        </ScrollView>
      </KeyboardAvoidingView>
      {member && (
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "white" }}>
          <View style={s.bottom}>
            {tabs.map(([to, icon, label]) => (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: screen === to }}
                key={to}
                style={s.tab}
                onPress={() => setScreen(to)}
              >
                <Ionicons
                  name={icon}
                  size={22}
                  color={screen === to ? C.blue : "#96A4B6"}
                />
                <Text style={[s.tabText, screen === to && { color: C.blue }]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <GymProvider>
        <Main />
      </GymProvider>
    </SafeAreaProvider>
  );
}
