import nodemailer from "nodemailer";
export const mailReady = () =>
  Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM);
export async function sendReset(email, resetToken) {
  if (!mailReady()) throw Error("Mail not configured");
  const port = Number(process.env.SMTP_PORT || 587);
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true",
    requireTLS: process.env.SMTP_SECURE !== "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
  await t.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Reset your Muscle Dynamics password",
    text: `Open the Muscle Dynamics app and choose Reset password. Paste this one-time code:\n\n${resetToken}\n\nIt expires in 30 minutes. If you did not request this, ignore this message. Never share the code.\n\nOn a device with the app installed: muscle-dynamics://reset?token=${resetToken}`,
  });
}
