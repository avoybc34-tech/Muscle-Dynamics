import type {
  Dashboard,
  Plan,
  Workout,
  Config,
  Payment,
  Account,
  Activity,
} from "./types";
const date = (n: number) => new Date(Date.now() + n * 86400000).toISOString();
export const demoConfig: Config = {
  gymName: "Muscle Dynamics",
  phone: "Preview only",
  email: "preview@example.invalid",
  address: "Sample location",
  hours: "Sample schedule",
  privacyText:
    "This is an isolated demonstration. No real account or payment is created.",
  termsText:
    "All membership prices, people and records in demo mode are illustrative examples only.",
  paymentInstructions: "DEMO ONLY. Do not transfer any money.",
  registrationOpen: true,
  ownerExists: true,
  mailConfigured: false,
};
export const demoPlans: Plan[] = [
  {
    id: "demo-month",
    name: "Sample Monthly",
    description: "Illustrative membership, not a live offer.",
    pricePaise: 500000,
    durationDays: 30,
    benefits: [
      "Sample gym access",
      "Sample group sessions",
      "Sample training plans",
    ],
    active: true,
  },
  {
    id: "demo-quarter",
    name: "Sample Quarterly",
    description: "Example extended membership.",
    pricePaise: 1350000,
    durationDays: 90,
    benefits: ["Sample gym access", "Example progress tracking"],
    active: true,
  },
  {
    id: "demo-year",
    name: "Sample Annual",
    description: "Example annual layout.",
    pricePaise: 4800000,
    durationDays: 365,
    benefits: ["Sample yearly access", "Example coaching support"],
    active: true,
  },
];
export const demoWorkouts: Workout[] = [
  {
    id: "demo-strength",
    title: "Sample Full Body Strength",
    category: "Strength",
    description:
      "A sample routine for reviewing the workout experience. Have a qualified trainer choose a suitable program for you.",
    durationMinutes: 45,
    level: "Beginner",
    exercises: [
      {
        name: "Sample bodyweight squat",
        sets: 3,
        reps: "8–12",
        restSeconds: 60,
        instructions:
          "Illustrative exercise entry. Follow your trainer’s instructions.",
      },
      {
        name: "Sample incline push-up",
        sets: 3,
        reps: "6–10",
        restSeconds: 60,
        instructions: "Illustrative exercise entry.",
      },
    ],
  },
  {
    id: "demo-mobility",
    title: "Sample Daily Mobility",
    category: "Mobility",
    description: "Example movement session.",
    durationMinutes: 20,
    level: "Beginner",
    exercises: [
      {
        name: "Sample shoulder mobility",
        sets: 2,
        reps: "8",
        restSeconds: 30,
        instructions: "Example entry, not medical advice.",
      },
    ],
  },
];
const account: Account = {
  id: "demo-account",
  label: "Sample counter — do not pay",
  type: "CASH",
  details: {
    bankName: "",
    accountName: "SAMPLE",
    accountNumber: "",
    instructions: "No real payment. Demonstration only.",
  },
};
export function createDemo() {
  const state: Dashboard = {
    user: {
      id: "demo-user",
      name: "Preview Member",
      email: "preview@example.invalid",
      phone: "Sample phone",
      role: "MEMBER",
      avatarId: null,
      preferences: {
        push: false,
        membership: true,
        payments: true,
        announcements: true,
        workouts: true,
        promotions: false,
      },
    },
    membership: {
      id: "demo-member",
      planId: demoPlans[0].id,
      planName: demoPlans[0].name,
      status: "ACTIVE",
      startsAt: date(-12),
      endsAt: date(18),
    },
    payments: [
      {
        id: "demo-payment",
        reference: "SAMPLE-NOT-A-PAYMENT",
        status: "APPROVED",
        amountPaise: 500000,
        planSnapshot: demoPlans[0],
        accountSnapshot: account,
        proofId: null,
        proofNote: "No real payment occurred.",
        reviewNote: "Sample state only.",
        createdAt: date(-12),
      },
    ],
    activities: [],
    progress: [
      {
        id: "demo-progress",
        weight: 72,
        waist: 82,
        notes: "Sample measurement",
        createdAt: date(-2),
      },
    ],
    notifications: [
      {
        id: "demo-note",
        title: "Your design preview is ready",
        message: "This is sample content, not a real gym message.",
        category: "announcements",
        route: "Updates",
        readAt: null,
        createdAt: date(-1),
      },
    ],
    bookings: [],
    tickets: [],
    announcements: [
      {
        id: "demo-update",
        title: "Every rep is a fresh start.",
        message: "Sample announcement. Explore the redesigned app.",
        createdAt: date(-1),
      },
    ],
  };
  let serial = 0;
  const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
  async function request<T>(
    path: string,
    method = "GET",
    body?: object | FormData,
  ): Promise<T> {
    const b = (body || {}) as any;
    let out: unknown;
    if (path === "dashboard") out = state;
    else if (path === "config") out = demoConfig;
    else if (path === "workouts") out = demoWorkouts;
    else if (path === "plans") out = demoPlans;
    else if (path === "payment-options")
      out = {
        accounts: [account],
        instructions: demoConfig.paymentInstructions,
        ready: true,
      };
    else if (/^workouts\/.*\/start$/.test(path)) {
      const w = demoWorkouts.find((x) => x.id === path.split("/")[1])!;
      const a: Activity = {
        id: "demo-activity-" + ++serial,
        workoutId: w.id,
        title: w.title,
        exerciseSnapshot: w.exercises,
        sets: [],
        startedAt: date(0),
        completedAt: null,
        durationSeconds: 0,
      };
      state.activities.unshift(a);
      out = a;
    } else if (path.startsWith("activity/")) {
      const a = state.activities.find((x) => x.id === path.split("/")[1]);
      if (!a) throw Error("Sample activity not found");
      a.sets = b.sets || [];
      if (b.complete) {
        a.completedAt = date(0);
        a.durationSeconds = 60;
      }
      out = a;
    } else if (path === "progress") {
      const p = {
        id: "demo-progress-" + ++serial,
        weight: b.weight,
        waist: b.waist,
        notes: b.notes,
        createdAt: date(0),
      };
      state.progress.unshift(p);
      out = p;
    } else if (path === "profile") {
      state.user = { ...state.user, ...b };
      out = state.user;
    } else if (path === "preferences") {
      state.user.preferences = b;
      out = b;
    } else if (path === "support") {
      const t = {
        id: "demo-ticket-" + ++serial,
        subject: b.subject,
        message: b.message,
        reply: "",
        status: "OPEN",
        createdAt: date(0),
      };
      state.tickets.unshift(t);
      out = t;
    } else if (path === "classes")
      out = [
        {
          id: "demo-class",
          title: "Sample Strength Class",
          trainer: "Preview Coach",
          startsAt: date(1),
          endsAt: date(1.05),
          capacity: 12,
          _count: { bookings: 4 },
        },
      ];
    else if (path.endsWith("/book")) {
      const c = (await request<any[]>("classes"))[0];
      state.bookings.push({ id: "demo-booking", classId: c.id, gymClass: c });
      out = { ok: true };
    } else if (path.startsWith("bookings/")) {
      state.bookings = state.bookings.filter(
        (x) => x.id !== path.split("/")[1],
      );
      out = { ok: true };
    } else if (path === "notifications/read") {
      state.notifications.forEach((x) => (x.readAt = date(0)));
      out = { ok: true };
    } else if (path === "sessions") out = [];
    else if (path === "payments" && method === "POST") {
      const plan = demoPlans.find((x) => x.id === b.planId)!;
      const p: Payment = {
        id: "demo-draft-" + ++serial,
        reference: "SAMPLE-DRAFT-" + serial,
        status: "DRAFT",
        amountPaise: plan.pricePaise,
        planSnapshot: plan,
        accountSnapshot: account,
        proofId: null,
        proofNote: "",
        reviewNote: "",
        createdAt: date(0),
      };
      state.payments.unshift(p);
      out = p;
    } else if (/^payments\/.*\/proof$/.test(path)) {
      const p = state.payments.find((x) => x.id === path.split("/")[1])!;
      p.proofId = "demo-proof";
      out = { id: "demo-proof" };
    } else if (/^payments\/.*\/submit$/.test(path)) {
      const p = state.payments.find((x) => x.id === path.split("/")[1])!;
      p.status = "PENDING";
      p.proofNote = b.proofNote;
      out = { ok: true };
    } else
      throw Error(
        "This requires a connected gym account. Demo never performs real account, notification or payment actions.",
      );
    return clone(out) as T;
  }
  return { request };
}
