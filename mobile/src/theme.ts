export const T = {
  bg: "#080f1b",
  card: "#111f31",
  raised: "#192b42",
  text: "#f2f5fa",
  muted: "#91a2ba",
  line: "#23354c",
  accent: "#69e3c0",
  blue: "#719cff",
  danger: "#ff9c9c",
  amber: "#eec587",
};
export const money = (n: number) =>
  "PKR " +
  (n / 100).toLocaleString("en-PK", { maximumFractionDigits: n % 100 ? 2 : 0 });
export const date = (x: string | null | undefined) =>
  x
    ? new Date(x).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
