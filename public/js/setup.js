import { $, api, bindForm, empty } from "./common.js";
import { authShell, passwordField } from "./shells.js";
try {
  const status = await api("auth/setup-status");
  if (status.ownerExists) location.replace("/admin.html");
  else {
    authShell({
      title: "Make this your gym.",
      eyebrow: "FIRST OWNER / ONE-TIME SETUP",
      subtitle:
        "Create the owner account. The setup token comes from your server environment, not from a public signup link.",
      body: `<form id="setup-form"><label>Setup token<input type="password" name="token" required minlength="32" maxlength="500" autocomplete="off"><small>On Render, copy BOOTSTRAP_TOKEN from your service’s Environment page. Never share it with members.</small></label><label>Your full name<input name="name" required maxlength="100" autocomplete="name"></label><label>Email address<input name="email" type="email" required autocomplete="email"></label><label>Phone number<input name="phone" type="tel" required></label>${passwordField("Owner password · at least 10 characters")}<button type="submit" class="button button-full">Create owner account <span>↗</span></button><p class="form-error" role="alert"></p></form>`,
      links:
        '<a href="/index.html">Back to website</a><a href="/admin.html">Already set up? Log in</a>',
    });
    bindForm($("#setup-form"), async (b) => {
      await api("auth/setup", { method: "POST", body: b });
      location.href = "/admin.html";
    });
  }
} catch (e) {
  $("#app").innerHTML = empty("Setup is not available.", e.message);
}
