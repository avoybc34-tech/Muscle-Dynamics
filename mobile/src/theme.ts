export const T = {
  bg: "#101827",
  card: "#1b2437",
  raised: "#242c40",
  text: "#f8f7f3",
  muted: "#a1aec4",
  line: "#303b51",
  accent: "#719cff",
  primary: "#1762e8",
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
