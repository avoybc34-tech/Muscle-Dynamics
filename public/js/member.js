import {
  $,
  $$,
  h,
  money,
  date,
  time,
  icon,
  empty,
  api,
  toast,
  bindForm,
  showDialog,
  badge,
} from "./common.js";
import {
  authShell,
  passwordField,
  passwordToggles,
  shell,
  heading,
  stat,
  logout,
} from "./shells.js";
let user = null,
  config = null,
  dashboard = null,
  version = 0;
const items = [
  ["overview", "Overview", "home"],
  ["membership", "My membership", "card"],
  ["plans", "Membership plans", "weight"],
  ["payments", "Payments & receipts", "file"],
  ["classes", "Class schedule", "calendar"],
  ["progress", "My progress", "activity"],
  ["notifications", "Gym updates", "bell"],
  ["support", "Support", "support"],
  ["profile", "My profile", "user"],
];
const route = () => location.hash.slice(1) || "overview";
async function start() {
  try {
    config = await api("config");
    try {
      user = await api("me");
    } catch (e) {
      if (e.status !== 401) throw e;
    }
    await render();
  } catch (e) {
    $("#app").innerHTML = empty("We couldn’t connect.", e.message);
  }
}
async function renderAuth() {
  let mode = route();
  if (!["signup", "login", "recovery"].includes(mode)) mode = "login";
  if (mode === "recovery") {
    authShell({
      title: "Let’s get you back.",
      subtitle:
        "Contact the gym owner to verify your identity and reset your password securely.",
      body: `<div class="note">${h(config.phone || config.email || "The gym will publish its contact details shortly.")}<br>${h(config.email)}</div><a class="button button-full" href="#login">Back to login ${icon("arrow", 16)}</a>`,
      links: '<a href="/index.html">Back to website</a>',
    });
    return;
  }
  const signup = mode === "signup";
  authShell({
    title: signup ? "Make this your day one." : "Good to have you back.",
    subtitle: signup
      ? "Create your member account. Choose a plan when you’re ready."
      : "Log in to manage your membership and keep moving forward.",
    body: `${signup && !config.registrationOpen ? '<div class="note warn">The gym is preparing its registration details. Please check back or contact the owner.</div>' : ""}<form id="auth-form">${signup ? '<label>Full name<input name="name" required maxlength="100" autocomplete="name"></label><label>Phone number<input name="phone" type="tel" required maxlength="25" autocomplete="tel"></label>' : ""}<label>Email address<input name="email" type="email" required autocomplete="email"></label>${passwordField("Password", "password", signup ? 10 : 1)}${signup ? '<label class="checkbox"><input name="acceptTerms" type="checkbox" required><span>I agree to the <a href="/legal.html#terms" target="_blank">membership terms</a> and <a href="/legal.html#privacy" target="_blank">privacy notice</a>.</span></label>' : ""}<button type="submit" class="button button-full" ${signup && !config.registrationOpen ? "disabled" : ""}>${signup ? "Create account" : "Log in"} ${icon("arrow", 17)}</button><p class="form-error" role="alert"></p></form>`,
    links: signup
      ? '<span>Already a member? <a href="#login">Log in</a></span><a href="/index.html">Back to website</a>'
      : '<a href="#signup">Create an account</a><a href="#recovery">Forgot your password?</a>',
  });
  bindForm($("#auth-form"), async (b) => {
    const result = await api("auth/" + (signup ? "register" : "login"), {
      method: "POST",
      body: { ...b, ...(signup ? { acceptTerms: true } : {}) },
    });
    user = result.user;
    if (!signup && user.role !== "MEMBER") {
      location.href = "/admin.html";
      return;
    }
    location.hash = signup ? "plans" : "overview";
  });
}
async function render() {
  const currentVersion = ++version;
  if (!user) {
    await renderAuth();
    return;
  }
  const r = route();
  if (["login", "signup", "recovery"].includes(r)) {
    location.hash = "overview";
    return;
  }
  shell({ user, items, current: r, onLogout: logout });
  $("#content").innerHTML =
    '<div class="loading-block">Loading your gym information…</div>';
  try {
    dashboard = await api("dashboard");
    user = dashboard.user;
    if (currentVersion !== version) return;
    const target = $("#content");
    const d = dashboard,
      m = d.membership;
    if (r === "overview") {
      target.innerHTML =
        heading(
          "STRONGER THAN YESTERDAY",
          `Let’s go, ${user.name.split(" ")[0]}.`,
          "Your training. Your routine. Your next stronger chapter.",
        ) +
        `<div class="stat-grid">${stat("Membership", m?.status || "NOT STARTED", "card", m ? m.planName : "Find your plan")}${stat("Gym visits", d.attendance.length, "calendar", "Recent recorded check-ins")}${stat(
          "Workouts logged",
          d.progress.reduce((n, p) => n + p.workouts, 0),
          "activity",
          "Across your latest 100 logs",
        )}${stat("Latest weight", d.progress.find((p) => p.weight)?.weight ? d.progress.find((p) => p.weight).weight + " kg" : "—", "chart", "Your latest recorded measurement")}</div><div class="grid-2"><section class="panel"><div class="section-title"><h3>Your next session starts here.</h3><a href="#classes" class="inline-link">Class schedule ↗</a></div>${
          d.bookings.length
            ? d.bookings
                .slice(0, 3)
                .map(
                  (b) =>
                    `<div class="notification"><h4>${h(b.gymClass.title)}</h4><p>${time(b.gymClass.startsAt)} · ${h(b.gymClass.trainer.name)}</p></div>`,
                )
                .join("")
            : empty(
                "A little structure goes a long way.",
                "Book a class or make time for your next gym session.",
              )
        }</section><section class="panel"><div class="section-title"><h3>From your gym.</h3><a href="#notifications" class="inline-link">All updates ↗</a></div>${
          d.announcements.length
            ? d.announcements
                .slice(0, 3)
                .map(
                  (a) =>
                    `<div class="notification"><h4>${h(a.title)}</h4><p>${h(a.message)}</p><small>${date(a.createdAt)}</small></div>`,
                )
                .join("")
            : empty(
                "Your gym updates live here.",
                "Announcements will appear as soon as the gym publishes them.",
              )
        }</section></div><div class="app-banner"><h3>Keep showing up for yourself.</h3><p>Save your progress after training. Every little win is worth recording.</p><a class="button button-small mt" href="#progress">Log your progress ${icon("arrow", 15)}</a></div>`;
    } else if (r === "membership") {
      target.innerHTML =
        heading(
          "YOUR COMMITMENT. YOUR POSSIBILITIES.",
          "My membership",
          "Your membership becomes active only after the gym verifies your payment.",
        ) +
        `<section class="membership-card"><div class="row between"><span class="eyebrow">MUSCLE DYNAMICS / MEMBER CARD</span>${badge(m?.status || "NOT STARTED")}</div><h2>${h(m?.planName || "Your next chapter awaits.")}</h2><p>${m ? "Make time for your training. Your gym is in your corner." : "Find a plan, pay the gym directly, and upload your receipt for verification."}</p><div class="membership-meta"><div><span>MEMBER</span><strong>${h(user.name)}</strong></div><div><span>VALID UNTIL</span><strong>${date(m?.endsAt)}</strong></div><div><span>RENEWAL</span><strong>Manual · no automatic charges</strong></div></div></section><a href="#plans" class="button">${m ? "Renew or change plan" : "Explore memberships"} ${icon("up", 16)}</a><a class="button button-outline" style="margin-left:10px" href="#payments">Payment history ${icon("file", 16)}</a>${m ? `<section class="panel mt"><h3>Membership details</h3><div class="payment-details"><div><small>Started</small>${date(m.startsAt)}</div><div><small>Ends</small>${date(m.endsAt)}</div><div><small>Plan</small>${h(m.planName)}</div><div><small>Status</small>${badge(m.status)}</div></div><p>Same-plan renewals extend your existing active expiry. Expired memberships restart when the gym approves the next payment. Changing an active plan requires owner review.</p></section>` : ""}`;
    } else if (r === "plans") {
      const plans = await api("plans");
      if (currentVersion !== version) return;
      target.innerHTML =
        heading(
          "INVEST IN YOURSELF",
          "Find your membership.",
          "Pay directly to the gym. Upload the receipt. Start after verification.",
        ) +
        `<div class="plans-grid">${plans.length ? plans.map((p) => `<article class="plan-card ${p.highlight ? "highlight" : ""}">${p.highlight ? '<span class="plan-highlight">THE OWNER’S PICK</span>' : ""}<h3>${h(p.name)}</h3><p>${h(p.tagline)}</p><div class="plan-price">${money(p.pricePaise)}<small>/ ${p.durationDays} days</small></div><ul>${p.features.map((f) => `<li>${icon("check", 16)}${h(f)}</li>`).join("")}</ul><button class="button button-full" data-buy="${p.id}">Choose ${h(p.name)} ${icon("up", 16)}</button></article>`).join("") : empty("Memberships are being prepared.", "Contact the gym for availability.")}</div>`;
      $$("[data-buy]").forEach(
        (b) =>
          (b.onclick = () =>
            purchase(plans.find((p) => p.id === b.dataset.buy))),
      );
    } else if (r === "payments") {
      target.innerHTML =
        heading(
          "PAY DIRECTLY. KEEP A RECORD.",
          "Payments & receipts",
          "A screenshot is not payment confirmation. The gym verifies the actual receiving account.",
          `<a class="button button-small" href="#plans">New payment ${icon("plus", 15)}</a>`,
        ) +
        `<div class="payment-list">${d.payments.length ? d.payments.map((p) => `<article class="payment-item"><div class="reference">${h(p.reference)} / ${date(p.createdAt)}</div><div class="row between"><h3>${h(p.planName)}</h3>${badge(p.status)}</div><div class="row between mt"><span class="price-small">${money(p.amountPaise)}</span><span class="tiny muted">${h(p.accountSnapshot.label)}</span></div>${p.adminNote ? `<div class="note ${p.status === "REJECTED" ? "warn" : "success"} mt">Gym note: ${h(p.adminNote)}</div>` : ""}<div class="dialog-actions">${p.status === "DRAFT" ? `<button class="button button-quiet" data-resume="${p.id}">Finish submission ${icon("up", 14)}</button>` : ""}${p.proofId ? `<a class="button button-quiet" href="/api/files/${p.proofId}" target="_blank" rel="noopener">View receipt ${icon("file", 14)}</a>` : ""}<button class="button button-quiet" data-reference="${p.id}">Download record ${icon("file", 14)}</button></div></article>`).join("") : empty("No payments yet.", "Your payment submissions and their review status will appear here.")}</div>`;
      $$("[data-resume]").forEach(
        (b) =>
          (b.onclick = () =>
            receiptDialog(d.payments.find((p) => p.id === b.dataset.resume))),
      );
      $$("[data-reference]").forEach(
        (b) =>
          (b.onclick = () =>
            downloadRecord(
              d.payments.find((p) => p.id === b.dataset.reference),
            )),
      );
    } else if (r === "classes") {
      const classes = await api("classes");
      if (currentVersion !== version) return;
      target.innerHTML =
        heading(
          "MAKE TIME FOR YOUR TRAINING.",
          "Class schedule",
          "Times are shown in Pakistan time. An active membership covering the class date is required.",
        ) +
        `<div class="payment-list">${
          classes.length
            ? classes
                .map((c) => {
                  const booked = d.bookings.find((b) => b.classId === c.id);
                  return `<article class="payment-item"><div class="row between"><h3>${h(c.title)}</h3>${badge(booked ? "CONFIRMED" : c.capacity - c._count.bookings > 0 ? "OPEN" : "FULL")}</div><p>${time(c.startsAt)} – ${new Date(c.endsAt).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Karachi" })}</p><p>${h(c.trainer.name)} · ${c.capacity - c._count.bookings} / ${c.capacity} spots available</p>${booked ? `<button class="button button-quiet" data-cancel="${booked.id}">Cancel booking</button>` : `<button class="button button-small" data-book="${c.id}" ${c.capacity - c._count.bookings < 1 ? "disabled" : ""}>Book this class ${icon("plus", 14)}</button>`}</article>`;
                })
                .join("")
            : empty(
                "No upcoming classes right now.",
                "The gym will publish its next sessions here.",
              )
        }</div>`;
      $$("[data-book]").forEach(
        (b) =>
          (b.onclick = () =>
            buttonAction(b, async () => {
              await api(`classes/${b.dataset.book}/book`, {
                method: "POST",
                body: {},
              });
              toast("Your spot is booked.");
              await render();
            })),
      );
      $$("[data-cancel]").forEach(
        (b) =>
          (b.onclick = () =>
            buttonAction(b, async () => {
              await api("bookings/" + b.dataset.cancel, { method: "DELETE" });
              toast("Booking cancelled.");
              await render();
            })),
      );
    } else if (r === "progress") {
      const weights = d.progress
          .filter((p) => p.weight)
          .slice(0, 10)
          .reverse(),
        max = Math.max(...weights.map((p) => p.weight), 1);
      target.innerHTML =
        heading(
          "EVERY LITTLE WIN COUNTS.",
          "Your progress",
          "Measurements are private to your account. Add only what you want to track.",
        ) +
        `<div class="grid-2"><form id="progress-form" class="panel"><h3>Log today’s progress</h3><div class="field-row"><label>Weight · kg<input name="weight" type="number" min="20" max="400" step="0.1"></label><label>Waist · cm<input name="waist" type="number" min="30" max="250" step="0.1"></label></div><div class="field-row mt"><label>Workouts completed<input name="workouts" type="number" min="0" max="10" value="1"></label><label>Calories burned<input name="calories" type="number" min="0" max="15000" value="0"></label></div><label class="mt">A note to yourself<textarea name="notes" maxlength="500" rows="3"></textarea></label><button type="submit" class="button">Save progress ${icon("plus", 16)}</button><p class="form-error" role="alert"></p></form><section class="panel"><h3>Your weight journey</h3>${weights.length ? `<div class="progress-chart">${weights.map((p) => `<div><strong>${p.weight}</strong><i style="height:${30 + (p.weight / max) * 100}px"></i><small>${date(p.createdAt)}</small></div>`).join("")}</div><p class="tiny mt">Latest ten weight entries · kg</p>` : empty("Your first entry is your starting line.")}</section></div><section class="panel table-panel"><div class="section-title"><h3>Training history</h3></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Workouts</th><th>Weight</th><th>Waist</th><th>Calories</th><th>Notes</th></tr></thead><tbody>${d.progress.map((p) => `<tr><td>${date(p.createdAt)}</td><td>${p.workouts}</td><td>${p.weight ?? "—"}</td><td>${p.waist ?? "—"}</td><td>${p.calories}</td><td>${h(p.notes)}</td></tr>`).join("")}</tbody></table></div></section>`;
      bindForm($("#progress-form"), async (b) => {
        await api("progress", {
          method: "POST",
          body: {
            weight: b.weight ? Number(b.weight) : null,
            waist: b.waist ? Number(b.waist) : null,
            workouts: Number(b.workouts),
            calories: Number(b.calories),
            notes: b.notes,
          },
        });
        toast("Progress saved. Keep showing up.");
        await render();
      });
    } else if (r === "notifications") {
      target.innerHTML =
        heading(
          "YOUR GYM. YOUR UPDATES.",
          "Stay in the loop.",
          "Payment decisions and support replies appear here.",
          `<button class="button button-quiet" id="mark-read">Mark all read</button>`,
        ) +
        `<section class="panel">${d.notifications.length ? d.notifications.map((n) => `<article class="notification ${!n.readAt ? "unread" : ""}"><h4>${h(n.title)}</h4><p>${h(n.message)}</p><small>${time(n.createdAt)}</small></article>`).join("") : empty("You’re all caught up.", "Your gym notifications will appear here.")}</section>`;
      $("#mark-read").onclick = () =>
        buttonAction($("#mark-read"), async () => {
          await api("notifications/read", {
            method: "POST",
            body: { ids: d.notifications.map((n) => n.id) },
          });
          await render();
        });
    } else if (r === "support") {
      target.innerHTML =
        heading(
          "WE’RE IN YOUR CORNER.",
          "Talk to your gym.",
          "Send a question. The gym’s reply will appear here and in your notifications.",
        ) +
        `<div class="grid-2"><form id="support-form" class="panel"><h3>Start a conversation</h3><label>Subject<input name="subject" required minlength="3" maxlength="150"></label><label>Your message<textarea name="message" required minlength="5" maxlength="5000"></textarea></label><button class="button" type="submit">Send message ${icon("arrow", 16)}</button><p class="form-error" role="alert"></p></form><section class="panel"><h3>Your conversations</h3>${d.tickets.length ? d.tickets.map((t) => `<article class="notification"><div class="row between"><h4>${h(t.subject)}</h4>${badge(t.status)}</div><p>${h(t.message)}</p>${t.reply ? `<div class="note mt">Gym reply: ${h(t.reply)}</div>` : ""}<small>${date(t.createdAt)}</small></article>`).join("") : empty("No conversations yet.")}</section></div>`;
      bindForm($("#support-form"), async (b) => {
        await api("support", { method: "POST", body: b });
        toast("Your message has been sent to the gym.");
        await render();
      });
    } else if (r === "profile") {
      target.innerHTML =
        heading(
          "YOUR MEMBER SPACE.",
          "My profile",
          "Keep your details up to date.",
        ) +
        `<div class="grid-2"><form id="profile-form" class="panel"><h3>Your details</h3><label>Full name<input name="name" required maxlength="100" value="${h(user.name)}"></label><label>Email<input value="${h(user.email)}" disabled></label><label>Phone number<input name="phone" type="tel" required value="${h(user.phone)}"></label><button type="submit" class="button">Save details ${icon("check", 16)}</button><p class="form-error" role="alert"></p></form><form id="password-form" class="panel"><h3>Update your password</h3>${passwordField("Current password", "currentPassword", 1)}${passwordField("New password · 10+ characters", "newPassword")}<button type="submit" class="button button-outline">Update password ${icon("shield", 16)}</button><p class="form-error" role="alert"></p><p class="tiny mt">Updating your password logs out all your devices.</p></form></div><div class="row wrap"><a href="#notifications" class="button button-quiet">Notifications ${icon("bell", 16)}</a><a href="#support" class="button button-quiet">Support ${icon("support", 16)}</a><a href="#payments" class="button button-quiet">Payment records ${icon("file", 16)}</a><button id="profile-logout" class="button button-quiet">Log out ${icon("logout", 16)}</button></div>`;
      bindForm($("#profile-form"), async (b) => {
        user = await api("profile", { method: "PATCH", body: b });
        toast("Your details have been updated.");
        await render();
      });
      bindForm($("#password-form"), async (b) => {
        await api("password", { method: "POST", body: b });
        user = null;
        location.hash = "login";
        toast("Password changed. Please log in again.");
      });
      passwordToggles();
      $("#profile-logout").onclick = logout;
    } else {
      target.innerHTML = empty(
        "Page not found.",
        "Choose a section from your member menu.",
      );
    }
  } catch (e) {
    if (e.status === 401) {
      user = null;
      await renderAuth();
    } else
      $("#content").innerHTML = empty(
        "We couldn’t load this section.",
        e.message,
      );
  }
}
async function buttonAction(button, fn) {
  if (button.disabled) return;
  button.disabled = true;
  try {
    await fn();
  } catch (e) {
    toast(e.message, true);
  } finally {
    if (button.isConnected) button.disabled = false;
  }
}
async function purchase(plan) {
  try {
    const options = await api("payment-options");
    if (!options.accounts.length || options.instructions.length < 10) {
      toast(
        "The gym is preparing its payment instructions. Please contact the owner.",
        true,
      );
      return;
    }
    const dialog = showDialog(
      "Your next chapter.",
      `<form><p><strong>${h(plan.name)} · ${money(plan.pricePaise)}</strong><br>${plan.durationDays} days · manual renewal</p><div class="note">${h(options.instructions)}</div><label>How will you pay?<select name="accountId" required>${options.accounts.map((a) => `<option value="${a.id}">${h(a.label)}</option>`).join("")}</select></label><p class="small muted">Payment happens outside this website. You’ll see the receiving account and upload your receipt next. No membership activates until the gym verifies the actual funds.</p><button class="button button-full" type="submit">Continue ${icon("arrow", 17)}</button><p class="form-error" role="alert"></p></form>`,
      async (b) => {
        const payment = await api("payments", {
          method: "POST",
          body: { planId: plan.id, accountId: b.accountId },
        });
        dialog.close();
        receiptDialog(payment);
      },
    );
  } catch (e) {
    toast(e.message, true);
  }
}
function receiptDialog(p) {
  const a = p.accountSnapshot;
  const dialog = showDialog(
    "Submit your payment receipt.",
    `<form><div class="row between"><strong>${h(p.reference)}</strong><span>${money(p.amountPaise)}</span></div><div class="payment-details"><div><small>Method</small>${h(a.label)}</div><div><small>Bank</small>${h(a.bankName || "—")}</div><div><small>Account title</small>${h(a.accountName || "—")}</div><div><small>Account number</small>${h(a.accountNumber || "—")}</div>${a.iban ? `<div class="span-2"><small>IBAN</small>${h(a.iban)}</div>` : ""}</div>${a.note ? `<div class="note">${h(a.note)}</div>` : ""}<p>Transfer the exact amount outside the app, then attach your receipt. The owner checks the receiving account before activating your membership.</p><label>Payment screenshot / receipt<input type="file" name="file" accept="image/jpeg,image/png,image/webp" ${p.proofId ? "" : "required"}><small>JPG, PNG or WebP · up to 5 MB. ${p.proofId ? "A receipt is already attached; choose another only to replace it." : ""}</small></label><label>Transaction reference / sender details<input name="proofNote" required minlength="3" maxlength="500" placeholder="Transaction ID, sender name and payment date"></label><label class="checkbox"><input type="checkbox" required><span>I have actually paid the gym and the receipt belongs to this transaction.</span></label><button type="submit" class="button button-full">Send for verification ${icon("shield", 17)}</button><p class="form-error" role="alert"></p></form>`,
    async (b, form) => {
      const file = $('[name="file"]', form).files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024)
          throw Error("Choose an image smaller than 5 MB.");
        const body = new FormData();
        body.append("file", file);
        await api(`payments/${p.id}/proof`, { method: "POST", body });
      }
      await api(`payments/${p.id}/submit`, {
        method: "POST",
        body: { proofNote: b.proofNote },
      });
      dialog.close();
      toast("Receipt submitted. The gym will notify you after review.");
      if (route() === "payments") await render();
      else location.hash = "payments";
    },
  );
}
function downloadRecord(p) {
  const text = `MUSCLE DYNAMICS — PAYMENT REQUEST RECORD\nNot a tax invoice or bank confirmation.\n\nReference: ${p.reference}\nMember: ${user.name}\nPlan: ${p.planName}\nAmount: ${money(p.amountPaise)}\nStatus: ${p.status}\nMethod: ${p.accountSnapshot.label}\nSubmitted: ${time(p.submittedAt)}\nReviewed: ${time(p.reviewedAt)}\nGym note: ${p.adminNote || "—"}\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = p.reference + ".txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
window.addEventListener("hashchange", render);
start();
