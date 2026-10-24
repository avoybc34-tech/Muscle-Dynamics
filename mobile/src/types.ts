export type Preferences = {
  push: boolean;
  membership: boolean;
  payments: boolean;
  announcements: boolean;
  workouts: boolean;
  promotions: boolean;
};
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "MEMBER" | "STAFF" | "OWNER";
  avatarId: string | null;
  preferences: Preferences;
};
export type Plan = {
  id: string;
  name: string;
  description: string;
  pricePaise: number;
  durationDays: number;
  benefits: string[];
  active: boolean;
};
export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
};
export type Workout = {
  id: string;
  title: string;
  category: string;
  description: string;
  durationMinutes: number;
  level: string;
  exercises: Exercise[];
};
export type SetRecord = {
  exerciseIndex: number;
  setIndex: number;
  reps: number;
  weight: number;
};
export type Activity = {
  id: string;
  title: string;
  workoutId: string;
  exerciseSnapshot: Exercise[];
  sets: SetRecord[];
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number;
};
export type Membership = {
  id: string;
  planId: string;
  planName: string;
  status: string;
  startsAt: string;
  endsAt: string;
};
export type Account = {
  id: string;
  label: string;
  type: string;
  details: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    instructions: string;
  };
};
export type Payment = {
  id: string;
  reference: string;
  status: string;
  amountPaise: number;
  planSnapshot: Plan;
  accountSnapshot: Account;
  proofId: string | null;
  proofNote: string;
  reviewNote: string;
  createdAt: string;
};
export type Progress = {
  id: string;
  weight: number | null;
  waist: number | null;
  notes: string;
  createdAt: string;
};
export type Notice = {
  id: string;
  title: string;
  message: string;
  category: string;
  route: string;
  readAt: string | null;
  createdAt: string;
};
export type GymClass = {
  id: string;
  title: string;
  trainer: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
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
export type Dashboard = {
  user: User;
  membership: Membership | null;
  payments: Payment[];
  activities: Activity[];
  progress: Progress[];
  notifications: Notice[];
  bookings: { id: string; classId: string; gymClass: GymClass }[];
  tickets: Ticket[];
  announcements: {
    id: string;
    title: string;
    message: string;
    createdAt: string;
  }[];
};
export type Config = {
  gymName: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  privacyText: string;
  termsText: string;
  paymentInstructions: string;
  registrationOpen: boolean;
  ownerExists: boolean;
  mailConfigured: boolean;
};
export type Session = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};
