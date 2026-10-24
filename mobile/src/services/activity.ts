export function weeklyActivity(
  activities: { completedAt: string | null }[],
  now = new Date(),
) {
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );
  const days = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i),
  );
  const completed = activities.filter(
    (a) =>
      a.completedAt &&
      new Date(a.completedAt) >= monday &&
      new Date(a.completedAt) <= now,
  );
  return { days, completed };
}
