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
  setText,
} from "./common.js";
setText("#year", new Date().getFullYear());
$("#menu-button").onclick = () => {
  const open = $("#navigation").classList.toggle("open");
  $("#menu-button").setAttribute("aria-expanded", String(open));
};
$$("#navigation a").forEach(
  (a) =>
    (a.onclick = () => {
      $("#navigation").classList.remove("open");
      $("#menu-button").setAttribute("aria-expanded", "false");
    }),
);
async function load() {
  const [config, plans, classes, trainers] = await Promise.all([
    api("config"),
    api("plans"),
    api("classes"),
    api("trainers"),
  ]);
  document.title = config.gymName + " — " + config.tagline;
  setText("#hero-title", config.heroTitle.toUpperCase());
  setText("#hero-subtitle", config.heroSubtitle);
  if (config.about) setText("#about-copy", config.about);
  setText("#footer-tagline", config.tagline);
  setText("#footer-name", config.gymName);
  if (config.heroPhotoId) {
    $("#hero-image").src = "/api/files/" + config.heroPhotoId;
    $("#hero-image").alt = config.gymName + " training space";
  }
  $("#plans-grid").innerHTML = plans.length
    ? plans
        .map(
          (p, i) =>
            `<article class="plan-card ${p.highlight ? "highlight" : ""}">${p.highlight ? '<span class="plan-highlight">THE OWNER’S PICK</span>' : ""}<span class="plan-number">0${i + 1} / MEMBERSHIP</span><h3>${h(p.name)}</h3><p>${h(p.tagline)}</p><div class="plan-price">${money(p.pricePaise)}<small>/ ${p.durationDays} days</small></div><ul>${p.features.map((f) => `<li>${icon("check", 16)}${h(f)}</li>`).join("")}</ul><a class="button ${p.highlight ? "" : "button-outline"}" href="/member.html#plans" data-plan="${p.id}">Choose ${h(p.name)} <span>↗</span></a></article>`,
        )
        .join("")
    : empty(
        "Your plan starts here.",
        "Membership options are being prepared. Contact the gym to discuss joining.",
      );
  $$("[data-plan]").forEach((a) =>
    a.addEventListener("click", () => {
      try {
        sessionStorage.setItem("md_plan", a.dataset.plan);
      } catch {}
    }),
  );
  $("#classes-preview").innerHTML = classes.length
    ? classes
        .slice(0, 3)
        .map(
          (c) =>
            `<article><div class="class-date">${date(c.startsAt)}<span>${h(c.trainer.name)}</span></div><h3>${h(c.title)}</h3><p>${time(c.startsAt)} · ${c.capacity - c._count.bookings} spots available</p><a href="/member.html#classes" class="inline-link">See class ${icon("up", 17)}</a></article>`,
        )
        .join("")
    : empty(
        "A routine worth showing up for.",
        "The gym will publish its class schedule here.",
      );
  if (trainers.length) {
    $("#trainers-section").hidden = false;
    $("#trainer-grid").innerHTML = trainers
      .map(
        (t) =>
          `<article>${t.photoId ? `<img src="/api/files/${t.photoId}" alt="${h(t.name)}">` : `<div class="trainer-initial">${h(t.name[0])}</div>`}<h3>${h(t.name)}</h3><span>${h(t.specialty)}</span><p>${h(t.bio)}</p></article>`,
      )
      .join("");
  }
  if (config.gallery.length) {
    $("#gallery-section").hidden = false;
    $("#gallery-grid").innerHTML = config.gallery
      .map(
        (f) =>
          `<figure><img src="/api/files/${f.id}" alt="${h(f.caption || config.gymName)}" loading="lazy"><figcaption>${h(f.caption)}</figcaption></figure>`,
      )
      .join("");
  }
  const contacts = [
    ["pin", "Find us", config.address],
    ["clock", "Opening hours", config.hours],
    ["support", "Talk to the gym", config.phone],
    ["mail", "Email", config.email],
  ].filter((x) => x[2]);
  if (contacts.length)
    $("#contact-details").innerHTML = contacts
      .map(
        ([i, l, v]) =>
          `<div>${icon(i, 21)}<div><span>${l}</span><p>${h(v)}</p></div></div>`,
      )
      .join("");
  try {
    const user = await api("me");
    setText(
      "#account-link",
      user.role === "MEMBER" ? "My membership" : "My workspace",
    );
    $("#account-link").href =
      user.role === "MEMBER" ? "/member.html" : "/admin.html";
  } catch {}
}
load().catch((error) => {
  $("#plans-grid").innerHTML = empty(
    "We couldn’t load the gym information.",
    error.message,
  );
});
