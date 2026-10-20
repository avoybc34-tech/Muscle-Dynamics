import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
export const C = {
  ink: "#14243A",
  navy: "#111A27",
  blue: "#1768EB",
  muted: "#8190A3",
  line: "#DCE4EE",
  bg: "#F3F5F7",
  white: "#FFFFFF",
};
export function Logo() {
  return (
    <View style={s.logo}>
      <Text style={s.mark}>MD</Text>
      <Text style={s.wordmark}>MUSCLE{`\n`}DYNAMICS</Text>
    </View>
  );
}
export function Button({
  title,
  onPress,
  busy = false,
  outline = false,
}: {
  title: string;
  onPress: () => void;
  busy?: boolean;
  outline?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={busy}
      onPress={onPress}
      style={[s.button, outline && s.outline]}
    >
      {busy ? (
        <ActivityIndicator color={outline ? C.blue : "white"} />
      ) : (
        <>
          <Text style={[s.buttonText, outline && { color: C.ink }]}>
            {title}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={outline ? C.blue : "white"}
          />
        </>
      )}
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChange,
  secure = false,
  numeric = false,
  email = false,
  multiline = false,
  editable = true,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  secure?: boolean;
  numeric?: boolean;
  email?: boolean;
  multiline?: boolean;
  editable?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChange}
          style={[
            s.input,
            multiline && { height: 110, textAlignVertical: "top" },
            !editable && { opacity: 0.5 },
          ]}
          secureTextEntry={secure && !show}
          autoCapitalize={email || secure ? "none" : "sentences"}
          keyboardType={
            numeric ? "decimal-pad" : email ? "email-address" : "default"
          }
          multiline={multiline}
          editable={editable}
          maxLength={secure ? 128 : multiline ? 5000 : 500}
        />
        {secure && (
          <Pressable
            accessibilityLabel="Show or hide password"
            style={s.eye}
            onPress={() => setShow(!show)}
          >
            <Ionicons
              name={show ? "eye-off-outline" : "eye-outline"}
              size={19}
              color={C.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
export function Head({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <View style={s.head}>
      <Text style={s.eyebrow}>{label}</Text>
      <Text style={s.h1}>{title}</Text>
      {text && <Text style={s.p}>{text}</Text>}
    </View>
  );
}
export function Note({ text, warn = false }: { text: string; warn?: boolean }) {
  return (
    <View
      style={[
        s.note,
        warn && { backgroundColor: "#FCF5E6", borderColor: "#E8DBBA" },
      ]}
    >
      <Ionicons
        name="information-circle-outline"
        size={19}
        color={warn ? "#9A7D39" : "#6486B1"}
      />
      <Text style={[s.noteText, warn && { color: "#8B7440" }]}>{text}</Text>
    </View>
  );
}
export function Badge({ value }: { value: string }) {
  const green = ["ACTIVE", "APPROVED", "CONFIRMED"].includes(value),
    red = ["REJECTED", "EXPIRED", "CANCELLED"].includes(value);
  return (
    <Text
      style={[
        s.badge,
        {
          backgroundColor: green ? "#E8F4EC" : red ? "#F8E8E7" : "#F8F0DD",
          color: green ? "#36754E" : red ? "#A2554C" : "#917133",
        },
      ]}
    >
      {value.replaceAll("_", " ")}
    </Text>
  );
}
export function Empty({ title, text }: { title: string; text?: string }) {
  return (
    <View style={s.empty}>
      <Ionicons name="barbell-outline" size={36} color="#95A6BC" />
      <Text style={s.emptyTitle}>{title}</Text>
      {text && <Text style={s.p}>{text}</Text>}
    </View>
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  logo: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    fontSize: 35,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: -5,
    color: C.blue,
    paddingRight: 5,
  },
  wordmark: {
    fontSize: 8,
    letterSpacing: 1.5,
    lineHeight: 13,
    fontWeight: "800",
    color: C.ink,
  },
  header: {
    height: 67,
    paddingHorizontal: 23,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    height: 33,
    width: 33,
    borderRadius: 30,
    backgroundColor: "#E6EDF8",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 10, fontWeight: "700", color: "#447DC6" },
  content: {
    padding: 23,
    paddingBottom: 35,
    maxWidth: 700,
    alignSelf: "center",
    width: "100%",
  },
  head: { marginTop: 14, marginBottom: 24 },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: C.blue,
    marginBottom: 15,
  },
  h1: {
    fontSize: 35,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -1.1,
    color: C.ink,
    marginBottom: 13,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.4,
    color: C.ink,
    marginBottom: 16,
  },
  h3: { fontSize: 17, fontWeight: "600", color: C.ink, marginBottom: 10 },
  p: { fontSize: 12, lineHeight: 22, color: C.muted, marginBottom: 15 },
  small: { fontSize: 12, lineHeight: 21, color: C.ink },
  tiny: { fontSize: 9, lineHeight: 17, color: C.muted },
  button: {
    minHeight: 52,
    paddingVertical: 16,
    paddingHorizontal: 19,
    borderRadius: 4,
    backgroundColor: C.blue,
    borderWidth: 1,
    borderColor: C.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 12,
  },
  outline: { borderColor: "#CCD7E6", backgroundColor: "transparent" },
  buttonText: { fontSize: 12, color: "white", fontWeight: "600" },
  field: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: "600", color: "#63768F", marginBottom: 9 },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 4,
    padding: 14,
    backgroundColor: "white",
    fontSize: 14,
    color: C.ink,
    minHeight: 49,
  },
  eye: { position: "absolute", right: 13, top: 15 },
  note: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#D2DEEE",
    backgroundColor: "#EAF0F8",
    borderRadius: 4,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 22,
  },
  noteText: { fontSize: 11, lineHeight: 19, color: "#647C9B", flex: 1 },
  panel: {
    padding: 24,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 6,
    marginBottom: 22,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  between: { justifyContent: "space-between" },
  badge: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
    overflow: "hidden",
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
  empty: { alignItems: "center", paddingVertical: 35, paddingHorizontal: 13 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.3,
    color: "#657A94",
    marginTop: 17,
    marginBottom: 12,
    textAlign: "center",
  },
  link: { fontSize: 11, color: C.blue, paddingVertical: 13 },
  rule: { height: 1, backgroundColor: C.line, marginVertical: 20 },
  price: {
    fontSize: 33,
    fontWeight: "700",
    letterSpacing: -1,
    color: C.ink,
    marginBottom: 8,
  },
  memberCard: {
    padding: 27,
    backgroundColor: "#152D4C",
    borderRadius: 7,
    marginBottom: 25,
  },
  memberTitle: {
    fontSize: 32,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.8,
    marginVertical: 22,
  },
  stats: { flexDirection: "row", gap: 12, marginBottom: 24 },
  stat: {
    flex: 1,
    padding: 18,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 5,
  },
  statValue: {
    fontSize: 26,
    letterSpacing: -0.8,
    fontWeight: "600",
    color: C.ink,
    marginTop: 18,
    marginBottom: 7,
  },
  statLabel: { fontSize: 9, color: C.muted },
  featureRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginBottom: 22,
  },
  bottom: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingTop: 13,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: C.line,
  },
  tab: { flex: 1, alignItems: "center", gap: 5 },
  tabText: { fontSize: 8, color: "#96A4B6" },
  welcome: { flex: 1, backgroundColor: C.navy, padding: 28 },
  welcomeTitle: {
    fontSize: 64,
    fontWeight: "800",
    letterSpacing: -2,
    color: "white",
    lineHeight: 68,
    marginBottom: 25,
  },
  welcomeEyebrow: {
    fontSize: 8,
    letterSpacing: 1.8,
    color: "#93ACCF",
    marginBottom: 23,
  },
  welcomeLine: { height: 1, backgroundColor: "#33445B", marginVertical: 30 },
  paymentAccount: {
    backgroundColor: "#ECF1F7",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  selected: { borderColor: C.blue, backgroundColor: "#ECF2FD" },
  accountOption: {
    padding: 18,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  photo: {
    width: "100%",
    height: 260,
    borderRadius: 4,
    marginBottom: 20,
    backgroundColor: "#E6ECF4",
  },
  notification: {
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingVertical: 16,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: C.ink,
    marginBottom: 8,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 175,
    gap: 18,
    paddingBottom: 15,
  },
  chartCol: { minWidth: 35, alignItems: "center", gap: 9 },
  chartBar: { width: 28, backgroundColor: "#99BDF3", borderRadius: 3 },
});
