import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, Pressable } from "react-native";
import {
  Screen,
  Card,
  H2,
  P,
  Button,
  Input,
  Row,
  Badge,
  ErrorBox,
  Toggle,
} from "../components/UI";
import { useSession } from "../Session";
import { money, T } from "../theme";
const sections = [
  "settings",
  "plans",
  "accounts",
  "payments",
  "workouts",
  "classes",
  "announcements",
  "support",
  "members",
  "audit",
];
export function Owner() {
  const s = useSession(),
    [section, setSection] = useState(
      s.user?.role === "STAFF" ? "support" : "settings",
    ),
    [rows, setRows] = useState<any[]>([]),
    [more, setMore] = useState(false),
    [form, setForm] = useState<Record<string, string>>({}),
    [editingId, setEditingId] = useState<string | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [review, setReview] = useState<any>(null),
    [funds, setFunds] = useState(false),
    [note, setNote] = useState(""),
    [ref, setRef] = useState("");
  const selectedSection = useRef(section);
  selectedSection.current = section;
  async function reload() {
    setError("");
    try {
      const r = await s.api<any>("admin/" + section);
      if (selectedSection.current !== section) return;
      if (section === "settings") setForm(r);
      else {
        setRows(r);
        setMore(r.length === 100);
      }
    } catch (e) {
      if (selectedSection.current === section) setError((e as Error).message);
    }
  }
  useEffect(() => {
    setRows([]);
    setMore(false);
    setEditingId(null);
    setForm({});
    setReview(null);
    reload();
  }, [section]);
  const fields: Record<string, string[]> = {
    settings: [
      "gymName",
      "phone",
      "email",
      "address",
      "hours",
      "privacyText",
      "termsText",
      "paymentInstructions",
    ],
    plans: ["name", "description", "pricePKR", "durationDays", "benefits"],
    accounts: [
      "label",
      "type",
      "accountName",
      "accountNumber",
      "bankName",
      "instructions",
    ],
    workouts: [
      "title",
      "category",
      "description",
      "durationMinutes",
      "level",
      "exercises",
    ],
    announcements: ["title", "message"],
    classes: ["title", "trainer", "startsAt", "endsAt", "capacity"],
  };
  function change(k: string, v: string) {
    setForm((x) => ({ ...x, [k]: v }));
  }
  async function save() {
    setBusy(true);
    setError("");
    try {
      let body: any = { ...form };
      if (section === "plans")
        body = {
          name: form.name,
          description: form.description || "",
          pricePaise: Math.round(Number(form.pricePKR) * 100),
          durationDays: Number(form.durationDays),
          benefits: (form.benefits || "").split("\n").filter(Boolean),
          active: form._active !== "false",
        };
      if (section === "accounts")
        body = {
          label: form.label,
          type: form.type?.toUpperCase(),
          active: form._active !== "false",
          details: {
            accountName: form.accountName || "",
            accountNumber: form.accountNumber || "",
            bankName: form.bankName || "",
            instructions: form.instructions || "",
          },
        };
      if (section === "workouts")
        body = {
          title: form.title,
          category: form.category,
          description: form.description || "",
          durationMinutes: Number(form.durationMinutes),
          level: form.level,
          exercises: JSON.parse(form.exercises || "[]").map((x: any) => ({
            ...x,
            sets: Number(x.sets),
            restSeconds: Number(x.restSeconds),
          })),
          active: form._active !== "false",
        };
      if (section === "classes")
        body = { ...form, capacity: Number(form.capacity) };
      await s.api(
        "admin/" + section + (editingId ? "/" + editingId : ""),
        section === "settings" || editingId ? "PUT" : "POST",
        body,
      );
      setEditingId(null);
      if (section !== "settings") setForm({});
      await reload();
      await s.fetchConfig();
      Alert.alert(
        "Saved",
        "Actual gym data was saved. No payment was automatically verified.",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function decide(decision: string) {
    if (!review) return;
    setBusy(true);
    try {
      await s.api("admin/payments/" + review.id + "/review", "POST", {
        decision,
        note,
        actualFundsConfirmed: funds,
        verifiedReference: ref,
      });
      setReview(null);
      setNote("");
      setRef("");
      setFunds(false);
      await reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen
      title={s.user?.role === "STAFF" ? "Staff workspace." : "Owner workspace."}
      subtitle="Actual gym settings and financial decisions. Never approve from a screenshot alone."
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {(s.user?.role === "STAFF" ? ["support", "members"] : sections).map(
          (x) => (
            <Pressable
              key={x}
              onPress={() => setSection(x)}
              style={{
                padding: 11,
                borderRadius: 14,
                backgroundColor: section === x ? T.accent : T.raised,
              }}
            >
              <Text style={{ color: section === x ? T.bg : T.text }}>{x}</Text>
            </Pressable>
          ),
        )}
      </View>
      {!!error && <ErrorBox message={error} retry={reload} />}
      {!!fields[section] && (
        <Card>
          <H2>
            {section === "settings"
              ? "Gym configuration"
              : (editingId ? "Edit " : "Create ") + section.slice(0, -1)}
          </H2>
          {!!(section === "accounts") && (
            <P muted>
              Type: BANK, EASYPAISA, JAZZCASH or CASH. Use only accounts you
              control.
            </P>
          )}
          {!!(section === "classes") && (
            <P muted>
              Use complete future ISO dates, for example
              2026-12-01T10:00:00.000Z. Check timezone before saving.
            </P>
          )}
          {!!(section === "workouts") && (
            <P muted>
              Add real trainer-approved exercises below. Include clear technique
              and rest instructions. No sample routine is published
              automatically.
            </P>
          )}
          {fields[section].map((k) =>
            k === "exercises" ? (
              <ExerciseEditor
                key={k}
                value={form.exercises || "[]"}
                onChange={(v) => change("exercises", v)}
              />
            ) : (
              <Input
                key={k}
                label={k.replace(/([A-Z])/g, " $1")}
                value={form[k] || ""}
                onChange={(v) => change(k, v)}
                multiline={[
                  "description",
                  "benefits",
                  "exercises",
                  "privacyText",
                  "termsText",
                  "paymentInstructions",
                  "instructions",
                ].includes(k)}
                numeric={[
                  "pricePKR",
                  "durationDays",
                  "durationMinutes",
                  "capacity",
                ].includes(k)}
              />
            ),
          )}
          <Button title="Save actual gym data" busy={busy} onPress={save} />
        </Card>
      )}
      {!!(section === "payments") &&
        rows.map((p) => (
          <Card key={p.id}>
            <Badge value={p.status} />
            <H2>{p.user?.name}</H2>
            <P>
              {p.planSnapshot.name} · {money(p.amountPaise)}
            </P>
            <P muted>{p.reference}</P>
            {!!p.proofId && <PrivateProof id={p.proofId} />}
            <P muted>{p.proofNote}</P>
            {!!(p.status === "PENDING") && (
              <Button
                title="Review actual funds"
                outline
                onPress={() => {
                  setReview(p);
                  setFunds(false);
                  setNote("");
                  setRef("");
                }}
              />
            )}
          </Card>
        ))}
      {!!review && (
        <Card>
          <H2>Review {review.reference}</H2>
          <P>
            Open the real receiving account yourself. Match amount/reference and
            prevent duplicate use. A screenshot is not proof of settled funds.
          </P>
          <Input
            label="Unique verified bank/cash reference"
            value={ref}
            onChange={setRef}
          />
          <Input
            label="Review/rejection reason"
            value={note}
            onChange={setNote}
            multiline
          />
          <Toggle
            title="I independently confirmed actual funds"
            value={funds}
            onChange={setFunds}
          />
          <Button
            title="Approve & activate membership"
            busy={busy}
            onPress={() =>
              Alert.alert(
                "Approve real payment?",
                "This activates or changes membership. Confirm only actual settled funds.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Approve", onPress: () => decide("APPROVED") },
                ],
              )
            }
          />
          <Button
            title="Reject with reason"
            outline
            busy={busy}
            onPress={() => decide("REJECTED")}
          />
        </Card>
      )}
      {!!(section === "support") &&
        rows.map((t) => <SupportReply key={t.id} ticket={t} reload={reload} />)}
      {!!!["settings", "payments", "support"].includes(section) &&
        rows.map((x) => (
          <Card key={x.id}>
            <H2>{x.name || x.title || x.label || x.action}</H2>
            <P muted>
              {x.email || x.description || x.targetId || x.type || ""}
            </P>
            {!!x.pricePaise && <P>{money(x.pricePaise)}</P>}
            {["plans", "accounts", "workouts"].includes(section) && (
              <Button
                title="Edit details"
                outline
                onPress={() => {
                  setEditingId(x.id);
                  setForm(
                    Object.fromEntries(
                      Object.entries({
                        ...x,
                        ...x.details,
                        pricePKR: String(x.pricePaise / 100),
                        durationDays: String(x.durationDays),
                        durationMinutes: String(x.durationMinutes),
                        benefits: (x.benefits || []).join("\n"),
                        exercises: JSON.stringify(x.exercises || []),
                        _active: String(x.active),
                      }).map(([k, v]) => [k, String(v ?? "")]),
                    ),
                  );
                }}
              />
            )}
            {section === "members" &&
              s.user?.role === "OWNER" &&
              x.role !== "OWNER" && (
                <>
                  <Button
                    title={
                      x.role === "STAFF"
                        ? "Restrict to member"
                        : "Grant restricted staff access"
                    }
                    outline
                    onPress={async () => {
                      try {
                        await s.api("admin/members/" + x.id, "PATCH", {
                          role: x.role === "STAFF" ? "MEMBER" : "STAFF",
                          active: x.active,
                        });
                        await reload();
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }}
                  />
                  <Button
                    title={x.active ? "Deactivate account" : "Activate account"}
                    outline
                    onPress={async () => {
                      try {
                        await s.api("admin/members/" + x.id, "PATCH", {
                          role: x.role,
                          active: !x.active,
                        });
                        await reload();
                      } catch (e) {
                        setError((e as Error).message);
                      }
                    }}
                  />
                </>
              )}

            {!!(
              typeof x.active === "boolean" &&
              ["plans", "accounts", "workouts"].includes(section)
            ) && (
              <Button
                title={
                  x.active ? "Unpublish / deactivate" : "Publish / activate"
                }
                outline
                onPress={async () => {
                  try {
                    await s.api("admin/" + section + "/" + x.id, "PUT", {
                      ...x,
                      active: !x.active,
                    });
                    await reload();
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              />
            )}
          </Card>
        ))}
      {more ? (
        <Button
          title="Load more records"
          outline
          busy={busy}
          onPress={async () => {
            setBusy(true);
            try {
              const next = await s.api<any[]>(
                "admin/" + section + "?cursor=" + rows.at(-1).id,
              );
              setRows((old) => [
                ...old,
                ...next.filter((x) => !old.some((y) => y.id === x.id)),
              ]);
              setMore(next.length === 100);
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      ) : null}
    </Screen>
  );
}
import { Image } from "react-native";
function PrivateProof({ id }: { id: string }) {
  const s = useSession();
  return (
    <Image
      source={{
        uri: s.origin + "/v1/files/" + id,
        headers: { Authorization: "Bearer " + s.token() },
      }}
      style={{ height: 240, borderRadius: 14 }}
      resizeMode="contain"
    />
  );
}
function SupportReply({ ticket, reload }: { ticket: any; reload: () => void }) {
  const s = useSession(),
    [reply, setReply] = useState(ticket.reply || ""),
    [error, setError] = useState("");
  return (
    <Card>
      <H2>{ticket.subject}</H2>
      <P>{ticket.message}</P>
      <Input label="Reply" value={reply} onChange={setReply} multiline />
      {!!error && <ErrorBox message={error} />}
      <Button
        title="Reply and resolve"
        outline
        onPress={async () => {
          try {
            await s.api("admin/support/" + ticket.id + "/reply", "POST", {
              reply,
              status: "RESOLVED",
            });
            reload();
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      />
    </Card>
  );
}
function ExerciseEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  let items: any[] = [];
  try {
    items = JSON.parse(value);
  } catch {}
  function field(index: number, key: string, text: string) {
    const next = items.map((x, i) => (i === index ? { ...x, [key]: text } : x));
    onChange(JSON.stringify(next));
  }
  return (
    <View style={{ gap: 16 }}>
      {items.map((x, i) => (
        <Card key={i}>
          <H2>Exercise {i + 1}</H2>
          {["name", "sets", "reps", "restSeconds", "instructions"].map((k) => (
            <Input
              key={k}
              label={k === "restSeconds" ? "Rest · seconds" : k}
              value={String(x[k] ?? "")}
              onChange={(v) => field(i, k, v)}
              numeric={["sets", "restSeconds"].includes(k)}
              multiline={k === "instructions"}
            />
          ))}
          <Button
            title="Remove this exercise"
            outline
            onPress={() =>
              onChange(JSON.stringify(items.filter((_, j) => j !== i)))
            }
          />
        </Card>
      ))}
      <Button
        title="Add exercise"
        outline
        disabled={items.length >= 50}
        onPress={() =>
          onChange(
            JSON.stringify([
              ...items,
              {
                name: "",
                sets: "3",
                reps: "8–12",
                restSeconds: "60",
                instructions: "",
              },
            ]),
          )
        }
      />
    </View>
  );
}
