import React from "react";
import { Text as NativeText, TextProps, StyleSheet } from "react-native";
export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style),
    weight = Number(flat?.fontWeight || 400);
  const family =
    weight >= 800
      ? "Manrope800"
      : weight >= 700
        ? "Manrope700"
        : weight >= 600
          ? "Manrope600"
          : weight >= 500
            ? "Manrope500"
            : "Manrope400";
  return <NativeText {...props} style={[style, { fontFamily: family }]} />;
}
