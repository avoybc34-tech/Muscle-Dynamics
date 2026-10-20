import { z } from "zod";
export const idSchema = z.string().uuid();
const str = (n) => z.string().trim().min(1).max(n);
const optional = (n) => z.string().trim().max(n).default("");
export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\+?\d{7,15}$/, "Enter a valid phone number."));
export const passwordSchema = z.string().min(10).max(128);
export const signupSchema = z.object({
  name: str(100),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  acceptTerms: z.literal(true),
});
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});
export const profileSchema = z.object({ name: str(100), phone: phoneSchema });
export const planSchema = z.object({
  name: str(80),
  slug: z.string().regex(/^[a-z0-9-]{2,50}$/),
  tagline: optional(160),
  price: z
    .number()
    .finite()
    .min(1)
    .max(1000000)
    .refine(
      (v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.00001,
      "Use at most two decimal places.",
    ),
  durationDays: z.number().int().min(1).max(730),
  features: z.array(str(150)).min(1).max(20),
  highlight: z.boolean().default(false),
  active: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(1000).default(0),
});
export const accountSchema = z
  .object({
    label: str(80),
    type: z.enum(["BANK", "EASYPAISA", "JAZZCASH", "CASH", "OTHER"]),
    bankName: optional(100),
    accountName: optional(100),
    accountNumber: optional(80),
    iban: optional(80),
    note: optional(500),
    active: z.boolean().default(false),
  })
  .superRefine((v, ctx) => {
    if (
      v.active &&
      v.type !== "CASH" &&
      (!v.accountName || (!v.accountNumber && !v.iban))
    )
      ctx.addIssue({
        code: "custom",
        message:
          "Active transfer accounts need an account title and account number or IBAN.",
      });
    if (v.active && v.type === "CASH" && !v.note)
      ctx.addIssue({
        code: "custom",
        message: "Add cash payment instructions before enabling this method.",
      });
  });
export const settingsSchema = z.object({
  gymName: str(80),
  tagline: optional(160),
  heroTitle: str(100),
  heroSubtitle: optional(350),
  about: optional(3000),
  address: optional(300),
  phone: optional(40),
  email: z.union([emailSchema, z.literal("")]).default(""),
  whatsapp: optional(40),
  hours: optional(300),
  paymentInstructions: optional(1500),
  privacyText: optional(15000),
  termsText: optional(15000),
  nutritionText: optional(6000),
  heroPhotoId: z.union([idSchema, z.literal("")]).default(""),
  gallery: z
    .array(z.object({ id: idSchema, caption: optional(120) }))
    .max(12)
    .default([]),
});
export const trainerSchema = z.object({
  name: str(100),
  specialty: str(100),
  bio: optional(1200),
  photoId: z.union([idSchema, z.literal("")]).default(""),
  active: z.boolean().default(true),
});
export const classSchema = z
  .object({
    title: str(100),
    trainerId: idSchema,
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    capacity: z.number().int().min(1).max(300),
    active: z.boolean().default(true),
  })
  .refine(
    (v) => new Date(v.endsAt) > new Date(v.startsAt),
    "Class end must be after its start.",
  );
export const progressSchema = z
  .object({
    weight: z.number().min(20).max(400).nullable().default(null),
    workouts: z.number().int().min(0).max(10).default(0),
    calories: z.number().int().min(0).max(15000).default(0),
    waist: z.number().min(30).max(250).nullable().default(null),
    notes: optional(500),
  })
  .refine(
    (v) =>
      v.weight !== null ||
      v.workouts > 0 ||
      v.calories > 0 ||
      v.waist !== null ||
      v.notes,
    "Add at least one measurement or training entry.",
  );
export const defaults = {
  gymName: "Muscle Dynamics",
  tagline: "Stronger than yesterday.",
  heroTitle: "Show up.\nGet stronger.",
  heroSubtitle:
    "A place for your training. A simple way to manage your membership. Your next chapter starts here.",
  about: "",
  address: "",
  phone: "",
  email: "",
  whatsapp: "",
  hours: "",
  paymentInstructions: "",
  privacyText: "",
  termsText: "",
  nutritionText: "",
  heroPhotoId: "",
  gallery: [],
};
export function membershipStatus(m, now = new Date()) {
  if (!m) return "NONE";
  if (m.cancelledAt) return "CANCELLED";
  return new Date(m.endsAt) > now ? "ACTIVE" : "EXPIRED";
}
export function periodFor(current, planId, days, now = new Date()) {
  const continues =
    membershipStatus(current, now) === "ACTIVE" && current.planId === planId;
  const base = continues ? new Date(current.endsAt) : new Date(now);
  const end = new Date(base);
  end.setUTCDate(end.getUTCDate() + days);
  return {
    startsAt: continues ? new Date(current.startsAt) : new Date(now),
    periodStartsAt: base,
    endsAt: end,
  };
}
export function karachiDay(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function csvCell(value) {
  const s = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  return '"' + safe.replaceAll('"', '""') + '"';
}
export function reference(n) {
  return "PAY-" + String(n).padStart(4, "0");
}
