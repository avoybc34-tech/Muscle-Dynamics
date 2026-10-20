import { HttpError, audit } from "./security.js";
import { periodFor, membershipStatus, reference } from "./domain.js";
export async function activatePayment(tx, payment, actor, note) {
  const current = await tx.membership.findUnique({
    where: { userId: payment.userId },
  });
  if (
    current &&
    membershipStatus(current) === "ACTIVE" &&
    current.planId !== payment.planId &&
    actor.role !== "OWNER"
  )
    throw new HttpError(
      403,
      "Only the owner can approve a change to an active plan.",
    );
  const period = periodFor(current, payment.planId, payment.durationDays);
  const fields = {
    planId: payment.planId,
    planName: payment.planName,
    startsAt: period.startsAt,
    endsAt: period.endsAt,
    cancelledAt: null,
  };
  const membership = await tx.membership.upsert({
    where: { userId: payment.userId },
    create: { userId: payment.userId, ...fields },
    update: fields,
  });
  await tx.subscription.create({
    data: {
      userId: payment.userId,
      planId: payment.planId,
      paymentId: payment.id,
      startsAt: period.periodStartsAt,
      endsAt: period.endsAt,
    },
  });
  await tx.notification.create({
    data: {
      userId: payment.userId,
      title: "Payment approved",
      message: `${reference(payment.refNo)} has been approved. Your ${payment.planName} membership is valid until ${period.endsAt.toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })}.`,
    },
  });
  await audit(tx, actor, "PAYMENT_APPROVED", "PaymentRequest", payment.id, {
    reference: reference(payment.refNo),
    amountPaise: payment.amountPaise,
    note,
    membershipId: membership.id,
  });
  return membership;
}
