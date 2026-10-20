import { api, setText } from "./common.js";
async function load() {
  try {
    const s = await api("config"),
      privacy = location.hash !== "#terms";
    document.title =
      (privacy ? "Privacy notice" : "Membership terms") + " — " + s.gymName;
    setText("#gym-name", s.gymName.toUpperCase());
    setText("#legal-title", privacy ? "Privacy notice" : "Membership terms");
    setText(
      "#legal-copy",
      (privacy ? s.privacyText : s.termsText) ||
        "The gym has not published this policy yet. Contact the owner before joining or submitting a payment.",
    );
  } catch (e) {
    setText("#legal-copy", e.message);
  }
}
window.addEventListener("hashchange", load);
load();
