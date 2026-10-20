export const $ = (s, root = document) => root.querySelector(s);
export const $$ = (s, root = document) => [...root.querySelectorAll(s)];
export const h = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const money = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: value % 100 ? 2 : 0,
  }).format((value || 0) / 100);
export const date = (value) =>
  value
    ? new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Karachi",
      }).format(new Date(value))
    : "—";
export const time = (value) =>
  value
    ? new Intl.DateTimeFormat("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Karachi",
      }).format(new Date(value))
    : "—";
export const initials = (name) =>
  (name || "M")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
export const icon = (name, size = 20) => {
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    up: '<path d="M6 18 18 6M6 6h12v12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    home: '<path d="m3 10 9-7 9 7v10H3Zm6 10v-7h6v7"/>',
    users:
      '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3"/>',
    card: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',
    activity: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    settings: '<path d="M4 7h16M4 17h16M8 4v6m8 4v6"/>',
    bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Zm5 3h4"/>',
    logout: '<path d="M9 3H4v18h5m4-14 5 5-5 5M8 12h13"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="m14 4 6 6M4 20l5-1L21 7l-5-5L4 14Z"/>',
    shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-4 10 3 3 5-6"/>',
    weight: '<path d="M7 7v10M3 9v6m14-8v10m4-8v6M7 12h10"/>',
    upload: '<path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5"/>',
    file: '<path d="M5 2h9l5 5v15H5Zm9 0v6h5M8 12h8M8 16h8"/>',
    support:
      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.5 5.5 3.7 3.7m5.6 5.6 3.7 3.7M5.5 18.5l3.7-3.7m5.6-5.6 3.7-3.7"/>',
    chart: '<path d="M3 3v18h18M7 16v-4m5 4V8m5 8V5"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    image:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};
export function toast(message, error = false) {
  let box = $("#toast");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast";
    box.setAttribute("role", "status");
    document.body.append(box);
  }
  box.className = error ? "toast error-toast" : "toast";
  box.textContent = message;
  box.hidden = false;
  clearTimeout(window.mdToast);
  window.mdToast = setTimeout(() => (box.hidden = true), 6000);
}
export async function api(path, { method = "GET", body } = {}) {
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 20000);
  try {
    const headers = {};
    let payload;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
    const response = await fetch("/api/" + path, {
      method,
      headers,
      body: payload,
      credentials: "same-origin",
      signal: controller.signal,
    });
    if (!response.headers.get("content-type")?.includes("application/json"))
      throw Error(
        "Unexpected server response. Check that the application server is running.",
      );
    const data = await response.json();
    if (!response.ok) {
      const error = Error(data.error || "The request could not be completed.");
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError")
      throw Error("The connection timed out. Please try again.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
export function formData(form) {
  return Object.fromEntries(new FormData(form));
}
export function bindForm(form, handler) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = $('[type="submit"]', form),
      error = $(".form-error", form);
    if (button?.disabled) return;
    if (button) button.disabled = true;
    if (error) error.textContent = "";
    try {
      await handler(formData(form), form);
    } catch (e) {
      if (error) error.textContent = e.message;
      else toast(e.message, true);
    } finally {
      if (button?.isConnected) button.disabled = false;
    }
  });
}
export function showDialog(title, html, onSubmit) {
  const old = $("#dialog");
  old?.remove();
  const dialog = document.createElement("dialog");
  dialog.id = "dialog";
  dialog.innerHTML = `<div class="dialog-heading"><h2>${h(title)}</h2><button class="icon-button" data-close aria-label="Close">${icon("close")}</button></div>${html}`;
  document.body.append(dialog);
  $("[data-close]", dialog).onclick = () => dialog.close();
  dialog.addEventListener("close", () => dialog.remove());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  if (onSubmit) bindForm($("form", dialog), onSubmit);
  dialog.showModal();
  return dialog;
}
export function badge(status) {
  return `<span class="badge badge-${String(status).toLowerCase()}">${h(String(status).replaceAll("_", " "))}</span>`;
}
export const empty = (title, text = "") =>
  `<div class="empty-state">${icon("weight", 36)}<h3>${h(title)}</h3>${text ? `<p>${h(text)}</p>` : ""}</div>`;
export function setText(selector, value) {
  const el = $(selector);
  if (el) el.textContent = value;
}
export const fileHint = () =>
  `<div class="file-warning" role="alert"><strong>Open this website through its server.</strong><span>Do not double-click this HTML file. Open the project folder and run START-WINDOWS.bat, then visit http://localhost:3000.</span></div>`;
