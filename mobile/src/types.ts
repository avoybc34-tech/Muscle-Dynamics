export type Screen =
  | "connect"
  | "welcome"
  | "login"
  | "signup"
  | "home"
  | "membership"
  | "plans"
  | "payments"
  | "pay"
  | "progress"
  | "classes"
  | "notifications"
  | "support"
  | "profile";
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "STAFF" | "OWNER";
};
export type Plan = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  pricePaise: number;
  durationDays: number;
  features: string[];
  highlight: boolean;
};
export type Account = {
  id: string;
  label: string;
  type: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  note: string;
};
export type Payment = {
  id: string;
  reference: string;
  planName: string;
  amountPaise: number;
  status: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  accountSnapshot: Account;
  proofId: string | null;
  proofNote: string;
  adminNote: string;
  createdAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
};
export type Membership = {
  planId: string;
  planName: string;
  status: string;
  startsAt: string;
  endsAt: string;
};
export type Progress = {
  id: string;
  weight: number | null;
  waist: number | null;
  workouts: number;
  calories: number;
  notes: string;
  createdAt: string;
};
export type Notification = {
  id: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};
export type GymClass = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  trainer: { name: string };
  _count: { bookings: number };
};
export type Ticket = {
  id: string;
  subject: string;
  message: string;
  reply: string;
  status: string;
  createdAt: string;
};
export type Snapshot = {
  user: User;
  membership: Membership | null;
  payments: Payment[];
  progress: Progress[];
  notifications: Notification[];
  attendance: { id: string; createdAt: string }[];
  bookings: { id: string; classId: string; gymClass: GymClass }[];
  tickets: Ticket[];
  announcements: { id: string; title: string; message: string }[];
};
export type Config = {
  gymName: string;
  registrationOpen: boolean;
  phone: string;
  email: string;
  address: string;
  privacyText: string;
  termsText: string;
  nutritionText: string;
};
