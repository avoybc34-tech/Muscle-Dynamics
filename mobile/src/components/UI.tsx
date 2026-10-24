import { Text } from "./Typography";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  AccessibilityInfo,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { T } from "../theme";
import { useSession } from "../Session";
export const styles = StyleSheet.create({
  title: { fontSize: 27, fontWeight: "800", letterSpacing: -1, color: T.text },
  subtitle: { fontSize: 14, lineHeight: 22, color: T.muted },
  h2: { fontSize: 20, fontWeight: "700", color: T.text, letterSpacing: -0.4 },
  text: { fontSize: 15, color: T.text, lineHeight: 23 },
  tiny: { fontSize: 12, color: T.muted, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: {
    backgroundColor: T.card,
    borderRadius: 25,
    padding: 19,
    borderWidth: 1,
    borderColor: T.line,
    gap: 12,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "800",
    color: T.accent,
  },
  button: {
    minHeight: 52,
    backgroundColor: T.primary,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 9,
  },
  input: {
    backgroundColor: T.card,
    borderColor: T.line,
    borderWidth: 1,
    borderRadius: 15,
    color: T.text,
    padding: 15,
    minHeight: 52,
    fontSize: 16,
    fontFamily: "Manrope400",
  },
  link: { color: T.blue, fontSize: 14, fontWeight: "700" },
});
export function Screen({
  children,
  title,
  subtitle,
  refresh,
  onRefresh,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  refresh?: boolean;
  onRefresh?: () => void;
}) {
  const insets = useSafeAreaInsets(),
    headerHeight = useHeaderHeight(),
    { demo } = useSession();
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) =>
      Animated.timing(opacity, {
        toValue: 1,
        duration: reduce ? 0 : 180,
        useNativeDriver: true,
      }).start(),
    );
  }, []);
  return (
    <Animated.View
      testID="app-screen"
      style={{ flex: 1, opacity, backgroundColor: T.bg }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 19,
          width: "100%",
          maxWidth: 580,
          alignSelf: "center",
          paddingTop: headerHeight > 0 ? 18 : Math.max(insets.top + 12, 24),
          paddingBottom: headerHeight > 0 ? 32 : 120,
          gap: 16,
        }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!!refresh}
              onRefresh={onRefresh}
              tintColor={T.accent}
            />
          ) : undefined
        }
      >
        {!!demo && (
          <Text style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>
            DEMO · SAMPLE DATA · NO REAL PAYMENTS
          </Text>
        )}
        {!!title && (
          <View style={{ gap: 7 }}>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}
        {children}
      </ScrollView>
    </Animated.View>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}
export function H2({ children }: { children: React.ReactNode }) {
  return (
    <Text accessibilityRole="header" style={styles.h2}>
      {children}
    </Text>
  );
}
export function P({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return <Text style={muted ? styles.subtitle : styles.text}>{children}</Text>;
}
export function Button({
  title,
  onPress,
  busy = false,
  outline = false,
  destructive = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  busy?: boolean;
  outline?: boolean;
  destructive?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outline && { backgroundColor: T.raised },
        destructive && { backgroundColor: "#472b37" },
        (disabled || busy) && { opacity: 0.55 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.985 }] },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={T.text} />
      ) : (
        <Text
          style={{
            fontSize: 15,
            fontWeight: "800",
            color: destructive ? T.danger : T.text,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
export function Input({
  label,
  value,
  onChange,
  secure = false,
  email = false,
  numeric = false,
  multiline = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  secure?: boolean;
  email?: boolean;
  numeric?: boolean;
  multiline?: boolean;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: T.muted, fontSize: 13, fontWeight: "600" }}>
        {label}
      </Text>
      <View>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChange}
          autoCapitalize={email || secure ? "none" : "sentences"}
          autoCorrect={!!!secure && !email}
          secureTextEntry={!!secure && !show}
          textContentType={
            email ? "emailAddress" : secure ? "password" : "none"
          }
          keyboardType={
            email ? "email-address" : numeric ? "decimal-pad" : "default"
          }
          multiline={multiline}
          maxLength={secure ? 128 : multiline ? 5000 : 500}
          style={[
            styles.input,
            secure && { paddingRight: 54 },
            multiline && { height: 120, textAlignVertical: "top" },
            error ? { borderColor: T.danger } : {},
          ]}
        />
        {!!secure && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={show ? "Hide password" : "Show password"}
            onPress={() => setShow(!show)}
            style={{ position: "absolute", right: 0, top: 0, padding: 16 }}
          >
            <Ionicons
              name={show ? "eye-off-outline" : "eye-outline"}
              size={21}
              color={T.muted}
            />
          </Pressable>
        )}
      </View>
      {!!error && (
        <Text style={{ color: T.danger, fontSize: 12 }}>{error}</Text>
      )}
    </View>
  );
}
export function Row({
  icon,
  title,
  subtitle,
  onPress,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 12,
        minHeight: 64,
      }}
    >
      <View
        style={{
          height: 30,
          width: 28,
          borderRadius: 0,
          backgroundColor: "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={21} color={T.accent} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: T.text, fontSize: 13, fontWeight: "700" }}>
          {title}
        </Text>
        {!!subtitle && <Text style={styles.tiny}>{subtitle}</Text>}
      </View>
      {right ||
        (onPress && (
          <Ionicons name="chevron-forward" size={18} color={T.muted} />
        ))}
    </Container>
  );
}
export function Badge({ value }: { value: string }) {
  return (
    <Text
      style={{
        color: ["ACTIVE", "APPROVED", "COMPLETED"].includes(value)
          ? T.accent
          : value === "REJECTED" || value === "EXPIRED"
            ? T.danger
            : T.amber,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1,
      }}
    >
      {value.replaceAll("_", " ")}
    </Text>
  );
}
export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <Ionicons name="barbell-outline" size={32} color={T.muted} />
      <H2>{title}</H2>
      <P muted>{text}</P>
    </Card>
  );
}
export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <Card style={{ borderColor: "#6d3c45" }}>
      <Text
        accessibilityRole="alert"
        style={{ color: T.danger, lineHeight: 22 }}
      >
        {message}
      </Text>
      {!!retry && <Button title="Try again" outline onPress={retry} />}
    </Card>
  );
}
export function Skeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (!reduce) {
        loop = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 650,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 650,
              useNativeDriver: true,
            }),
          ]),
        );
        loop.start();
      }
    });
    return () => loop?.stop();
  }, []);
  return (
    <Animated.View style={{ gap: 18, opacity }}>
      {[100, 160, 110].map((h, i) => (
        <View
          key={i}
          style={{ height: h, borderRadius: 25, backgroundColor: T.raised }}
        />
      ))}
    </Animated.View>
  );
}
export function Toggle({
  title,
  value,
  onChange,
  subtitle,
}: {
  title: string;
  value: boolean;
  onChange: (b: boolean) => void;
  subtitle?: string;
}) {
  return (
    <Row
      icon="options-outline"
      title={title}
      subtitle={subtitle}
      right={
        <Switch
          accessibilityLabel={title}
          value={value}
          onValueChange={onChange}
          trackColor={{ false: T.line, true: "#315b96" }}
          thumbColor={value ? T.accent : T.muted}
        />
      }
    />
  );
}
