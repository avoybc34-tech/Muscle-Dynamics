import {
  $,
  $$,
  api,
  h,
  money,
  date,
  time,
  icon,
  empty,
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
  version = 0,
  memberPage = 1,
  memberQuery = "";
const owner = () => user?.role === "OWNER";
const nav = () => [
  ["overview", "Overview", "home"],
  ["members", "Members", "users"],
  ...(owner()
    ? [
        ["payments", "Payment verification", "card"],
        ["plans", "Membership plans", "weight"],
        ["accounts", "Receiving accounts", "card"],
      ]
    : []),
  ["attendance", "Attendance", "calendar"],
  ["classes", "Classes & trainers", "weight"],
  ["support", "Support inbox", "support"],
  ...(owner()
    ? [
        ["announcements", "Announcements", "bell"],
        ["reports", "Revenue reports", "chart"],
        ["staff", "Staff accounts", "shield"],
        ["media", "Photo library", "image"],
        ["settings", "Website & policies", "settings"],
        ["audit", "Audit history", "file"],
      ]
    : []),
  ["profile", "My account", "user"],
];
const route = () => location.hash.slice(1) || "overview";
const input = (name, label, value = "", type = "text", extra = "") =>
  `<label>${h(label)}<input name="${name}" type="${type}" value="${h(value)}" ${extra}></label>`;
const textarea = (name, label, value = "", extra = "") =>
  `<label>${h(label)}<textarea name="${name}" ${extra}>${h(value)}</textarea></label>`;
const checkbox = (name, label, checked = false) =>
  `<label class="checkbox"><input type="checkbox" name="${name}" ${checked ? "checked" : ""}><span>${h(label)}</span></label>`;
const select = (name, label, options, value) =>
  `<label>${h(label)}<select name="${name}">${options.map(([v, l]) => `<option value="${h(v)}" ${v === value ? "selected" : ""}>${h(l)}</option>`).join("")}</select></label>`;
const buttons = (label = "Save changes") =>
  `<button class="button" type="submit">${h(label)} ${icon("check", 16)}</button><p class="form-error" role="alert"></p>`;
async function act(fn) {
  try {
    await fn();
  } catch (e) {
    toast(e.message, true);
  }
}
async function start() {
  try {
    const status = await api("auth/setup-status");
    if (!status.ownerExists) {
      location.replace("/setup.html");
      return;
    }
    try {
      user = await api("me");
    } catch (e) {
      if (e.status !== 401) throw e;
    }
    await render();
  } catch (e) {
    $("#app").innerHTML = empty("The workspace could not connect.", e.message);
  }
}
function login() {
  authShell({
    eyebrow: "THE PEOPLE BEHIND THE PROGRESS",
    title: "Your gym. Your workspace.",
    subtitle: "Sign in with your owner or staff account.",
    body: `<form id="login-form">${input("email", "Email address", "", "email", 'required autocomplete="email"')}${passwordField("Password", "password", 1)}${buttons("Log in")}</form>`,
    links:
      '<a href="/index.html">Back to website</a><a href="/member.html">Member login</a>',
    art: "RUN A<br><span>STRONGER GYM.</span>",
  });
  bindForm($("#login-form"), async (b) => {
    const result = await api("auth/login", { method: "POST", body: b });
    if (!["OWNER", "STAFF"].includes(result.user.role)) {
      location.href = "/member.html";
      return;
    }
    user = result.user;
    await render();
  });
}
async function render() {
  if (!user) {
    login();
    return;
  }
  const id = ++version,
    r = route();
  shell({ user, items: nav(), current: r, admin: true, onLogout: logout });
  $("#content").innerHTML =
    '<div class="loading-block">Loading gym information…</div>';
  try {
    const content = $("#content");
    if (r === "overview") {
      const d = await api("admin/overview");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "YOUR GYM, AT A GLANCE.",
          "Let’s make today count.",
          "Memberships, payments and the people who keep showing up.",
          `<a class="button button-small" href="#members">View members ${icon("up", 15)}</a>`,
        ) +
        `<div class="stat-grid">${stat("Total members", d.members, "users", "Registered gym members")}${stat("Active memberships", d.active, "card", "Unexpired, not suspended")}${stat("Checked in today", d.visits, "calendar", "Pakistan calendar day")}${stat(owner() ? "Verified revenue this month" : "Open support tickets", owner() ? money(d.monthRevenuePaise) : d.tickets, owner() ? "chart" : "support", owner() ? "Approved payments only" : "Awaiting a gym reply")}</div>${
          owner() && (!d.setup.settings || !d.setup.plans || !d.setup.accounts)
            ? `<section class="panel"><div class="section-title"><h3>Make the gym ready to join.</h3><a class="button button-quiet" href="#settings">Open settings ${icon("settings", 14)}</a></div><ul class="checklist">${[
                [
                  d.setup.settings,
                  "Publish your real contact details, privacy notice and membership terms.",
                ],
                [
                  d.setup.plans,
                  "Create at least one active gym membership plan with its PKR price.",
                ],
                [
                  d.setup.accounts,
                  "Add a receiving account and clear payment instructions.",
                ],
              ]
                .map(
                  ([done, text]) =>
                    `<li class="${done ? "" : "incomplete"}">${icon(done ? "check" : "plus", 17)}${h(text)}</li>`,
                )
                .join(
                  "",
                )}</ul><p class="tiny mt">There are no invented prices, bank accounts or members. Configure them before opening registration.</p></section>`
            : ""
        }<div class="grid-2"><section class="panel table-panel"><div class="section-title"><h3>New faces at the gym.</h3><a class="inline-link" href="#members">All members ↗</a></div>${memberTable(d.recent, false)}</section><section class="panel"><h3>Keep the gym moving.</h3><ul class="checklist"><li>${icon("calendar", 18)}<a href="#members">${d.expiring} memberships expiring within seven days</a></li>${owner() ? `<li>${icon("card", 18)}<a href="#payments">${d.pending} payments waiting for verification</a></li>` : ""}<li>${icon("support", 18)}<a href="#support">${d.tickets} open support conversations</a></li></ul><p class="tiny mt">Payments are approved only after you check the actual receiving account. A screenshot alone is not proof of received funds.</p></section></div>`;
      bindMemberButtons();
    } else if (r === "members" || r === "staff") {
      const staff = r === "staff";
      const d = await api(
        `admin/members?q=${encodeURIComponent(memberQuery)}&page=${memberPage}${staff ? "&roles=all" : ""}`,
      );
      if (id !== version) return;
      content.innerHTML =
        heading(
          staff
            ? "CLEAR RESPONSIBILITY. RESTRICTED ACCESS."
            : "THE PEOPLE BEHIND YOUR GYM.",
          staff ? "Staff accounts" : "Your members",
          staff
            ? "Staff handle check-ins, member lookups, classes and support. Financial and configuration access stays with the owner."
            : "Search members, see expiry dates, and record gym check-ins.",
          staff
            ? `<button id="new-staff" class="button button-small">New staff ${icon("plus", 15)}</button>`
            : "",
        ) +
        `<form class="toolbar" id="member-search"><input name="q" value="${h(memberQuery)}" placeholder="Search name, email or phone" aria-label="Search members"><button class="button button-small" type="submit">Search ${icon("search", 14)}</button></form><section class="panel table-panel">${memberTable(d.rows, true, staff)}<div class="table-pager"><span>${d.total} accounts · page ${d.page}</span><div class="row"><button class="button button-quiet" id="previous-page" ${memberPage === 1 ? "disabled" : ""}>Previous</button><button class="button button-quiet" id="next-page" ${d.page * 30 >= d.total ? "disabled" : ""}>Next</button></div></div></section>`;
      bindForm($("#member-search"), async (b) => {
        memberQuery = b.q;
        memberPage = 1;
        await render();
      });
      $("#previous-page").onclick = () => {
        memberPage--;
        render();
      };
      $("#next-page").onclick = () => {
        memberPage++;
        render();
      };
      bindMemberButtons();
      if (staff) $("#new-staff").onclick = staffDialog;
    } else if (r === "payments") {
      const status = sessionStorage.getItem("md_payment_filter") || "PENDING",
        rows = await api("admin/payments?status=" + status);
      if (id !== version) return;
      content.innerHTML =
        heading(
          "VERIFY THE FUNDS. THEN THE MEMBERSHIP.",
          "Payment verification",
          "Check your real bank or wallet account. No automatic approval is performed.",
          `<button class="button button-small" id="record-cash">Record cash payment ${icon("plus", 15)}</button>`,
        ) +
        `<div class="toolbar"><label>Status<select id="payment-filter">${["PENDING", "APPROVED", "REJECTED", "DRAFT", "ALL"].map((s) => `<option ${s === status ? "selected" : ""}>${s}</option>`).join("")}</select></label><span class="tiny muted">Latest 150 requests for the selected status</span></div><section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Reference / submitted</th><th>Member</th><th>Plan / method</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>${rows.map((p) => `<tr><td><strong>${h(p.reference)}</strong><small>${date(p.submittedAt || p.createdAt)}</small></td><td><strong>${h(p.user.name)}</strong><small>${h(p.user.email)}</small></td><td>${h(p.planName)}<small>${h(p.accountSnapshot.label)}</small></td><td><strong>${money(p.amountPaise)}</strong></td><td>${badge(p.status)}</td><td><button class="button button-quiet" data-review="${p.id}">${p.status === "PENDING" ? "Review" : "View"}</button></td></tr>`).join("")}</tbody></table></div>${!rows.length ? empty("Nothing waiting here.", "Requests appear when a member submits a payment receipt.") : ""}</section>`;
      $("#payment-filter").onchange = (e) => {
        sessionStorage.setItem("md_payment_filter", e.target.value);
        render();
      };
      $$("[data-review]").forEach(
        (b) =>
          (b.onclick = () =>
            paymentDialog(rows.find((p) => p.id === b.dataset.review))),
      );
      $("#record-cash").onclick = cashDialog;
    } else if (r === "plans") {
      const rows = await api("admin/plans");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "CLEAR PRICES. CLEAR BENEFITS.",
          "Membership plans",
          "Prices are in PKR. Archive a plan by turning off “Available to members”. Existing payment snapshots stay unchanged.",
          `<button id="new-plan" class="button button-small">Create plan ${icon("plus", 15)}</button>`,
        ) +
        `<section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Plan</th><th>Price</th><th>Duration</th><th>Published</th><th></th></tr></thead><tbody>${rows.map((p) => `<tr><td><strong>${h(p.name)}</strong><small>${h(p.slug)}</small></td><td>${money(p.pricePaise)}</td><td>${p.durationDays} days</td><td>${badge(p.active ? "ACTIVE" : "DRAFT")}</td><td><button class="button button-quiet" data-edit-plan="${p.id}">Edit</button></td></tr>`).join("")}</tbody></table></div>${!rows.length ? empty("Create your first real gym plan.", "Set the price, duration and benefits. Nothing is priced or activated automatically.") : ""}</section>`;
      $("#new-plan").onclick = () => planDialog();
      $$("[data-edit-plan]").forEach(
        (b) =>
          (b.onclick = () =>
            planDialog(rows.find((p) => p.id === b.dataset.editPlan))),
      );
    } else if (r === "accounts") {
      const rows = await api("admin/accounts");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "YOUR ACCOUNTS. YOUR PAYMENT PROCESS.",
          "Receiving accounts",
          "Only publish account details you want members to use. Never enter PINs, passwords, OTPs or API secrets.",
          `<button id="new-account" class="button button-small">Add account ${icon("plus", 15)}</button>`,
        ) +
        `<div class="grid-2">${rows.map((a) => `<article class="panel"><div class="row between"><h3>${h(a.label)}</h3>${badge(a.active ? "ACTIVE" : "DRAFT")}</div><p>${h(a.type)} · ${h(a.bankName)}<br>${h(a.accountName)}<br>${h(a.accountNumber || a.iban)}</p><p>${h(a.note)}</p><button class="button button-quiet" data-edit-account="${a.id}">Edit account ${icon("edit", 14)}</button></article>`).join("") || empty("No receiving accounts yet.", "Members cannot submit payment requests until you enable an account and payment instructions.")}</div>`;
      $("#new-account").onclick = () => accountDialog();
      $$("[data-edit-account]").forEach(
        (b) =>
          (b.onclick = () =>
            accountDialog(rows.find((a) => a.id === b.dataset.editAccount))),
      );
    } else if (r === "attendance") {
      const rows = await api("admin/attendance");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "CONSISTENCY, RECORDED.",
          "Today’s check-ins",
          "One recorded check-in per member per Pakistan calendar day.",
          `<a href="#members" class="button button-small">Find a member ${icon("search", 15)}</a>`,
        ) +
        `<section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Member</th><th>Email</th><th>Checked in at</th></tr></thead><tbody>${rows.map((a) => `<tr><td><strong>${h(a.user.name)}</strong></td><td>${h(a.user.email)}</td><td>${time(a.createdAt)}</td></tr>`).join("")}</tbody></table></div>${!rows.length ? empty("A fresh day on the gym floor.", "Find a member in Members and select Check in.") : ""}</section>`;
    } else if (r === "classes") {
      const [classes, trainers] = await Promise.all([
        api("admin/classes"),
        api("admin/trainers"),
      ]);
      if (id !== version) return;
      content.innerHTML =
        heading(
          "A LITTLE STRUCTURE. A LOT OF ENERGY.",
          "Classes & trainers",
          "Bookings respect capacity and require membership covering the class date.",
          owner()
            ? `<button id="new-class" class="button button-small">New class ${icon("plus", 15)}</button>`
            : "",
        ) +
        `<section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Class</th><th>Trainer</th><th>When · Pakistan time</th><th>Booked</th><th></th></tr></thead><tbody>${classes.map((c) => `<tr><td><strong>${h(c.title)}</strong><small>${c.active ? "Scheduled" : "Cancelled / hidden"}</small></td><td>${h(c.trainer.name)}</td><td>${time(c.startsAt)}</td><td>${c._count.bookings} / ${c.capacity}</td><td>${owner() ? `<div class="row"><button class="button button-quiet" data-edit-class="${c.id}">Edit</button><button class="button button-quiet" data-class-bookings="${c.id}">Attendees</button></div>` : ""}</td></tr>`).join("")}</tbody></table></div>${!classes.length ? empty("No classes scheduled yet.") : ""}</section><div class="section-title mt"><h3>Your trainers</h3>${owner() ? `<button class="button button-quiet" id="new-trainer">Add trainer ${icon("plus", 14)}</button>` : ""}</div><div class="grid-2">${trainers.map((t) => `<article class="panel"><div class="row between"><h3>${h(t.name)}</h3>${badge(t.active ? "ACTIVE" : "DRAFT")}</div><p>${h(t.specialty)}<br>${h(t.bio)}</p>${owner() ? `<button class="button button-quiet" data-edit-trainer="${t.id}">Edit trainer</button>` : ""}</article>`).join("") || empty("Add your real coaching team.", "No invented names or qualifications are published.")}</div>`;
      if (owner()) {
        $("#new-class").onclick = () => classDialog(null, trainers);
        $("#new-trainer").onclick = () => trainerDialog();
        $$("[data-edit-class]").forEach(
          (b) =>
            (b.onclick = () =>
              classDialog(
                classes.find((c) => c.id === b.dataset.editClass),
                trainers,
              )),
        );
        $$("[data-edit-trainer]").forEach(
          (b) =>
            (b.onclick = () =>
              trainerDialog(
                trainers.find((t) => t.id === b.dataset.editTrainer),
              )),
        );
        $$("[data-class-bookings]").forEach(
          (b) =>
            (b.onclick = () =>
              act(async () => {
                const bookings = await api(
                  `admin/classes/${b.dataset.classBookings}/bookings`,
                );
                showDialog(
                  "Confirmed attendees",
                  bookings.length
                    ? `<div class="stack">${bookings.map((v) => `<div class="payment-item"><strong>${h(v.user.name)}</strong><p>${h(v.user.email)} · ${h(v.user.phone)}</p></div>`).join("")}</div>`
                    : empty("No bookings yet."),
                );
              })),
        );
      }
    } else if (r === "support") {
      const rows = await api("admin/support");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "BE IN YOUR MEMBERS’ CORNER.",
          "Support inbox",
          "Replies are delivered in the member space and in-app notifications.",
        ) +
        `<div class="payment-list">${rows.map((t) => `<article class="payment-item"><div class="row between"><h3>${h(t.subject)}</h3>${badge(t.status)}</div><p>${h(t.user.name)} · ${h(t.user.email)} · ${date(t.createdAt)}</p><p>${h(t.message)}</p>${t.reply ? `<div class="note">Your reply: ${h(t.reply)}</div>` : ""}<button class="button button-quiet" data-reply="${t.id}">Reply ${icon("mail", 15)}</button></article>`).join("") || empty("Your inbox is clear.", "Member support requests will appear here.")}</div>`;
      $$("[data-reply]").forEach(
        (b) =>
          (b.onclick = () => {
            const t = rows.find((t) => t.id === b.dataset.reply);
            const dialog = showDialog(
              "Reply to " + t.user.name,
              `<form><p>${h(t.subject)}<br>${h(t.message)}</p>${textarea("reply", "Your reply", t.reply, 'required maxlength="5000"')}${select(
                "status",
                "Ticket status",
                [
                  ["OPEN", "Keep open"],
                  ["RESOLVED", "Mark resolved"],
                ],
                t.status,
              )}${buttons("Send reply")}</form>`,
              async (body) => {
                await api("admin/support/" + t.id, { method: "PATCH", body });
                dialog.close();
                toast("Reply sent.");
                await render();
              },
            );
          }),
      );
    } else if (r === "announcements") {
      const rows = await api("admin/announcements");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "KEEP EVERYONE IN THE LOOP.",
          "Gym announcements",
          "Published announcements appear in every member’s overview.",
          `<button id="new-announcement" class="button button-small">New announcement ${icon("plus", 15)}</button>`,
        ) +
        `<div class="payment-list">${rows.map((a) => `<article class="payment-item"><div class="row between"><h3>${h(a.title)}</h3>${badge(a.active ? "ACTIVE" : "DRAFT")}</div><p>${h(a.message)}</p><button class="button button-quiet" data-edit-announcement="${a.id}">Edit</button></article>`).join("") || empty("Publish your first gym update.")}</div>`;
      $("#new-announcement").onclick = () => announcementDialog();
      $$("[data-edit-announcement]").forEach(
        (b) =>
          (b.onclick = () =>
            announcementDialog(
              rows.find((a) => a.id === b.dataset.editAnnouncement),
            )),
      );
    } else if (r === "reports") {
      content.innerHTML =
        heading(
          "ACTUAL APPROVALS. CLEAR RECORDS.",
          "Revenue reports",
          "Approved payments only. This is a payment register, not tax or accounting advice.",
        ) +
        `<form class="date-filter mb" id="report-filter"><label>From<input type="date" name="from"></label><label>To<input type="date" name="to"></label><button type="submit" class="button button-small">Apply filter ${icon("chart", 15)}</button><a class="button button-outline button-small" id="report-csv" href="/api/admin/reports?format=csv">Download CSV ${icon("file", 15)}</a></form><div id="report-results"></div>`;
      const load = async (b) => {
        const query = new URLSearchParams(
          Object.entries(b || {}).filter(([, v]) => v),
        );
        const d = await api("admin/reports?" + query);
        $("#report-csv").href = "/api/admin/reports?" + query + "&format=csv";
        $("#report-results").innerHTML =
          `<div class="stat-grid">${stat("Approved revenue", money(d.totalPaise), "chart", "PKR · selected dates")}${stat("Approved payments", d.count, "card", d.limited ? "Showing the first 10,000" : "Matching the selected dates")}</div><section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>Reference</th><th>Member</th><th>Plan</th><th>Amount</th><th>Approved</th></tr></thead><tbody>${d.rows.map((p) => `<tr><td>${h(p.reference)}</td><td>${h(p.user.name)}</td><td>${h(p.planName)}</td><td>${money(p.amountPaise)}</td><td>${date(p.reviewedAt)}</td></tr>`).join("")}</tbody></table></div>${!d.rows.length ? empty("No approved payments in this period.") : ""}</section>`;
      };
      bindForm($("#report-filter"), load);
      await load({});
    } else if (r === "settings") {
      const s = await api("admin/settings");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "YOUR WEBSITE. YOUR WORDS.",
          "Website & policies",
          "Edit the agreed content here. For layout, fonts and colours, see the editing guide in your source files.",
        ) +
        `<form id="settings-form" class="settings-form"><section class="panel"><h3>Brand & homepage</h3><div class="field-row">${input("gymName", "Gym name", s.gymName, "text", 'required maxlength="80"')}${input("tagline", "Tagline", s.tagline, "text", 'maxlength="160"')}</div>${input("heroTitle", "Main headline (use a short, strong sentence)", s.heroTitle, "text", 'required maxlength="100"')}${textarea("heroSubtitle", "Homepage introduction", s.heroSubtitle, 'maxlength="350"')}${textarea("about", "About your gym", s.about, 'maxlength="3000"')}${input("heroPhotoId", "Homepage image ID from Photo library", s.heroPhotoId)}<p class="tiny">Leave the image ID blank to use the included illustrative stock photograph. Upload your own gym photo before public launch.</p></section><section class="panel"><h3>Real contact details</h3><div class="field-row">${input("email", "Public contact email", s.email, "email")}${input("phone", "Gym phone", s.phone)}</div><div class="field-row">${input("whatsapp", "WhatsApp number", s.whatsapp)}${input("address", "Gym address", s.address, "text", 'maxlength="300"')}</div>${textarea("hours", "Opening hours", s.hours, 'maxlength="300"')}</section><section class="panel"><h3>Payment instructions</h3>${textarea("paymentInstructions", "Instructions shown before a member pays", s.paymentInstructions, 'maxlength="1500"')}<p class="tiny">Add actual receiving accounts in Receiving accounts. No banking passwords, PINs, OTPs or secret credentials belong here.</p></section><section class="panel"><h3>Your policies</h3><div class="note warn">Publish business-approved privacy and membership terms. Include tax, refund, cancellation, verification and renewal rules. Get legal advice where needed. Member signup stays closed until real contact details and both policies are supplied.</div>${textarea("privacyText", "Privacy notice", s.privacyText, 'class="large" maxlength="15000"')}${textarea("termsText", "Membership terms, tax and cancellation policy", s.termsText, 'class="large" maxlength="15000"')}${textarea("nutritionText", "Optional nutrition guidance", s.nutritionText, 'maxlength="6000"')}</section><section class="panel"><h3>Gym gallery</h3>${textarea("gallery", "One image ID and caption per line: ID | caption", s.gallery.map((f) => f.id + " | " + f.caption).join("\n"), 'rows="5"')}<p class="tiny">Copy IDs from Photo library. Maximum 12 images.</p></section>${buttons("Save website settings")}</form>`;
      bindForm($("#settings-form"), async (b) => {
        b.gallery = b.gallery
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((line) => {
            const [id, ...caption] = line.split("|");
            return { id: id.trim(), caption: caption.join("|").trim() };
          });
        await api("admin/settings", { method: "PATCH", body: b });
        toast("Website settings saved.");
      });
    } else if (r === "media") {
      const rows = await api("admin/media");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "YOUR SPACE. YOUR PEOPLE.",
          "Photo library",
          "Upload photos you own or have permission to use. Payment proofs never appear in this public library.",
        ) +
        `<form class="panel" id="media-form"><label>Gym / trainer photo<input type="file" name="file" accept="image/jpeg,image/png,image/webp" required><small>JPG, PNG or WebP · maximum 5 MB. Uploaded photos are re-encoded and made public.</small></label>${buttons("Upload photo")}</form><div class="media-grid">${rows.map((f) => `<article class="media-item"><img src="/api/files/${f.id}" alt="Uploaded gym photo"><code>${f.id}</code><button class="button button-quiet" data-copy="${f.id}">Copy image ID</button></article>`).join("")}</div>`;
      bindForm($("#media-form"), async (b, form) => {
        const body = new FormData();
        body.append("file", $('[name="file"]', form).files[0]);
        await api("admin/media", { method: "POST", body });
        toast("Photo uploaded.");
        await render();
      });
      $$("[data-copy]").forEach(
        (b) =>
          (b.onclick = () =>
            act(async () => {
              await navigator.clipboard.writeText(b.dataset.copy);
              toast("Image ID copied.");
            })),
      );
    } else if (r === "audit") {
      const rows = await api("admin/audit");
      if (id !== version) return;
      content.innerHTML =
        heading(
          "A CLEAR RECORD OF IMPORTANT CHANGES.",
          "Audit history",
          "The latest 200 account, payment, attendance and configuration events.",
        ) +
        `<section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Record</th><th>Details</th></tr></thead><tbody>${rows.map((a) => `<tr><td>${time(a.createdAt)}</td><td>${h(a.actor.name)}<small>${h(a.actor.email)}</small></td><td>${h(a.action.replaceAll("_", " "))}</td><td>${h(a.entity)}<small>${h(a.entityId)}</small></td><td>${h(JSON.stringify(a.detail))}</td></tr>`).join("")}</tbody></table></div></section>`;
    } else if (r === "profile") {
      content.innerHTML =
        heading(
          "YOUR ACCESS. YOUR RESPONSIBILITY.",
          "My account",
          "Use a unique password and keep your owner or staff access private.",
        ) +
        `<div class="grid-2"><form id="profile-form" class="panel"><h3>Your details</h3>${input("name", "Full name", user.name, "text", "required")}${input("phone", "Phone number", user.phone, "tel", "required")}<p>${h(user.email)} · ${h(user.role)}</p>${buttons()}</form><form id="password-form" class="panel"><h3>Change your password</h3>${passwordField("Current password", "currentPassword", 1)}${passwordField("New password", "newPassword")}${buttons("Update password")}</form></div><button id="account-logout" class="button button-outline">Log out ${icon("logout", 16)}</button>`;
      bindForm($("#profile-form"), async (body) => {
        user = await api("profile", { method: "PATCH", body });
        toast("Details updated.");
        await render();
      });
      bindForm($("#password-form"), async (body) => {
        await api("password", { method: "POST", body });
        location.reload();
      });
      passwordToggles();
      $("#account-logout").onclick = logout;
    } else
      content.innerHTML = empty(
        "Section not found.",
        "Select a section from your workspace menu.",
      );
  } catch (e) {
    if (e.status === 401) {
      user = null;
      login();
    } else
      $("#content").innerHTML = empty(
        "We couldn’t load this section.",
        e.message,
      );
  }
}
function memberTable(rows, actions = true, roles = false) {
  return `<div class="table-wrap"><table><thead><tr><th>Member</th><th>${roles ? "Role" : "Membership"}</th><th>Expiry</th><th>Status</th>${actions ? "<th></th>" : ""}</tr></thead><tbody>${rows.map((m) => `<tr><td><strong>${h(m.name)}</strong><small>${h(m.email)}</small></td><td>${roles ? badge(m.role) : h(m.membership?.planName || "No membership")}</td><td>${date(m.membership?.endsAt)}</td><td>${badge(m.status === "SUSPENDED" ? "SUSPENDED" : m.membership?.status || "NOT STARTED")}</td>${actions ? `<td><div class="row"><button class="button button-quiet" data-member="${m.id}">View</button>${m.role === "MEMBER" ? `<button class="button button-quiet" data-checkin="${m.id}">Check in</button>` : ""}</div></td>` : ""}</tr>`).join("")}</tbody></table>${!rows.length ? empty("No members found.", "Member accounts appear after registration.") : ""}</div>`;
}
function bindMemberButtons() {
  $$("[data-member]").forEach(
    (b) => (b.onclick = () => act(() => memberDialog(b.dataset.member))),
  );
  $$("[data-checkin]").forEach(
    (b) =>
      (b.onclick = () =>
        act(async () => {
          await api("admin/attendance", {
            method: "POST",
            body: { userId: b.dataset.checkin },
          });
          toast("Today’s check-in is recorded.");
        })),
  );
}
async function memberDialog(id) {
  const d = await api("admin/members/" + id),
    m = d.user;
  const dialog = showDialog(
    m.name,
    `<div class="row between"><p>${h(m.email)}<br>${h(m.phone)}</p>${badge(m.role)}</div><div class="note">${h(m.membership?.planName || "No membership")} · ${h(m.membership?.status || "NOT STARTED")}<br>Valid until ${date(m.membership?.endsAt)} · ${d.attendance.length} recent check-ins</div>${
      owner()
        ? `<form id="edit-member">${input("name", "Full name", m.name, "text", 'required maxlength="100"')}${input("phone", "Phone number", m.phone, "tel", "required")}${
            m.role !== "OWNER"
              ? `<div class="field-row">${select(
                  "role",
                  "Role",
                  [
                    ["MEMBER", "Member"],
                    ["STAFF", "Staff"],
                  ],
                  m.role,
                )}${select(
                  "status",
                  "Account state",
                  [
                    ["ACTIVE", "Active"],
                    ["SUSPENDED", "Suspended"],
                  ],
                  m.status,
                )}</div><p class="tiny muted mt">Changing roles revokes existing sessions. Suspending an account blocks access immediately.</p>`
              : ""
          }${buttons("Save member")}</form><div class="dialog-actions">${m.role !== "OWNER" ? '<button id="reset-member-password" class="button button-quiet">Reset password</button>' : ""}${m.membership && !m.membership.cancelledAt ? '<button id="cancel-membership" class="button button-quiet">Cancel membership</button>' : ""}</div>`
        : ""
    }<h3 class="mt">Recent attendance</h3>${
      d.attendance
        .slice(0, 10)
        .map(
          (a) => `<div class="notification"><p>${time(a.createdAt)}</p></div>`,
        )
        .join("") || "<p>No recent check-ins.</p>"
    }`,
  );
  if (owner()) {
    bindForm($("#edit-member", dialog), async (body) => {
      await api("admin/members/" + id, { method: "PATCH", body });
      dialog.close();
      toast("Member updated.");
      await render();
    });
    const resetButton = $("#reset-member-password", dialog);
    if (resetButton)
      resetButton.onclick = () => {
        dialog.close();
        const reset = showDialog(
          "Reset member password",
          `<form><p>Verify ${h(m.name)}’s identity before resetting their password. Share the new password securely. All their devices will be logged out.</p>${passwordField("New temporary password", "newPassword")}${buttons("Reset password")}</form>`,
          async (body) => {
            const result = await api(`admin/members/${id}/reset-password`, {
              method: "POST",
              body,
            });
            reset.close();
            toast(result.message);
          },
        );
        passwordToggles(reset);
      };
    const cancel = $("#cancel-membership", dialog);
    if (cancel)
      cancel.onclick = () => {
        dialog.close();
        const box = showDialog(
          "Cancel this membership?",
          `<form><p>This immediately ends ${h(m.name)}’s gym access. No automatic refund is issued.</p>${textarea("reason", "Reason visible to the member", "", 'required minlength="3" maxlength="1000"')}${checkbox("confirm", "I intend to cancel this membership.")}<button class="button button-danger" type="submit">Cancel membership</button><p class="form-error" role="alert"></p></form>`,
          async (body, form) => {
            if (!$('[name="confirm"]', form).checked)
              throw Error("Confirm the cancellation first.");
            await api(`admin/members/${id}/cancel-membership`, {
              method: "POST",
              body: { reason: body.reason },
            });
            box.close();
            toast("Membership cancelled.");
            await render();
          },
        );
      };
  }
}
function planDialog(p) {
  const dialog = showDialog(
    p ? "Edit membership plan" : "Create a gym plan",
    `<form>${input("name", "Plan name", p?.name || "", "text", 'required maxlength="80"')}${input("slug", "Unique slug (lowercase letters, numbers, hyphens)", p?.slug || "", "text", 'required pattern="[a-z0-9-]{2,50}"')}${input("tagline", "Short description", p?.tagline || "", "text", 'maxlength="160"')}<div class="field-row">${input("price", "Price · PKR", p ? p.pricePaise / 100 : "", "number", 'required min="1" max="1000000" step="0.01"')}${input("durationDays", "Duration · days", p?.durationDays || 30, "number", 'required min="1" max="730"')}</div>${textarea("features", "Benefits — one per line", p?.features.join("\n") || "", "required")}${input("sortOrder", "Display order", p?.sortOrder || 0, "number", 'min="0" max="1000"')}${checkbox("highlight", "Highlight this plan", p?.highlight)}${checkbox("active", "Available to members", p?.active)}${buttons(p ? "Save plan" : "Create plan")}</form>`,
    async (body, form) => {
      const data = {
        ...body,
        price: Number(body.price),
        durationDays: Number(body.durationDays),
        sortOrder: Number(body.sortOrder),
        features: body.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        highlight: $('[name="highlight"]', form).checked,
        active: $('[name="active"]', form).checked,
      };
      await api("admin/plans" + (p ? "/" + p.id : ""), {
        method: p ? "PATCH" : "POST",
        body: data,
      });
      dialog.close();
      toast("Plan saved.");
      await render();
    },
  );
  if (!p)
    $('[name="name"]', dialog).oninput = (e) => {
      const slug = $('[name="slug"]', dialog);
      if (!slug.dataset.edited)
        slug.value = e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
    };
  $('[name="slug"]', dialog).oninput = (e) =>
    (e.target.dataset.edited = "true");
}
function accountDialog(a) {
  const dialog = showDialog(
    a ? "Edit receiving account" : "Add a payment method",
    `<form>${input("label", "Member-facing label", a?.label || "", "text", 'required maxlength="80"')}${select(
      "type",
      "Method type",
      ["BANK", "EASYPAISA", "JAZZCASH", "CASH", "OTHER"].map((s) => [s, s]),
      a?.type || "BANK",
    )}${input("bankName", "Bank / provider name", a?.bankName || "")}${input("accountName", "Account title", a?.accountName || "")}${input("accountNumber", "Account number / wallet number", a?.accountNumber || "")}${input("iban", "IBAN (if applicable)", a?.iban || "")}${textarea("note", "Instructions for this method", a?.note || "", 'maxlength="500"')}${checkbox("active", "Enable this payment method", a?.active)}${buttons("Save payment method")}</form>`,
    async (body, form) => {
      await api("admin/accounts" + (a ? "/" + a.id : ""), {
        method: a ? "PATCH" : "POST",
        body: { ...body, active: $('[name="active"]', form).checked },
      });
      dialog.close();
      toast("Payment method saved.");
      await render();
    },
  );
}
function paymentDialog(p) {
  const pending = p.status === "PENDING";
  const dialog = showDialog(
    p.reference + " / " + p.planName,
    `<div class="review-split"><div><div class="row between"><strong>${h(p.user.name)}</strong>${badge(p.status)}</div><p class="small">${h(p.user.email)}<br>${h(p.user.phone)}</p><div class="payment-details"><div><small>Amount</small>${money(p.amountPaise)}</div><div><small>Receiving method</small>${h(p.accountSnapshot.label)}</div><div class="span-2"><small>Member’s transaction details</small>${h(p.proofNote || "—")}</div><div class="span-2"><small>Submitted</small>${time(p.submittedAt)}</div></div>${p.proofId ? `<a href="/api/files/${p.proofId}" target="_blank" rel="noopener"><img class="proof-image" src="/api/files/${p.proofId}" alt="Private payment proof for ${h(p.reference)}"></a>` : "<p>No payment screenshot attached.</p>"}</div><div class="review-box">${
      pending
        ? `<form><div class="note warn">Check the real receiving account. Screenshots can be altered. Approval activates or extends gym access and creates a permanent review record.</div>${select(
            "decision",
            "Decision",
            [
              ["REJECTED", "Reject — explain why"],
              ["APPROVED", "Approve — actual funds received"],
            ],
            "REJECTED",
          )}${textarea("note", "Review note / rejection reason", "", 'required minlength="3" maxlength="1000"')}${checkbox("fundsVerified", "I checked the actual receiving account and confirmed these funds.")}<button type="submit" class="button button-full">Save decision ${icon("shield", 17)}</button><p class="form-error" role="alert"></p></form>`
        : `<h3>Review record</h3><p>${h(p.adminNote || "Not reviewed yet.")}</p><p>${time(p.reviewedAt)}</p><p class="tiny">Approved and rejected decisions cannot be overwritten. Contact the member for a new submission if necessary.</p>`
    }</div></div>`,
    pending
      ? async (body, form) => {
          await api(`admin/payments/${p.id}/review`, {
            method: "POST",
            body: {
              ...body,
              fundsVerified: $('[name="fundsVerified"]', form).checked,
            },
          });
          dialog.close();
          toast("Decision saved. The member has been notified.");
          await render();
        }
      : undefined,
  );
}
async function cashDialog() {
  const [plans, accounts] = await Promise.all([
    api("admin/plans"),
    api("admin/accounts"),
  ]);
  const cash = accounts.filter((a) => a.type === "CASH" && a.active),
    active = plans.filter((p) => p.active);
  if (!cash.length || !active.length) {
    toast(
      "Create an active plan and an active cash payment method first.",
      true,
    );
    return;
  }
  const dialog = showDialog(
    "Record cash received at the gym",
    `<form><div class="note warn">Record money actually received. This approves the payment and activates the selected membership. No bank transfer or refund is performed.</div>${input("query", "Find member by name or email", "", "text", "required")}<button type="button" class="button button-quiet" id="find-cash-member">Find member</button><div id="cash-members" class="mt"></div>${select(
      "planId",
      "Membership",
      active.map((p) => [p.id, p.name + " · " + money(p.pricePaise)]),
      active[0].id,
    )}${select(
      "accountId",
      "Cash receiving method",
      cash.map((a) => [a.id, a.label]),
      cash[0].id,
    )}${textarea("note", "Receipt / cash-register reference", "", 'required minlength="5" maxlength="1000"')}${checkbox("fundsVerified", "I have actually received this cash payment.")}${buttons("Record cash & activate")}</form>`,
    async (body, form) => {
      const member = $('[name="userId"]', form)?.value;
      if (!member) throw Error("Find and select the member first.");
      await api("admin/payments/cash", {
        method: "POST",
        body: {
          userId: member,
          planId: body.planId,
          accountId: body.accountId,
          note: body.note,
          fundsVerified: $('[name="fundsVerified"]', form).checked,
        },
      });
      dialog.close();
      toast("Cash payment recorded and membership activated.");
      await render();
    },
  );
  $("#find-cash-member", dialog).onclick = () =>
    act(async () => {
      const q = $('[name="query"]', dialog).value;
      const d = await api("admin/members?q=" + encodeURIComponent(q));
      $("#cash-members", dialog).innerHTML = d.rows.length
        ? select(
            "userId",
            "Select member",
            d.rows.map((m) => [m.id, m.name + " · " + m.email]),
            d.rows[0].id,
          )
        : "<p>No matching members.</p>";
    });
}
function staffDialog() {
  const dialog = showDialog(
    "Create a staff account",
    `<form>${input("name", "Full name", "", "text", 'required maxlength="100"')}${input("email", "Email", "", "email", "required")}${input("phone", "Phone", "", "tel", "required")}${passwordField("Initial password · share securely")}<div class="note">Staff can look up members, record check-ins, view classes and reply to support. They cannot see payment screenshots, approve payments, change roles or edit website settings.</div>${buttons("Create staff account")}</form>`,
    async (body) => {
      await api("admin/staff", { method: "POST", body });
      dialog.close();
      toast("Staff account created. Share access details securely.");
      await render();
    },
  );
  passwordToggles(dialog);
}
function trainerDialog(t) {
  const dialog = showDialog(
    t ? "Edit trainer" : "Add a real trainer",
    `<form>${input("name", "Full name", t?.name || "", "text", "required")}${input("specialty", "Specialty", t?.specialty || "", "text", "required")}${textarea("bio", "Short bio / qualifications", t?.bio || "", 'maxlength="1200"')}${input("photoId", "Public photo ID from Photo library", t?.photoId || "")}${checkbox("active", "Publish this trainer", t?.active ?? true)}${buttons("Save trainer")}</form>`,
    async (body, form) => {
      await api("admin/trainers" + (t ? "/" + t.id : ""), {
        method: t ? "PATCH" : "POST",
        body: { ...body, active: $('[name="active"]', form).checked },
      });
      dialog.close();
      toast("Trainer saved.");
      await render();
    },
  );
}
function localInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
function classDialog(c, trainers) {
  if (!trainers.length) {
    toast("Add a trainer before scheduling a class.", true);
    return;
  }
  const dialog = showDialog(
    c ? "Edit class" : "Schedule a class",
    `<form>${input("title", "Class title", c?.title || "", "text", "required")}${select(
      "trainerId",
      "Trainer",
      trainers.map((t) => [t.id, t.name]),
      c?.trainerId || trainers[0].id,
    )}<p class="tiny muted">Enter times in this device’s local timezone. They are stored in UTC and displayed to members in Pakistan time.</p><div class="field-row">${input("startsAt", "Starts", localInput(c?.startsAt), "datetime-local", "required")}${input("endsAt", "Ends", localInput(c?.endsAt), "datetime-local", "required")}</div>${input("capacity", "Capacity", c?.capacity || 12, "number", 'required min="1" max="300"')}${checkbox("active", "Class open for booking (turn off to cancel)", c?.active ?? true)}${c ? '<p class="tiny">Cancelling a class cancels its bookings and notifies its booked members.</p>' : ""}${buttons("Save class")}</form>`,
    async (body, form) => {
      await api("admin/classes" + (c ? "/" + c.id : ""), {
        method: c ? "PATCH" : "POST",
        body: {
          ...body,
          startsAt: new Date(body.startsAt).toISOString(),
          endsAt: new Date(body.endsAt).toISOString(),
          capacity: Number(body.capacity),
          active: $('[name="active"]', form).checked,
        },
      });
      dialog.close();
      toast("Class saved.");
      await render();
    },
  );
}
function announcementDialog(a) {
  const dialog = showDialog(
    a ? "Edit announcement" : "Publish an announcement",
    `<form>${input("title", "Title", a?.title || "", "text", 'required maxlength="150"')}${textarea("message", "Your message", a?.message || "", 'required maxlength="3000"')}${checkbox("active", "Published to members", a?.active ?? true)}${buttons("Save announcement")}</form>`,
    async (body, form) => {
      await api("admin/announcements" + (a ? "/" + a.id : ""), {
        method: a ? "PATCH" : "POST",
        body: { ...body, active: $('[name="active"]', form).checked },
      });
      dialog.close();
      toast("Announcement saved.");
      await render();
    },
  );
}
window.addEventListener("hashchange", () => {
  memberPage = 1;
  memberQuery = "";
  render();
});
start();
