export const money = (n: number) =>
  "PKR " +
  (n / 100).toLocaleString("en-PK", { maximumFractionDigits: n % 100 ? 2 : 0 });
export const date = (s?: string | null) =>
  s
    ? new Date(s).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
      })
    : "—";
export const time = (s: string) =>
  new Date(s).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  });
