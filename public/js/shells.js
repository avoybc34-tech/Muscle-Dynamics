import { h, icon, initials, $, $$, toast, api } from "./common.js";
export const brand = `<a class="brand" href="/index.html"><span class="brand-mark">MD</span><span class="brand-name">MUSCLE<br>DYNAMICS</span></a>`;
export function authShell({
  title,
  subtitle,
  eyebrow = "YOUR NEXT CHAPTER",
  body,
  links = "",
  art = "SHOW UP.<br><span>GET STRONGER.</span>",
}) {
  document.body.className = "";
  $("#app").innerHTML =
    `<main class="auth-page"><section class="auth-art">${brand}<div><span class="eyebrow">STRONGER THAN YESTERDAY.</span><h1>${art}</h1><p>Your training. Your routine. A member space that keeps it all together.</p></div><small>MUSCLE DYNAMICS / BUILT AROUND YOUR TRAINING</small></section><section class="auth-form-side"><div class="auth-box"><span class="eyebrow">${h(eyebrow)}</span><h1>${h(title)}</h1><p>${h(subtitle)}</p>${body}<div class="auth-links">${links}</div></div></section></main>`;
  $$("[data-toggle-password]").forEach(
    (b) =>
      (b.onclick = () => {
        const input = b.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        b.textContent = input.type === "password" ? "Show" : "Hide";
      }),
  );
}
export function passwordField(label = "Password", name = "password", min = 10) {
  return `<label>${h(label)}<div class="password-wrap"><input name="${name}" type="password" required minlength="${min}" maxlength="128" autocomplete="${name === "currentPassword" ? "current-password" : "new-password"}"><button type="button" data-toggle-password>Show</button></div></label>`;
}
export function shell({ user, items, current, admin = false, onLogout }) {
  document.body.className = "app-body";
  $("#app").innerHTML =
    `<div class="app-shell"><aside class="sidebar">${brand}<span class="sidebar-label">${admin ? "GYM OPERATIONS" : "YOUR MEMBER SPACE"}</span><nav class="sidebar-nav">${items.map(([id, label, i]) => `<a href="#${id}" class="${current === id ? "active" : ""}">${icon(i)}${h(label)}</a>`).join("")}</nav><div class="sidebar-bottom"><a href="/index.html">${icon("up", 16)} View website</a>${!admin && user.role !== "MEMBER" ? `<a href="/admin.html">${icon("settings", 16)} Admin workspace</a>` : ""}<button id="logout">${icon("logout", 16)} Log out</button></div></aside><div class="workspace"><header class="workspace-header"><a class="brand mobile-header-brand" href="/index.html"><span class="brand-mark">MD</span><span class="brand-name">MUSCLE<br>DYNAMICS</span></a><span>${admin ? "A little structure. A stronger gym." : "Small steps. Consistent effort. Real progress."}</span>${admin ? `<select id="admin-mobile-route" class="admin-menu-select" style="display:none" aria-label="Admin section">${items.map(([id, label]) => `<option value="${id}" ${id === current ? "selected" : ""}>${h(label)}</option>`).join("")}</select>` : ""}<div class="header-user"><span>${h(user.name)}</span><span class="avatar">${h(initials(user.name))}</span></div></header><main id="content" class="content"></main></div></div>${
      !admin
        ? `<nav class="app-mobile-nav" aria-label="Member sections">${[
            ["overview", "Home", "home"],
            ["membership", "Membership", "card"],
            ["classes", "Classes", "calendar"],
            ["progress", "Progress", "activity"],
            ["profile", "Profile", "user"],
          ]
            .map(
              ([id, label, i]) =>
                `<a href="#${id}" class="${current === id ? "active" : ""}">${icon(i)}<span>${label}</span></a>`,
            )
            .join("")}</nav>`
        : ""
    }`;
  $("#logout").onclick = onLogout;
  if ($("#admin-mobile-route"))
    $("#admin-mobile-route").onchange = (e) => (location.hash = e.target.value);
}
export const heading = (label, title, subtitle = "", action = "") =>
  `<div class="page-heading"><div><span class="eyebrow">${h(label)}</span><h1>${h(title)}</h1>${subtitle ? `<p>${h(subtitle)}</p>` : ""}</div>${action}</div>`;
export const stat = (label, value, i, sub = "") =>
  `<article class="stat-card"><div>${h(label)}${icon(i, 18)}</div><strong>${h(value)}</strong><small>${h(sub)}</small></article>`;
export function passwordToggles(root = document) {
  $$("[data-toggle-password]", root).forEach(
    (b) =>
      (b.onclick = () => {
        const input = b.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        b.textContent = input.type === "password" ? "Show" : "Hide";
      }),
  );
}
export async function logout() {
  try {
    await api("auth/logout", { method: "POST", body: {} });
    location.reload();
  } catch (e) {
    toast(e.message, true);
  }
}
