import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert, Pressable } from "react-native";
import { Asset } from "expo-asset";
import * as ImagePicker from "expo-image-picker";
import {
  Screen,
  Card,
  H2,
  P,
  Label,
  Button,
  Input,
  Badge,
  ErrorBox,
  Skeleton,
  Empty,
  styles,
} from "../components/UI";
import { useResource } from "./Main";
import { useSession } from "../Session";
import { T, money, date } from "../theme";
import type { Plan, Payment, Account } from "../types";
export function Plans({ navigation: n }: any) {
  const r = useResource<Plan[]>("plans");
  return (
    <Screen
      title="Find your fit."
      subtitle="Owner-published PKR plans. No hidden automatic renewals."
    >
      {r.busy ? (
        <Skeleton />
      ) : r.error ? (
        <ErrorBox message={r.error} retry={r.reload} />
      ) : !r.data?.length ? (
        <Empty
          title="Plans are not published yet"
          text="Ask the gym owner to configure its actual memberships and prices."
        />
      ) : (
        r.data.map((p, i) => (
          <Card key={p.id} style={i === 0 ? { borderColor: "#427668" } : {}}>
            <Label>{p.durationDays} DAYS</Label>
            <H2>{p.name}</H2>
            <Text style={{ color: T.text, fontSize: 34, fontWeight: "800" }}>
              {money(p.pricePaise)}
            </Text>
            <P muted>{p.description}</P>
            {p.benefits.map((b, j) => (
              <P key={j}>✓ {b}</P>
            ))}
            <Button
              title="Choose this plan"
              onPress={() => n.navigate("Checkout", { plan: p })}
            />
          </Card>
        ))
      )}
    </Screen>
  );
}
export function Checkout({ route }: any) {
  const s = useSession(),
    plan = route.params.plan as Plan;
  const r = useResource<{
    accounts: Account[];
    instructions: string;
    ready: boolean;
  }>("payment-options");
  const [accountId, setAccountId] = useState(""),
    [payment, setPayment] = useState<Payment | null>(
      route.params.payment || null,
    ),
    [image, setImage] = useState<string | null>(null),
    [note, setNote] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [submitted, setSubmitted] = useState(false);
  async function pick() {
    if (s.demo) {
      const sample = Asset.fromModule(
        require("../../assets/sample-receipt.png"),
      );
      await sample.downloadAsync();
      setImage(sample.localUri || sample.uri);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
    if (!result.canceled) {
      const f = result.assets[0];
      if ((f.fileSize || 0) > 5 * 1024 * 1024)
        throw Error("Choose an image under 5 MB.");
      setImage(f.uri);
    }
  }
  async function create() {
    setBusy(true);
    setError("");
    try {
      const p = await s.api<Payment>("payments", "POST", {
        planId: plan.id,
        accountId: accountId || r.data?.accounts[0]?.id,
      });
      setPayment(p);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    if (
      !payment ||
      (!image && !payment.proofId) ||
      note.trim().length < 3 ||
      !confirmed
    )
      return setError(
        "Attach a receipt, add transaction details and tick the confirmation.",
      );
    setBusy(true);
    setError("");
    try {
      if (image) {
        if (s.demo)
          await s.api("payments/" + payment.id + "/proof", "POST", {});
        else {
          const body = new FormData();
          body.append("file", {
            uri: image,
            type: "image/jpeg",
            name: "receipt.jpg",
          } as unknown as Blob);
          await s.api("payments/" + payment.id + "/proof", "POST", body);
        }
      }
      await s.api("payments/" + payment.id + "/submit", "POST", {
        proofNote: note.trim(),
      });
      await s.load();
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title={submitted ? "Awaiting verification." : plan.name}
      subtitle={money(plan.pricePaise) + " · " + plan.durationDays + " days"}
    >
      {submitted ? (
        <Card>
          <Badge value="PENDING" />
          <H2>
            {s.demo ? "Sample pending state" : "Receipt received for review"}
          </H2>
          <P muted>
            {s.demo
              ? "No upload or payment occurred."
              : "No membership has been activated by this submission. The owner must independently verify actual funds."}
          </P>
        </Card>
      ) : !payment ? (
        <>
          {r.busy ? (
            <Skeleton />
          ) : r.error ? (
            <ErrorBox message={r.error} retry={r.reload} />
          ) : (
            <>
              <Card>
                <H2>Pay the gym directly.</H2>
                <P muted>
                  {r.data?.instructions ||
                    "The owner must publish payment instructions."}
                </P>
              </Card>
              {r.data?.accounts.map((a) => (
                <Pressable key={a.id} onPress={() => setAccountId(a.id)}>
                  <Card
                    style={{
                      borderColor:
                        (accountId || r.data?.accounts[0]?.id) === a.id
                          ? T.accent
                          : T.line,
                    }}
                  >
                    <Badge value={a.type} />
                    <H2>{a.label}</H2>
                  </Card>
                </Pressable>
              ))}
              <Button
                title="Create payment request"
                disabled={!r.data?.ready || !r.data.accounts.length}
                busy={busy}
                onPress={create}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Card>
            <Label>{payment.reference}</Label>
            <Badge value="DRAFT" />
            <H2>{payment.accountSnapshot.label}</H2>
            {Object.entries(payment.accountSnapshot.details)
              .filter(([, v]) => !!v)
              .map(([k, v]) => (
                <View key={k}>
                  <Text style={styles.tiny}>
                    {k.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </Text>
                  <P>{v}</P>
                </View>
              ))}
          </Card>
          <Card>
            <P muted>
              {s.demo
                ? "SAMPLE ONLY. Do not pay anything. The image button attaches bundled sample artwork."
                : "Transfer outside this app using the gym’s instructions. Never share bank passwords, PINs or OTPs. Receipts are not proof of settled funds."}
            </P>
          </Card>
          {!!image && (
            <Image
              accessibilityLabel="Selected receipt preview"
              source={{ uri: image }}
              resizeMode="contain"
              style={{ height: 230, borderRadius: 16, backgroundColor: T.card }}
            />
          )}
          <Button
            title={
              s.demo
                ? "Attach sample receipt"
                : image
                  ? "Replace receipt"
                  : "Choose receipt image"
            }
            outline
            onPress={() => pick().catch((e) => setError(e.message))}
          />
          <Input
            label={
              s.demo
                ? "Sample transaction notes"
                : "Transfer reference / sender details"
            }
            value={note}
            onChange={setNote}
            multiline
          />
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: confirmed }}
            onPress={() => setConfirmed(!confirmed)}
            style={{ flexDirection: "row", gap: 12, paddingVertical: 12 }}
          >
            <Text style={{ color: T.accent, fontSize: 24 }}>
              {confirmed ? "☑" : "☐"}
            </Text>
            <Text style={{ color: T.muted, lineHeight: 22, flex: 1 }}>
              {s.demo
                ? "I understand this is a sample, not a payment."
                : "I actually paid the gym and this receipt belongs to this transfer."}
            </Text>
          </Pressable>
          <Button
            title={s.demo ? "Preview pending state" : "Submit for owner review"}
            busy={busy}
            onPress={submit}
          />
        </>
      )}
      {!!error && <ErrorBox message={error} />}
    </Screen>
  );
}
export function Payments({ navigation: n }: any) {
  const s = useSession(),
    [proof, setProof] = useState<string | null>(null),
    [items, setItems] = useState<any[]>([]),
    [more, setMore] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    setItems(s.data?.payments || []);
    setMore(!s.demo && (s.data?.payments.length || 0) === 50);
  }, [s.data?.payments]);
  return (
    <Screen
      title="Payments & receipts."
      subtitle="Clear records. Verified decisions."
    >
      {!!proof && (
        <>
          <Image
            source={
              s.demo
                ? require("../../assets/sample-receipt.png")
                : {
                    uri: s.origin + "/v1/files/" + proof,
                    headers: { Authorization: "Bearer " + s.token() },
                  }
            }
            resizeMode="contain"
            style={{ height: 300, backgroundColor: T.card, borderRadius: 20 }}
          />
          <Button
            title="Close receipt"
            outline
            onPress={() => setProof(null)}
          />
        </>
      )}
      {!items.length ? (
        <Empty
          title="No payments yet"
          text="Published plans and the gym’s receiving instructions are needed before payment."
        />
      ) : (
        items.map((p) => (
          <Card key={p.id}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Label>{date(p.createdAt)}</Label>
              <Badge value={p.status} />
            </View>
            <H2>{p.planSnapshot.name}</H2>
            <Text style={{ color: T.text, fontSize: 27, fontWeight: "800" }}>
              {money(p.amountPaise)}
            </Text>
            <P muted>{p.reference}</P>
            {!!p.reviewNote && <P>{p.reviewNote}</P>}
            {!!(p.status === "DRAFT") && (
              <Button
                title="Finish this request"
                outline
                onPress={() =>
                  n.navigate("Checkout", { plan: p.planSnapshot, payment: p })
                }
              />
            )}
            {!!p.proofId && (
              <Button
                title="View private receipt"
                outline
                onPress={() => setProof(p.proofId)}
              />
            )}
          </Card>
        ))
      )}
      {!!error && <ErrorBox message={error} />}
      {more ? (
        <Button
          title="Load older payments"
          outline
          busy={busy}
          onPress={async () => {
            setBusy(true);
            setError("");
            try {
              const next = await s.api<any>(
                "payment-history?cursor=" + items.at(-1).id,
              );
              setItems((old) => [
                ...old,
                ...next.items.filter(
                  (x: any) => !old.some((y) => y.id === x.id),
                ),
              ]);
              setMore(!!next.nextCursor);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
      <Button title="Explore plans" onPress={() => n.navigate("Plans")} />
    </Screen>
  );
}
