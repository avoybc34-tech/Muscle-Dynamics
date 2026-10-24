export async function notify(
  db,
  {
    userId,
    eventKey,
    title,
    message,
    category = "membership",
    route = "Membership",
  },
) {
  const n = await db.notification.upsert({
    where: { eventKey },
    update: {},
    create: { userId, eventKey, title, message, category, route },
  });
  await db.pushJob.upsert({
    where: { notificationId: n.id },
    update: {},
    create: { notificationId: n.id },
  });
  return n;
}
export async function broadcast(db, { eventKey, ...message }) {
  let cursor;
  do {
    const users = await db.user.findMany({
      where: { active: true },
      select: { id: true },
      take: 100,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { id: "asc" },
    });
    for (const u of users)
      await notify(db, {
        ...message,
        userId: u.id,
        eventKey: eventKey + ":" + u.id,
      });
    cursor = users.length === 100 ? users.at(-1).id : null;
  } while (cursor);
}
