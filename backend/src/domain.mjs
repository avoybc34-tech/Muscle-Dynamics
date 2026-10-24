import { z } from "zod";
export const preferences = {
  push: true,
  membership: true,
  payments: true,
  announcements: true,
  workouts: true,
  promotions: false,
};
export const userInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .email()
    .max(191)
    .transform((x) => x.toLowerCase().trim()),
  phone: z.string().trim().min(6).max(32),
  password: z.string().min(10).max(128),
});
export const planInput = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().max(3000),
  pricePaise: z.number().int().positive().max(100000000),
  durationDays: z.number().int().min(1).max(730),
  benefits: z.array(z.string().min(1).max(200)).max(30),
  active: z.boolean().default(true),
});
export const exercises = z
  .array(
    z.object({
      name: z.string().trim().min(2).max(100),
      sets: z.number().int().min(1).max(20),
      reps: z.string().min(1).max(30),
      restSeconds: z.number().int().min(0).max(600),
      instructions: z.string().max(3000),
    }),
  )
  .min(1)
  .max(50);
export const workoutInput = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(4000),
  category: z.string().min(2).max(60),
  durationMinutes: z.number().int().min(1).max(300),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  exercises,
  active: z.boolean().default(true),
});
export const blankSettings = {
  gymName: "Muscle Dynamics",
  phone: "",
  email: "",
  address: "",
  hours: "",
  privacyText: "",
  termsText: "",
  paymentInstructions: "",
};
export function registrationReady(s) {
  return Boolean(
    s.phone &&
      s.email &&
      s.address &&
      s.privacyText?.length >= 50 &&
      s.termsText?.length >= 50,
  );
}
export function membershipView(m, now = new Date()) {
  if (!m?.startsAt || !m?.endsAt) return null;
  return {
    ...m,
    status:
      m.status === "ACTIVE" && new Date(m.endsAt) <= now ? "EXPIRED" : m.status,
  };
}
export function renewalPeriod(existing, plan, now = new Date()) {
  const extend =
    existing?.status === "ACTIVE" &&
    existing.planId === plan.id &&
    new Date(existing.endsAt) > now;
  return {
    startsAt: extend ? new Date(existing.startsAt) : now,
    endsAt: new Date(
      (extend ? new Date(existing.endsAt) : now).getTime() +
        plan.durationDays * 86400000,
    ),
  };
}
export function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    avatarId: u.avatarId,
    preferences: u.preferences,
  };
}
export function preferenceAllows(p, category) {
  return p?.push !== false && p?.[category] !== false;
}
