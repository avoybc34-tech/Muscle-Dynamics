import { weeklyActivity } from "../services/activity";
import React from "react";
import { View, ImageBackground, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Typography";
import { Button } from "./UI";
import { T } from "../theme";
export const trainingImage = require("../../assets/training-floor.jpg");
export function Brand({
  name,
  avatar,
  onPress,
}: {
  name?: string;
  avatar?: any;
  onPress?: () => void;
}) {
  const hour = new Date().getHours(),
    greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: 68,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text
          style={{
            fontSize: 43,
            letterSpacing: -5,
            color: T.text,
            fontWeight: "800",
          }}
        >
          MD
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 18,
            fontWeight: "800",
            color: T.text,
          }}
        >
          MUSCLE{"\n"}DYNAMICS
        </Text>
      </View>
      {name ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onPress}
          style={{ alignItems: "flex-end", gap: 5, flexShrink: 1 }}
        >
          {avatar ? (
            <Image
              source={avatar}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
          ) : (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#293a58",
                borderWidth: 2,
                borderColor: "#3c4c68",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#bad0ff", fontWeight: "700" }}>
                {name[0]}
              </Text>
            </View>
          )}
          <Text numberOfLines={1} style={{ fontSize: 10, color: T.accent }}>
            {greeting}, {name.split(" ")[0]}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
export function TrainingHero({
  title,
  meta,
  action,
  onPress,
  eyebrow = "Today’s training",
}: {
  title: string;
  meta: string;
  action: string;
  onPress: () => void;
  eyebrow?: string;
}) {
  return (
    <ImageBackground
      source={trainingImage}
      imageStyle={{ borderRadius: 27 }}
      style={{
        borderRadius: 27,
        overflow: "hidden",
        height: 232,
        width: "100%",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(6,11,19,0.60)",
        }}
      />
      <View style={{ padding: 24, gap: 10, alignItems: "center" }}>
        <Text style={{ color: T.text, fontSize: 21, fontWeight: "800" }}>
          {eyebrow}
        </Text>
        <Text
          style={{
            color: T.text,
            fontSize: 21,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "#9abfff",
            fontSize: 12,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {meta}
        </Text>
        <View style={{ alignSelf: "stretch", marginTop: 12 }}>
          <Button title={action} onPress={onPress} />
        </View>
      </View>
    </ImageBackground>
  );
}
export function Week({
  activities,
  onPress,
}: {
  activities: { completedAt: string | null }[];
  onPress?: () => void;
}) {
  const { days, completed: completions } = weeklyActivity(activities);
  return (
    <View
      style={{
        backgroundColor: T.raised,
        borderColor: T.line,
        borderWidth: 1,
        borderRadius: 25,
        padding: 19,
        gap: 17,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 19, fontWeight: "800", color: T.text }}>
          This week
        </Text>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: T.accent,
            borderWidth: 2,
            borderColor: "#4e6892",
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {days.map((d, i) => {
          const done = completions.some(
            (a) => new Date(a.completedAt!).toDateString() === d.toDateString(),
          );
          return (
            <View key={i} style={{ alignItems: "center", gap: 6 }}>
              <Text style={{ color: T.text, fontSize: 10 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </Text>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 9,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done ? T.primary : "transparent",
                }}
              >
                {done ? (
                  <Ionicons name="checkmark" size={16} color="white" />
                ) : (
                  <Text style={{ fontSize: 10, color: T.muted }}>
                    {d.getDate()}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
      <Pressable
        accessibilityRole={onPress ? "button" : undefined}
        onPress={onPress}
        disabled={!onPress}
        style={{
          borderTopColor: T.line,
          borderTopWidth: 1,
          paddingTop: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 11, color: T.text, fontWeight: "700" }}>
          {completions.length} session{completions.length === 1 ? "" : "s"}{" "}
          completed
        </Text>
        {onPress ? (
          <Text style={{ fontSize: 10, color: T.accent }}>View activity →</Text>
        ) : null}
      </Pressable>
    </View>
  );
}
