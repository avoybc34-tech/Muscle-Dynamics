module.exports = [
(()=>{"use strict";return[
"[project]/app/api/[...path]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function GET(req, ctx) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApi"])(req, (await ctx.params).path);
}
async function POST(req, ctx) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApi"])(req, (await ctx.params).path);
}
async function PATCH(req, ctx) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApi"])(req, (await ctx.params).path);
}
async function DELETE(req, ctx) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleApi"])(req, (await ctx.params).path);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/api.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "handleApi",
    ()=>handleApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .enum>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .boolean>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .literal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .array>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/files.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/payments.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const R = (data, status = 200, headers = {})=>new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            ...headers
        }
    });
const uuid = (value)=>{
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"].safeParse(value).success) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Invalid record ID.");
    return value;
};
const staff = [
    "OWNER",
    "STAFF"
], owner = [
    "OWNER"
];
const detail = (p)=>({
        ...p,
        reference: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reference"])(p.refNo)
    });
const memberData = (u)=>({
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publicUser"])(u),
        membership: u.membership ? {
            ...u.membership,
            status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["membershipStatus"])(u.membership)
        } : null
    });
async function settings() {
    const row = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].setting.findUnique({
        where: {
            key: "website"
        }
    });
    return {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaults"],
        ...row?.value || {}
    };
}
const ready = (s)=>!!(s.address && s.phone && s.email && s.privacyText.length >= 50 && s.termsText.length >= 50);
async function publicFileIds(ids) {
    if (!ids.length) return;
    const n = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].storedFile.count({
        where: {
            id: {
                in: ids
            },
            kind: "PUBLIC"
        }
    });
    if (n !== new Set(ids).size) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Choose images from the public media library.");
}
const textSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(1000);
async function handleApi(req, parts) {
    const method = req.method, url = new URL(req.url), p = parts.join("/");
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkOrigin"])(req);
        if (method === "GET" && p === "health") {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$queryRaw`SELECT 1`;
            return R({
                ok: true,
                service: "Muscle Dynamics"
            });
        }
        if (method === "GET" && p === "config") {
            const s = await settings();
            const { paymentInstructions, ...publicSettings } = s;
            return R({
                ...publicSettings,
                registrationOpen: ready(s)
            });
        }
        if (method === "GET" && p === "auth/setup-status") return R({
            ownerExists: !!await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findFirst({
                where: {
                    role: "OWNER"
                },
                select: {
                    id: true
                }
            })
        });
        if (method === "POST" && p === "auth/setup") {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["limit"])(req, "setup", 10);
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                token: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(32).max(500),
                name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(100),
                email: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailSchema"],
                phone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["phoneSchema"],
                password: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passwordSchema"]
            }));
            if (!process.env.BOOTSTRAP_TOKEN || process.env.BOOTSTRAP_TOKEN.startsWith("REPLACE_") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["digest"])(body.token) !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["digest"])(process.env.BOOTSTRAP_TOKEN)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "The setup token is incorrect or has not been configured.");
            const hashed = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(body.password);
            const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                if (await tx.user.findFirst({
                    where: {
                        role: "OWNER"
                    }
                })) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "An owner account already exists. Log in instead.");
                await tx.setting.create({
                    data: {
                        key: "owner-created",
                        value: true
                    }
                });
                const u = await tx.user.create({
                    data: {
                        name: body.name,
                        email: body.email,
                        phone: body.phone,
                        passwordHash: hashed,
                        role: "OWNER"
                    }
                });
                await tx.setting.upsert({
                    where: {
                        key: "website"
                    },
                    update: {},
                    create: {
                        key: "website",
                        value: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaults"]
                    }
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "OWNER_CREATED", "User", u.id);
                return u;
            });
            const s = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionFor"])(user);
            return R(s, 201, {
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionCookie"])(s.token)
            });
        }
        if (method === "POST" && p === "auth/register") {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["limit"])(req, "register", 20);
            const s = await settings();
            if (!ready(s)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "Member registration opens after the gym publishes its contact details, privacy notice and membership terms.");
            const body = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signupSchema"]), user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    passwordHash: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(body.password)
                }
            });
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionFor"])(user);
            return R(session, 201, {
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionCookie"])(session.token)
            });
        }
        if (method === "POST" && p === "auth/login") {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["limit"])(req, "login", 30);
            const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loginSchema"]);
            const u = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                where: {
                    email: b.email
                }
            });
            const correct = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(b.password, u?.passwordHash);
            if (!u || !correct || u.status !== "ACTIVE") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](401, "Email or password is incorrect, or this account is inactive.");
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionFor"])(u);
            return R(session, 200, {
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionCookie"])(session.token)
            });
        }
        if (method === "GET" && p === "plans") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].plan.findMany({
            where: {
                active: true
            },
            orderBy: [
                {
                    sortOrder: "asc"
                },
                {
                    createdAt: "asc"
                }
            ]
        }));
        if (method === "GET" && p === "trainers") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].trainer.findMany({
            where: {
                active: true
            },
            orderBy: {
                name: "asc"
            }
        }));
        if (method === "GET" && p === "classes") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].gymClass.findMany({
            where: {
                active: true,
                startsAt: {
                    gt: new Date()
                }
            },
            include: {
                trainer: true,
                _count: {
                    select: {
                        bookings: {
                            where: {
                                status: "CONFIRMED"
                            }
                        }
                    }
                }
            },
            orderBy: {
                startsAt: "asc"
            },
            take: 60
        }));
        if (method === "GET" && parts[0] === "files" && parts.length === 2) {
            const f = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].storedFile.findUnique({
                where: {
                    id: uuid(parts[1])
                }
            });
            if (!f) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Image not found.");
            if (f.kind === "PROOF") {
                const u = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticate"])(req);
                if (u.role !== "OWNER" && u.id !== f.userId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "This payment proof is private.");
            }
            const image = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadImage"])(f.storageKey);
            return new Response(image, {
                headers: {
                    "Content-Type": "image/jpeg",
                    "Content-Length": String(image.length),
                    "X-Content-Type-Options": "nosniff",
                    "Cache-Control": f.kind === "PROOF" ? "private, no-store" : "public, max-age=3600"
                }
            });
        }
        const u = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticate"])(req, p.startsWith("admin/") ? staff : undefined);
        if (method === "POST" && p === "auth/logout") {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].session.deleteMany({
                where: {
                    userId: u.id
                }
            });
            return R({
                ok: true
            }, 200, {
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionCookie"])("", true)
            });
        }
        if (method === "GET" && p === "me") return R((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publicUser"])(u));
        if (method === "PATCH" && p === "profile") {
            const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["profileSchema"]);
            return R((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publicUser"])(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: u.id
                },
                data: b
            })));
        }
        if (method === "POST" && p === "password") {
            const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                currentPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(128),
                newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passwordSchema"]
            }));
            if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(b.currentPassword, u.passwordHash)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Your current password is incorrect.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                await tx.user.update({
                    where: {
                        id: u.id
                    },
                    data: {
                        passwordHash: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(b.newPassword)
                    }
                });
                await tx.session.deleteMany({
                    where: {
                        userId: u.id
                    }
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "PASSWORD_CHANGED", "User", u.id);
            });
            return R({
                message: "Password changed. Please log in again."
            }, 200, {
                "Set-Cookie": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionCookie"])("", true)
            });
        }
        if (method === "GET" && p === "dashboard") {
            const [m, payments, progress, notifications, attendance, bookings, tickets, announcements] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].membership.findUnique({
                    where: {
                        userId: u.id
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.findMany({
                    where: {
                        userId: u.id
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 50
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].progressLog.findMany({
                    where: {
                        userId: u.id
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 100
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].notification.findMany({
                    where: {
                        userId: u.id
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 50
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].attendance.findMany({
                    where: {
                        userId: u.id
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 60
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].booking.findMany({
                    where: {
                        userId: u.id,
                        status: "CONFIRMED",
                        gymClass: {
                            endsAt: {
                                gt: new Date()
                            }
                        }
                    },
                    include: {
                        gymClass: {
                            include: {
                                trainer: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].supportTicket.findMany({
                    where: {
                        userId: u.id
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 30
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].announcement.findMany({
                    where: {
                        active: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 10
                })
            ]);
            return R({
                user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publicUser"])(u),
                membership: m ? {
                    ...m,
                    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["membershipStatus"])(m)
                } : null,
                payments: payments.map(detail),
                progress,
                notifications,
                attendance,
                bookings,
                tickets,
                announcements
            });
        }
        if (method === "GET" && p === "payment-options") {
            const s = await settings();
            return R({
                instructions: s.paymentInstructions,
                whatsapp: s.whatsapp,
                accounts: await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentAccount.findMany({
                    where: {
                        active: true
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                })
            });
        }
        if (method === "POST" && p === "payments") {
            const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                planId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"],
                accountId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"]
            }));
            const s = await settings();
            if (!ready(s) || s.paymentInstructions.length < 10) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "The gym has not finished configuring payment instructions.");
            const [plan, account] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].plan.findFirst({
                    where: {
                        id: b.planId,
                        active: true
                    }
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentAccount.findFirst({
                    where: {
                        id: b.accountId,
                        active: true
                    }
                })
            ]);
            if (!plan || !account) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Choose an available plan and payment method.");
            const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.count({
                where: {
                    userId: u.id,
                    status: {
                        in: [
                            "DRAFT",
                            "PENDING"
                        ]
                    }
                }
            });
            if (existing >= 5) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "You already have several open requests. Contact the gym before creating another.");
            return R(detail(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.create({
                data: {
                    userId: u.id,
                    planId: plan.id,
                    accountId: account.id,
                    planName: plan.name,
                    durationDays: plan.durationDays,
                    amountPaise: plan.pricePaise,
                    accountSnapshot: {
                        label: account.label,
                        type: account.type,
                        bankName: account.bankName,
                        accountName: account.accountName,
                        accountNumber: account.accountNumber,
                        iban: account.iban,
                        note: account.note
                    }
                }
            })), 201);
        }
        if (parts[0] === "payments" && parts.length === 3 && method === "POST") {
            const id = uuid(parts[1]), payment = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.findUnique({
                where: {
                    id
                }
            });
            if (!payment || payment.userId !== u.id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Payment request not found.");
            if (payment.status !== "DRAFT") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "Submitted requests cannot be changed.");
            if (parts[2] === "proof") {
                const image = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readImage"])(req), key = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveImage"])(image);
                let saved;
                try {
                    saved = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                        const latest = await tx.paymentRequest.findUnique({
                            where: {
                                id
                            }
                        });
                        if (latest.status !== "DRAFT") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This request has already been submitted.");
                        const f = await tx.storedFile.create({
                            data: {
                                userId: u.id,
                                storageKey: key,
                                kind: "PROOF",
                                bytes: image.length
                            }
                        });
                        await tx.paymentRequest.update({
                            where: {
                                id
                            },
                            data: {
                                proofId: f.id
                            }
                        });
                        return f;
                    });
                } catch (e) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["removeFile"])(key);
                    throw e;
                }
                return R({
                    proofId: saved.id,
                    url: "/api/files/" + saved.id
                }, 201);
            }
            if (parts[2] === "submit") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    proofNote: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(3).max(500)
                }));
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const latest = await tx.paymentRequest.findUnique({
                        where: {
                            id
                        }
                    });
                    if (latest.status !== "DRAFT") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This request has already been submitted.");
                    if (!latest.proofId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Upload a payment receipt before submitting.");
                    const updated = await tx.paymentRequest.update({
                        where: {
                            id
                        },
                        data: {
                            status: "PENDING",
                            submittedAt: new Date(),
                            proofNote: b.proofNote
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "PAYMENT_SUBMITTED", "PaymentRequest", id);
                    return updated;
                });
                return R(detail(result));
            }
        }
        if (method === "POST" && p === "progress") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].progressLog.create({
            data: {
                ...await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["progressSchema"]),
                userId: u.id
            }
        }), 201);
        if (method === "POST" && p === "notifications/read") {
            const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                ids: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"]).max(100)
            }));
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].notification.updateMany({
                where: {
                    id: {
                        in: b.ids
                    },
                    userId: u.id
                },
                data: {
                    readAt: new Date()
                }
            });
            return R({
                ok: true
            });
        }
        if (method === "POST" && p === "support") {
            const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                subject: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(3).max(150),
                message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(5).max(5000)
            }));
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["limit"])(req, "support", 30);
            return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].supportTicket.create({
                data: {
                    ...b,
                    userId: u.id
                }
            }), 201);
        }
        if (parts[0] === "classes" && parts.length === 3 && parts[2] === "book" && method === "POST") {
            const id = uuid(parts[1]);
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                await tx.$queryRaw`SELECT id FROM GymClass WHERE id=${id} FOR UPDATE`;
                const cls = await tx.gymClass.findUnique({
                    where: {
                        id
                    }
                });
                if (!cls || !cls.active || cls.startsAt <= new Date()) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This class is not open for booking.");
                const m = await tx.membership.findUnique({
                    where: {
                        userId: u.id
                    }
                });
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["membershipStatus"])(m) !== "ACTIVE" || m.endsAt < cls.startsAt) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "You need a membership covering the class date.");
                const existing = await tx.booking.findUnique({
                    where: {
                        userId_classId: {
                            userId: u.id,
                            classId: id
                        }
                    }
                });
                if (existing?.status === "CONFIRMED") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "You are already booked into this class.");
                const count = await tx.booking.count({
                    where: {
                        classId: id,
                        status: "CONFIRMED"
                    }
                });
                if (count >= cls.capacity) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This class is full.");
                return tx.booking.upsert({
                    where: {
                        userId_classId: {
                            userId: u.id,
                            classId: id
                        }
                    },
                    create: {
                        userId: u.id,
                        classId: id
                    },
                    update: {
                        status: "CONFIRMED"
                    }
                });
            });
            return R(result, 201);
        }
        if (parts[0] === "bookings" && parts.length === 2 && method === "DELETE") {
            const b = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].booking.findUnique({
                where: {
                    id: uuid(parts[1])
                },
                include: {
                    gymClass: true
                }
            });
            if (!b || b.userId !== u.id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Booking not found.");
            if (b.gymClass.startsAt <= new Date()) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "Past classes cannot be cancelled here.");
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].booking.update({
                where: {
                    id: b.id
                },
                data: {
                    status: "CANCELLED"
                }
            });
            return R({
                ok: true
            });
        }
        // Staff may access member operations. All financial, role, content and configuration changes are owner-only.
        if (p.startsWith("admin/")) {
            const isOwner = u.role === "OWNER";
            if (method === "GET" && p === "admin/overview") {
                const now = new Date(), today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["karachiDay"])(), month = new Date(today.slice(0, 7) + "-01T00:00:00+05:00");
                const [members, active, expiring, visits, tickets] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.count({
                        where: {
                            role: "MEMBER"
                        }
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].membership.count({
                        where: {
                            cancelledAt: null,
                            endsAt: {
                                gt: now
                            },
                            user: {
                                status: "ACTIVE"
                            }
                        }
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].membership.count({
                        where: {
                            cancelledAt: null,
                            endsAt: {
                                gt: now,
                                lte: new Date(Date.now() + 7 * 86400000)
                            }
                        }
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].attendance.count({
                        where: {
                            day: today
                        }
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].supportTicket.count({
                        where: {
                            status: "OPEN"
                        }
                    })
                ]);
                const finances = isOwner ? {
                    pending: await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.count({
                        where: {
                            status: "PENDING"
                        }
                    }),
                    monthRevenuePaise: (await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.aggregate({
                        where: {
                            status: "APPROVED",
                            reviewedAt: {
                                gte: month
                            }
                        },
                        _sum: {
                            amountPaise: true
                        }
                    }))._sum.amountPaise || 0
                } : {};
                const recent = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findMany({
                    where: {
                        role: "MEMBER"
                    },
                    include: {
                        membership: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 6
                });
                return R({
                    members,
                    active,
                    expiring,
                    visits,
                    tickets,
                    ...finances,
                    recent: recent.map(memberData),
                    setup: {
                        settings: ready(await settings()),
                        plans: await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].plan.count({
                            where: {
                                active: true
                            }
                        }),
                        accounts: await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentAccount.count({
                            where: {
                                active: true
                            }
                        })
                    }
                });
            }
            if (method === "GET" && p === "admin/members") {
                const q = (url.searchParams.get("q") || "").slice(0, 100), page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
                const where = {
                    ...isOwner && url.searchParams.get("roles") === "all" ? {} : {
                        role: "MEMBER"
                    },
                    ...q ? {
                        OR: [
                            {
                                name: {
                                    contains: q
                                }
                            },
                            {
                                email: {
                                    contains: q
                                }
                            },
                            {
                                phone: {
                                    contains: q
                                }
                            }
                        ]
                    } : {}
                };
                const [rows, total] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findMany({
                        where,
                        include: {
                            membership: true
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        skip: (page - 1) * 30,
                        take: 30
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.count({
                        where
                    })
                ]);
                return R({
                    rows: rows.map(memberData),
                    total,
                    page
                });
            }
            if (parts[1] === "members" && parts.length === 3) {
                const id = uuid(parts[2]);
                const target = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                    where: {
                        id
                    },
                    include: {
                        membership: true
                    }
                });
                if (!target || !isOwner && target.role !== "MEMBER") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Member not found.");
                if (method === "GET") return R({
                    user: memberData(target),
                    payments: isOwner ? (await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.findMany({
                        where: {
                            userId: id
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        take: 50
                    })).map(detail) : [],
                    attendance: await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].attendance.findMany({
                        where: {
                            userId: id
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        take: 60
                    })
                });
                if (method === "PATCH") {
                    if (!isOwner) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "Only the owner can edit member accounts.");
                    const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["profileSchema"].extend({
                        role: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
                            "MEMBER",
                            "STAFF"
                        ]).optional(),
                        status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
                            "ACTIVE",
                            "SUSPENDED"
                        ]).optional()
                    }));
                    if (target.role === "OWNER" && (b.role || b.status === "SUSPENDED")) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "The owner account cannot be demoted or suspended here.");
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                        const changed = await tx.user.update({
                            where: {
                                id
                            },
                            data: b
                        });
                        if (b.status === "SUSPENDED" || b.role) await tx.session.deleteMany({
                            where: {
                                userId: id
                            }
                        });
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "MEMBER_UPDATED", "User", id, {
                            role: b.role || target.role,
                            status: b.status || target.status
                        });
                        return changed;
                    });
                    return R((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publicUser"])(result));
                }
            }
            if (method === "POST" && p === "admin/attendance") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"]
                }));
                const m = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].membership.findUnique({
                    where: {
                        userId: b.userId
                    },
                    include: {
                        user: true
                    }
                });
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["membershipStatus"])(m) !== "ACTIVE" || m.user.status !== "ACTIVE") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This member does not have active gym access.");
                const row = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].attendance.upsert({
                    where: {
                        userId_day: {
                            userId: b.userId,
                            day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["karachiDay"])()
                        }
                    },
                    create: {
                        userId: b.userId,
                        recordedById: u.id,
                        day: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["karachiDay"])()
                    },
                    update: {}
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"], u, "CHECK_IN", "Attendance", row.id);
                return R(row, 201);
            }
            if (method === "GET" && p === "admin/attendance") {
                const day = url.searchParams.get("day") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["karachiDay"])();
                if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Use YYYY-MM-DD.");
                return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].attendance.findMany({
                    where: {
                        day
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 500
                }));
            }
            if (method === "GET" && p === "admin/classes") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].gymClass.findMany({
                include: {
                    trainer: true,
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: "CONFIRMED"
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    startsAt: "desc"
                },
                take: 150
            }));
            if (method === "GET" && p === "admin/trainers") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].trainer.findMany({
                orderBy: {
                    name: "asc"
                }
            }));
            if (method === "GET" && p === "admin/support") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].supportTicket.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 100
            }));
            if (method === "PATCH" && parts[1] === "support" && parts.length === 3) {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    reply: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(5000),
                    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
                        "OPEN",
                        "RESOLVED"
                    ])
                }));
                const ticket = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].supportTicket.findUnique({
                    where: {
                        id: uuid(parts[2])
                    }
                });
                if (!ticket) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Ticket not found.");
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const t = await tx.supportTicket.update({
                        where: {
                            id: ticket.id
                        },
                        data: b
                    });
                    await tx.notification.create({
                        data: {
                            userId: ticket.userId,
                            title: "A reply from your gym",
                            message: b.reply
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "SUPPORT_REPLIED", "SupportTicket", t.id);
                    return t;
                }));
            }
            if (method === "GET" && parts[1] === "classes" && parts.length === 4 && parts[3] === "bookings") {
                const id = uuid(parts[2]);
                return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].booking.findMany({
                    where: {
                        classId: id,
                        status: "CONFIRMED"
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }));
            }
            if (!isOwner) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "Only the owner can access this section.");
            if (method === "GET" && p === "admin/settings") return R(await settings());
            if (method === "PATCH" && p === "admin/settings") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settingsSchema"]);
                await publicFileIds([
                    b.heroPhotoId,
                    ...b.gallery.map((f)=>f.id)
                ].filter(Boolean));
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const row = await tx.setting.upsert({
                        where: {
                            key: "website"
                        },
                        create: {
                            key: "website",
                            value: b
                        },
                        update: {
                            value: b
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "SETTINGS_UPDATED", "Setting", "website");
                    return row.value;
                }));
            }
            if (method === "GET" && p === "admin/plans") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].plan.findMany({
                orderBy: [
                    {
                        sortOrder: "asc"
                    },
                    {
                        createdAt: "asc"
                    }
                ]
            }));
            if (parts[1] === "plans" && [
                "POST",
                "PATCH"
            ].includes(method)) {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planSchema"]);
                const { price, ...fields } = b;
                const data = {
                    ...fields,
                    pricePaise: Math.round(price * 100),
                    currency: "PKR"
                };
                const id = parts[2] ? uuid(parts[2]) : null;
                if (method === "PATCH" && !id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Choose a plan.");
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const row = id ? await tx.plan.update({
                        where: {
                            id
                        },
                        data
                    }) : await tx.plan.create({
                        data
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, id ? "PLAN_UPDATED" : "PLAN_CREATED", "Plan", row.id);
                    return row;
                }), id ? 200 : 201);
            }
            if (method === "GET" && p === "admin/accounts") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentAccount.findMany({
                orderBy: {
                    createdAt: "asc"
                }
            }));
            if (parts[1] === "accounts" && [
                "POST",
                "PATCH"
            ].includes(method)) {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["accountSchema"]);
                const id = parts[2] ? uuid(parts[2]) : null;
                if (method === "PATCH" && !id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Choose an account.");
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const row = id ? await tx.paymentAccount.update({
                        where: {
                            id
                        },
                        data: b
                    }) : await tx.paymentAccount.create({
                        data: b
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "PAYMENT_ACCOUNT_SAVED", "PaymentAccount", row.id);
                    return row;
                }), id ? 200 : 201);
            }
            if (method === "GET" && p === "admin/payments") {
                const filter = url.searchParams.get("status") || "PENDING";
                if (![
                    "DRAFT",
                    "PENDING",
                    "APPROVED",
                    "REJECTED",
                    "ALL"
                ].includes(filter)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Invalid payment filter.");
                return R((await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.findMany({
                    where: filter === "ALL" ? {} : {
                        status: filter
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 150
                })).map(detail));
            }
            if (method === "POST" && parts[1] === "payments" && parts.length === 4 && parts[3] === "review") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    decision: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
                        "APPROVED",
                        "REJECTED"
                    ]),
                    note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(3).max(1000),
                    fundsVerified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false)
                }));
                if (b.decision === "APPROVED" && !b.fundsVerified) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Check the actual receiving account and confirm the funds before approval.");
                const id = uuid(parts[2]);
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    await tx.$queryRaw`SELECT id FROM PaymentRequest WHERE id=${id} FOR UPDATE`;
                    const payment = await tx.paymentRequest.findUnique({
                        where: {
                            id
                        },
                        include: {
                            user: true
                        }
                    });
                    if (!payment) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Payment request not found.");
                    if (payment.status !== "PENDING") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This request has already been reviewed or has not been submitted.");
                    if (payment.user.status !== "ACTIVE") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "This account is inactive.");
                    if (payment.userId === u.id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "You cannot review your own payment request.");
                    const updated = await tx.paymentRequest.update({
                        where: {
                            id
                        },
                        data: {
                            status: b.decision,
                            adminNote: b.note,
                            reviewedById: u.id,
                            reviewedAt: new Date()
                        }
                    });
                    if (b.decision === "APPROVED") await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activatePayment"])(tx, payment, u, b.note);
                    else {
                        await tx.notification.create({
                            data: {
                                userId: payment.userId,
                                title: "Payment needs attention",
                                message: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reference"])(payment.refNo)} was rejected: ${b.note}`
                            }
                        });
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "PAYMENT_REJECTED", "PaymentRequest", id, {
                            note: b.note
                        });
                    }
                    return detail(updated);
                }));
            }
            if (method === "POST" && p === "admin/payments/cash") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    userId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"],
                    planId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"],
                    accountId: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["idSchema"],
                    note: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(5).max(1000),
                    fundsVerified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(true)
                }));
                if (b.userId === u.id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "You cannot record your own payment.");
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const [member, plan, account] = await Promise.all([
                        tx.user.findUnique({
                            where: {
                                id: b.userId
                            }
                        }),
                        tx.plan.findFirst({
                            where: {
                                id: b.planId,
                                active: true
                            }
                        }),
                        tx.paymentAccount.findFirst({
                            where: {
                                id: b.accountId,
                                active: true,
                                type: "CASH"
                            }
                        })
                    ]);
                    if (!member || member.status !== "ACTIVE" || !plan || !account) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Select an active member, plan and cash payment method.");
                    const payment = await tx.paymentRequest.create({
                        data: {
                            userId: b.userId,
                            planId: plan.id,
                            accountId: account.id,
                            planName: plan.name,
                            durationDays: plan.durationDays,
                            amountPaise: plan.pricePaise,
                            accountSnapshot: {
                                label: account.label,
                                type: "CASH",
                                note: account.note
                            },
                            proofNote: "Recorded at the gym by owner",
                            status: "APPROVED",
                            adminNote: b.note,
                            reviewedById: u.id,
                            submittedAt: new Date(),
                            reviewedAt: new Date()
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activatePayment"])(tx, payment, u, b.note);
                    return detail(payment);
                }), 201);
            }
            if (method === "POST" && parts[1] === "members" && parts.length === 4 && parts[3] === "cancel-membership") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    reason: textSchema
                }));
                const id = uuid(parts[2]);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const m = await tx.membership.update({
                        where: {
                            userId: id
                        },
                        data: {
                            cancelledAt: new Date()
                        }
                    });
                    await tx.notification.create({
                        data: {
                            userId: id,
                            title: "Membership updated",
                            message: "Your membership was cancelled: " + b.reason
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "MEMBERSHIP_CANCELLED", "Membership", m.id, {
                        reason: b.reason
                    });
                });
                return R({
                    ok: true
                });
            }
            if (method === "POST" && parts[1] === "members" && parts.length === 4 && parts[3] === "reset-password") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passwordSchema"]
                }));
                const id = uuid(parts[2]), target = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                    where: {
                        id
                    }
                });
                if (!target || target.role === "OWNER") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "Use the owner recovery procedure for owner accounts.");
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    await tx.user.update({
                        where: {
                            id
                        },
                        data: {
                            passwordHash: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(b.newPassword)
                        }
                    });
                    await tx.session.deleteMany({
                        where: {
                            userId: id
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "PASSWORD_RESET_BY_OWNER", "User", id);
                });
                return R({
                    message: "Password reset. Share it securely with the member and ask them to change it immediately."
                });
            }
            if (method === "POST" && p === "admin/staff") {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(100),
                    email: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["emailSchema"],
                    phone: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["phoneSchema"],
                    password: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["passwordSchema"]
                }));
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const row = await tx.user.create({
                        data: {
                            name: b.name,
                            email: b.email,
                            phone: b.phone,
                            passwordHash: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"])(b.password),
                            role: "STAFF"
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "STAFF_CREATED", "User", row.id);
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publicUser"])(row);
                }), 201);
            }
            if (parts[1] === "trainers" && [
                "POST",
                "PATCH"
            ].includes(method)) {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["trainerSchema"]);
                if (b.photoId) await publicFileIds([
                    b.photoId
                ]);
                const id = parts[2] ? uuid(parts[2]) : null;
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const row = id ? await tx.trainer.update({
                        where: {
                            id
                        },
                        data: b
                    }) : await tx.trainer.create({
                        data: b
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "TRAINER_SAVED", "Trainer", row.id);
                    return row;
                }), id ? 200 : 201);
            }
            if (parts[1] === "classes" && [
                "POST",
                "PATCH"
            ].includes(method)) {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classSchema"]), id = parts[2] ? uuid(parts[2]) : null;
                if (new Date(b.startsAt) < new Date() && (!id || b.active)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Create or edit a future class.");
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    if (id) {
                        await tx.$queryRaw`SELECT id FROM GymClass WHERE id=${id} FOR UPDATE`;
                        const count = await tx.booking.count({
                            where: {
                                classId: id,
                                status: "CONFIRMED"
                            }
                        });
                        if (b.capacity < count) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](409, "Capacity cannot be below the confirmed booking count.");
                    }
                    const previous = id ? await tx.gymClass.findUnique({
                        where: {
                            id
                        }
                    }) : null;
                    const row = id ? await tx.gymClass.update({
                        where: {
                            id
                        },
                        data: b
                    }) : await tx.gymClass.create({
                        data: b
                    });
                    if (id && b.active && previous && (previous.startsAt.toISOString() !== b.startsAt || previous.endsAt.toISOString() !== b.endsAt || previous.trainerId !== b.trainerId || previous.title !== b.title)) {
                        const booked = await tx.booking.findMany({
                            where: {
                                classId: id,
                                status: "CONFIRMED"
                            }
                        });
                        for (const booking of booked)await tx.notification.create({
                            data: {
                                userId: booking.userId,
                                title: "Class details updated",
                                message: `${b.title} has updated details. Check the class schedule for the latest time and trainer.`
                            }
                        });
                    }
                    if (id && !b.active) {
                        const bookings = await tx.booking.findMany({
                            where: {
                                classId: id,
                                status: "CONFIRMED"
                            }
                        });
                        await tx.booking.updateMany({
                            where: {
                                classId: id
                            },
                            data: {
                                status: "CANCELLED"
                            }
                        });
                        for (const booking of bookings)await tx.notification.create({
                            data: {
                                userId: booking.userId,
                                title: "Class cancelled",
                                message: `${b.title} was cancelled. Please contact the gym for help.`
                            }
                        });
                    }
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "CLASS_SAVED", "GymClass", row.id);
                    return row;
                }), id ? 200 : 201);
            }
            if (method === "GET" && parts[1] === "classes" && parts[3] === "bookings") {
                const id = uuid(parts[2]);
                return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].booking.findMany({
                    where: {
                        classId: id,
                        status: "CONFIRMED"
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }));
            }
            if (method === "GET" && p === "admin/announcements") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].announcement.findMany({
                orderBy: {
                    createdAt: "desc"
                },
                take: 100
            }));
            if (parts[1] === "announcements" && [
                "POST",
                "PATCH"
            ].includes(method)) {
                const b = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonBody"])(req, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
                    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(150),
                    message: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(3000),
                    active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean()
                })), id = parts[2] ? uuid(parts[2]) : null;
                return R(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transaction"])(async (tx)=>{
                    const row = id ? await tx.announcement.update({
                        where: {
                            id
                        },
                        data: b
                    }) : await tx.announcement.create({
                        data: b
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, u, "ANNOUNCEMENT_SAVED", "Announcement", row.id);
                    return row;
                }), id ? 200 : 201);
            }
            if (method === "GET" && p === "admin/media") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].storedFile.findMany({
                where: {
                    kind: "PUBLIC"
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 100
            }));
            if (method === "POST" && p === "admin/media") {
                const image = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readImage"])(req), key = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveImage"])(image);
                try {
                    const f = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].storedFile.create({
                        data: {
                            userId: u.id,
                            kind: "PUBLIC",
                            storageKey: key,
                            bytes: image.length
                        }
                    });
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"], u, "MEDIA_UPLOADED", "StoredFile", f.id);
                    return R({
                        id: f.id,
                        url: "/api/files/" + f.id
                    }, 201);
                } catch (e) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$files$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["removeFile"])(key);
                    throw e;
                }
            }
            if (method === "GET" && p === "admin/audit") return R(await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].auditLog.findMany({
                include: {
                    actor: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 200
            }));
            if (method === "GET" && p === "admin/reports") {
                const from = url.searchParams.get("from"), to = url.searchParams.get("to");
                if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from) || to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Use YYYY-MM-DD dates.");
                const where = {
                    status: "APPROVED",
                    ...from || to ? {
                        reviewedAt: {
                            ...from ? {
                                gte: new Date(from + "T00:00:00+05:00")
                            } : {},
                            ...to ? {
                                lte: new Date(to + "T23:59:59.999+05:00")
                            } : {}
                        }
                    } : {}
                };
                const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].paymentRequest.findMany({
                    where,
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        reviewedAt: "desc"
                    },
                    take: 10000
                });
                if (url.searchParams.get("format") === "csv") {
                    const csv = [
                        [
                            "Reference",
                            "Member",
                            "Email",
                            "Plan",
                            "Amount PKR",
                            "Payment method",
                            "Approved at"
                        ],
                        ...rows.map((row)=>[
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reference"])(row.refNo),
                                row.user.name,
                                row.user.email,
                                row.planName,
                                (row.amountPaise / 100).toFixed(2),
                                row.accountSnapshot.label,
                                row.reviewedAt.toISOString()
                            ])
                    ].map((row)=>row.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["csvCell"]).join(",")).join("\r\n");
                    return new Response("\uFEFF" + csv, {
                        headers: {
                            "Content-Type": "text/csv; charset=utf-8",
                            "Content-Disposition": 'attachment; filename="muscle-dynamics-payments.csv"',
                            "Cache-Control": "no-store"
                        }
                    });
                }
                return R({
                    totalPaise: rows.reduce((n, row)=>n + row.amountPaise, 0),
                    count: rows.length,
                    rows: rows.map(detail),
                    limited: rows.length === 10000
                });
            }
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "This endpoint was not found.");
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"]) return R({
            error: error.message
        }, error.status);
        if (error.code === "P2002") return R({
            error: "This record already exists. Check the email, plan slug or submitted request."
        }, 409);
        if (error.code === "P2025" || error.code === "P2003") return R({
            error: "The selected record could not be found or is still in use."
        }, 404);
        if (error.code === "P2034") return R({
            error: "Another update happened at the same time. Please retry."
        }, 409);
        console.error("API failure", error.code || error.name, error.message);
        return R({
            error: "The request could not be completed. Please try again or contact the gym."
        }, 500);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/runtime-env.js [app-route] (ecmascript)");
;
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$runtime$2d$env$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyRuntimeEnvironment"])();
const globalDb = globalThis;
const db = globalDb.mdPrisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        "error"
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalDb.mdPrisma = db;
}),
"[project]/lib/domain.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accountSchema",
    ()=>accountSchema,
    "classSchema",
    ()=>classSchema,
    "csvCell",
    ()=>csvCell,
    "defaults",
    ()=>defaults,
    "emailSchema",
    ()=>emailSchema,
    "idSchema",
    ()=>idSchema,
    "karachiDay",
    ()=>karachiDay,
    "loginSchema",
    ()=>loginSchema,
    "membershipStatus",
    ()=>membershipStatus,
    "passwordSchema",
    ()=>passwordSchema,
    "periodFor",
    ()=>periodFor,
    "phoneSchema",
    ()=>phoneSchema,
    "planSchema",
    ()=>planSchema,
    "profileSchema",
    ()=>profileSchema,
    "progressSchema",
    ()=>progressSchema,
    "reference",
    ()=>reference,
    "settingsSchema",
    ()=>settingsSchema,
    "signupSchema",
    ()=>signupSchema,
    "trainerSchema",
    ()=>trainerSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .string>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .object>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .literal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .number>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .array>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .boolean>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .enum>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .union>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$iso$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z .iso>");
;
const idSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().uuid();
const str = (n)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().min(1).max(n);
const optional = (n)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().max(n).default("");
const emailSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().toLowerCase().email().max(254);
const phoneSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().trim().transform((v)=>v.replace(/[\s()-]/g, "")).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^\+?\d{7,15}$/, "Enter a valid phone number."));
const passwordSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(10).max(128);
const signupSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    name: str(100),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    acceptTerms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal(true)
});
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    email: emailSchema,
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().min(1).max(128)
});
const profileSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    name: str(100),
    phone: phoneSchema
});
const planSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    name: str(80),
    slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$string$3e$__["z"].string().regex(/^[a-z0-9-]{2,50}$/),
    tagline: optional(160),
    price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().finite().min(1).max(1000000).refine((v)=>Math.abs(v * 100 - Math.round(v * 100)) < 0.00001, "Use at most two decimal places."),
    durationDays: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).max(730),
    features: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(str(150)).min(1).max(20),
    highlight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false),
    active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false),
    sortOrder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(1000).default(0)
});
const accountSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    label: str(80),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$enum$3e$__["z"].enum([
        "BANK",
        "EASYPAISA",
        "JAZZCASH",
        "CASH",
        "OTHER"
    ]),
    bankName: optional(100),
    accountName: optional(100),
    accountNumber: optional(80),
    iban: optional(80),
    note: optional(500),
    active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(false)
}).superRefine((v, ctx)=>{
    if (v.active && v.type !== "CASH" && (!v.accountName || !v.accountNumber && !v.iban)) ctx.addIssue({
        code: "custom",
        message: "Active transfer accounts need an account title and account number or IBAN."
    });
    if (v.active && v.type === "CASH" && !v.note) ctx.addIssue({
        code: "custom",
        message: "Add cash payment instructions before enabling this method."
    });
});
const settingsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    gymName: str(80),
    tagline: optional(160),
    heroTitle: str(100),
    heroSubtitle: optional(350),
    about: optional(3000),
    address: optional(300),
    phone: optional(40),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__["z"].union([
        emailSchema,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("")
    ]).default(""),
    whatsapp: optional(40),
    hours: optional(300),
    paymentInstructions: optional(1500),
    privacyText: optional(15000),
    termsText: optional(15000),
    nutritionText: optional(6000),
    heroPhotoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__["z"].union([
        idSchema,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("")
    ]).default(""),
    gallery: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$array$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
        id: idSchema,
        caption: optional(120)
    })).max(12).default([])
});
const trainerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    name: str(100),
    specialty: str(100),
    bio: optional(1200),
    photoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$union$3e$__["z"].union([
        idSchema,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$literal$3e$__["z"].literal("")
    ]).default(""),
    active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(true)
});
const classSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    title: str(100),
    trainerId: idSchema,
    startsAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$iso$3e$__["z"].iso.datetime(),
    endsAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$iso$3e$__["z"].iso.datetime(),
    capacity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(1).max(300),
    active: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$boolean$3e$__["z"].boolean().default(true)
}).refine((v)=>new Date(v.endsAt) > new Date(v.startsAt), "Class end must be after its start.");
const progressSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$object$3e$__["z"].object({
    weight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().min(20).max(400).nullable().default(null),
    workouts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(10).default(0),
    calories: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().int().min(0).max(15000).default(0),
    waist: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z__$2e$number$3e$__["z"].number().min(30).max(250).nullable().default(null),
    notes: optional(500)
}).refine((v)=>v.weight !== null || v.workouts > 0 || v.calories > 0 || v.waist !== null || v.notes, "Add at least one measurement or training entry.");
const defaults = {
    gymName: "Muscle Dynamics",
    tagline: "Stronger than yesterday.",
    heroTitle: "Show up.\nGet stronger.",
    heroSubtitle: "A place for your training. A simple way to manage your membership. Your next chapter starts here.",
    about: "",
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    hours: "",
    paymentInstructions: "",
    privacyText: "",
    termsText: "",
    nutritionText: "",
    heroPhotoId: "",
    gallery: []
};
function membershipStatus(m, now = new Date()) {
    if (!m) return "NONE";
    if (m.cancelledAt) return "CANCELLED";
    return new Date(m.endsAt) > now ? "ACTIVE" : "EXPIRED";
}
function periodFor(current, planId, days, now = new Date()) {
    const continues = membershipStatus(current, now) === "ACTIVE" && current.planId === planId;
    const base = continues ? new Date(current.endsAt) : new Date(now);
    const end = new Date(base);
    end.setUTCDate(end.getUTCDate() + days);
    return {
        startsAt: continues ? new Date(current.startsAt) : new Date(now),
        periodStartsAt: base,
        endsAt: end
    };
}
function karachiDay(now = new Date()) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Karachi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(now);
}
function csvCell(value) {
    const s = String(value ?? "");
    const safe = /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
    return '"' + safe.replaceAll('"', '""') + '"';
}
function reference(n) {
    return "PAY-" + String(n).padStart(4, "0");
}
}),
"[project]/lib/files.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "loadImage",
    ()=>loadImage,
    "readImage",
    ()=>readImage,
    "removeFile",
    ()=>removeFile,
    "saveImage",
    ()=>saveImage,
    "uploadRoot",
    ()=>uploadRoot
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__ = __turbopack_context__.i("[externals]/sharp [external] (sharp, esm_import, [project]/node_modules/sharp)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const uploadRoot = ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(/* turbopackIgnore: true */ process.env.UPLOAD_DIR || ".uploads");
async function readImage(req) {
    if (!req.headers.get("content-type")?.startsWith("multipart/form-data")) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](415, "Choose an image file.");
    const bytes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readBytes"])(req, 6 * 1024 * 1024);
    let form;
    try {
        form = await new Response(bytes, {
            headers: {
                "content-type": req.headers.get("content-type")
            }
        }).formData();
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "The image upload could not be read.");
    }
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function" || file.size === 0 || file.size > 5 * 1024 * 1024) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Choose a JPG, PNG or WebP image up to 5 MB.");
    let output;
    try {
        const input = Buffer.from(await file.arrayBuffer());
        const metadata = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(input, {
            limitInputPixels: 25000000
        }).metadata();
        if (![
            "jpeg",
            "png",
            "webp"
        ].includes(metadata.format)) throw Error();
        output = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(input, {
            limitInputPixels: 25000000
        }).rotate().resize({
            width: 2200,
            height: 2200,
            fit: "inside",
            withoutEnlargement: true
        }).jpeg({
            quality: 88
        }).toBuffer();
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](400, "Upload a valid JPG, PNG or WebP image.");
    }
    return output;
}
async function saveImage(buffer) {
    const key = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])() + ".jpg";
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].mkdir(uploadRoot(), {
        recursive: true,
        mode: 0o700
    });
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(uploadRoot(), key), buffer, {
        mode: 0o600,
        flag: "wx"
    });
    return key;
}
async function removeFile(key) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].unlink(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(uploadRoot(), key)).catch(()=>{});
}
async function loadImage(key) {
    if (!/^[a-f0-9-]+\.jpg$/.test(key)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "File not found.");
    try {
        return await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(uploadRoot(), key));
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "File not found.");
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/payments.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activatePayment",
    ()=>activatePayment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/domain.js [app-route] (ecmascript)");
;
;
async function activatePayment(tx, payment, actor, note) {
    const current = await tx.membership.findUnique({
        where: {
            userId: payment.userId
        }
    });
    if (current && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["membershipStatus"])(current) === "ACTIVE" && current.planId !== payment.planId && actor.role !== "OWNER") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](403, "Only the owner can approve a change to an active plan.");
    const period = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["periodFor"])(current, payment.planId, payment.durationDays);
    const fields = {
        planId: payment.planId,
        planName: payment.planName,
        startsAt: period.startsAt,
        endsAt: period.endsAt,
        cancelledAt: null
    };
    const membership = await tx.membership.upsert({
        where: {
            userId: payment.userId
        },
        create: {
            userId: payment.userId,
            ...fields
        },
        update: fields
    });
    await tx.subscription.create({
        data: {
            userId: payment.userId,
            planId: payment.planId,
            paymentId: payment.id,
            startsAt: period.periodStartsAt,
            endsAt: period.endsAt
        }
    });
    await tx.notification.create({
        data: {
            userId: payment.userId,
            title: "Payment approved",
            message: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reference"])(payment.refNo)} has been approved. Your ${payment.planName} membership is valid until ${period.endsAt.toLocaleDateString("en-PK", {
                timeZone: "Asia/Karachi"
            })}.`
        }
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["audit"])(tx, actor, "PAYMENT_APPROVED", "PaymentRequest", payment.id, {
        reference: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$domain$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reference"])(payment.refNo),
        amountPaise: payment.amountPaise,
        note,
        membershipId: membership.id
    });
    return membership;
}
}),
"[project]/lib/runtime-env.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Render has no Blueprint string interpolation. Build the private MariaDB URL at runtime.
// Never expose this value in public JS, API config or logs.
__turbopack_context__.s([
    "applyRuntimeEnvironment",
    ()=>applyRuntimeEnvironment
]);
function applyRuntimeEnvironment(env = process.env) {
    if (!env.DATABASE_URL) {
        const { DB_HOST, DB_PORT = '3306', DB_NAME = 'muscle_dynamics', DB_USER, DB_PASSWORD } = env;
        if (!DB_HOST || !DB_USER || !DB_PASSWORD) throw Error('Database configuration missing. Deploy both Render Blueprint services, or set a private mysql:// DATABASE_URL.');
        if (!/^[a-zA-Z0-9.-]+$/.test(DB_HOST) || !/^[a-zA-Z0-9_]+$/.test(DB_NAME)) throw Error('Invalid database host or database name.');
        const port = Number(DB_PORT);
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw Error('Invalid database port.');
        env.DATABASE_URL = `mysql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${port}/${DB_NAME}?connection_limit=8&connect_timeout=5&pool_timeout=10`;
    }
    let db;
    try {
        db = new URL(env.DATABASE_URL);
    } catch  {
        throw Error('Database connection URL is invalid.');
    }
    if (db.protocol !== 'mysql:') throw Error('This full project uses MariaDB through a mysql:// connection, not PostgreSQL.');
    const origin = env.APP_URL || env.RENDER_EXTERNAL_URL || (env.RENDER_EXTERNAL_HOSTNAME ? `https://${env.RENDER_EXTERNAL_HOSTNAME}` : '');
    if (origin) {
        let parsed;
        try {
            parsed = new URL(origin);
        } catch  {
            throw Error('Website origin configuration is invalid.');
        }
        if (![
            'https:',
            'http:'
        ].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || ![
            '',
            '/'
        ].includes(parsed.pathname)) throw Error('Website APP_URL must be a plain origin, without credentials or paths.');
        if (env.NODE_ENV === 'production' && parsed.protocol !== 'https:' && ![
            'localhost',
            '127.0.0.1'
        ].includes(parsed.hostname)) throw Error('A production website origin must use HTTPS.');
        env.APP_URL = parsed.origin;
    }
    return env;
}
}),
"[project]/lib/security.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HttpError",
    ()=>HttpError,
    "audit",
    ()=>audit,
    "authenticate",
    ()=>authenticate,
    "checkOrigin",
    ()=>checkOrigin,
    "digest",
    ()=>digest,
    "hashPassword",
    ()=>hashPassword,
    "isTransactionConflict",
    ()=>isTransactionConflict,
    "jsonBody",
    ()=>jsonBody,
    "limit",
    ()=>limit,
    "publicUser",
    ()=>publicUser,
    "readBytes",
    ()=>readBytes,
    "sessionCookie",
    ()=>sessionCookie,
    "sessionFor",
    ()=>sessionFor,
    "tokenFrom",
    ()=>tokenFrom,
    "transaction",
    ()=>transaction,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
;
;
;
const scrypt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scrypt"]);
class HttpError extends Error {
    constructor(status, message){
        super(message);
        this.status = status;
    }
}
const digest = (value)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(value).digest("hex");
async function hashPassword(password) {
    const salt = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(16).toString("hex");
    return salt + ":" + (await scrypt(password, salt, 64)).toString("hex");
}
async function verifyPassword(password, stored) {
    const [salt, hash] = (stored || "0".repeat(32) + ":" + "0".repeat(128)).split(":");
    const actual = await scrypt(password, salt, 64);
    return typeof hash === "string" && hash.length === 128 && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"])(actual, Buffer.from(hash, "hex"));
}
const publicUser = (u)=>({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt
    });
function tokenFrom(req) {
    const bearer = req.headers.get("authorization");
    if (bearer?.startsWith("Bearer ")) return bearer.slice(7);
    return (req.headers.get("cookie") || "").split(";").map((x)=>x.trim()).find((x)=>x.startsWith("md_session="))?.slice(11);
}
async function authenticate(req, roles) {
    const token = tokenFrom(req);
    if (!token || !/^[a-f0-9]{64}$/.test(token)) throw new HttpError(401, "Please log in to continue.");
    const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].session.findUnique({
        where: {
            tokenHash: digest(token)
        },
        include: {
            user: true
        }
    });
    if (!session || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") throw new HttpError(401, "Your session has ended. Please log in again.");
    if (roles && !roles.includes(session.user.role)) throw new HttpError(403, "Your account does not have permission for this action.");
    return session.user;
}
async function sessionFor(user) {
    const token = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(32).toString("hex");
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].session.create({
        data: {
            tokenHash: digest(token),
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 86400000)
        }
    });
    return {
        token,
        user: publicUser(user)
    };
}
function sessionCookie(token, clear = false) {
    return `md_session=${clear ? "" : token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear ? 0 : 604800}${("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : ""}`;
}
async function readBytes(req, max) {
    if (!req.body) return Buffer.alloc(0);
    const declared = Number(req.headers.get("content-length"));
    if (declared > max) throw new HttpError(413, "This upload is too large.");
    const reader = req.body.getReader();
    let total = 0, chunks = [];
    try {
        for(;;){
            const { value, done } = await reader.read();
            if (done) break;
            total += value.byteLength;
            if (total > max) {
                await reader.cancel();
                throw new HttpError(413, "This request is too large.");
            }
            chunks.push(Buffer.from(value));
        }
    } finally{
        reader.releaseLock();
    }
    return Buffer.concat(chunks);
}
async function jsonBody(req, schema) {
    if (!req.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "Send application/json.");
    let data;
    try {
        data = JSON.parse((await readBytes(req, 100 * 1024)).toString());
    } catch (e) {
        if (e instanceof HttpError) throw e;
        throw new HttpError(400, "Invalid JSON request.");
    }
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new HttpError(400, parsed.error.issues.map((x)=>x.path.length ? `${x.path.join(".")}: ${x.message}` : x.message).join(" · "));
    return parsed.data;
}
function checkOrigin(req) {
    if ([
        "GET",
        "HEAD",
        "OPTIONS"
    ].includes(req.method) || req.headers.get("authorization")?.startsWith("Bearer ")) return;
    const origin = req.headers.get("origin");
    if (!origin) return;
    const hosts = new Set([
        new URL(req.url).host,
        req.headers.get("host"),
        req.headers.get("x-forwarded-host")
    ]);
    let allowed = false;
    try {
        const url = new URL(origin);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else allowed = hosts.has(url.host) || origin === process.env.APP_URL;
    } catch  {}
    if (!allowed) throw new HttpError(403, "This request did not come from this website.");
}
async function limit(req, bucket, max = 30) {
    const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
    const window = Math.floor(Date.now() / 600000);
    const key = digest(bucket + "|" + ip + "|" + window);
    const row = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].rateLimit.upsert({
        where: {
            key
        },
        create: {
            key,
            expiresAt: new Date((window + 1) * 600000)
        },
        update: {
            count: {
                increment: 1
            }
        }
    });
    if (row.count > max) throw new HttpError(429, "Too many attempts. Please wait a few minutes.");
}
function audit(tx, actor, action, entity, entityId, detail = {}) {
    return tx.auditLog.create({
        data: {
            actorId: actor.id,
            action,
            entity,
            entityId,
            detail
        }
    });
}
function isTransactionConflict(error) {
    return error?.code === "P2034" || error?.code === "P2010" && [
        "1020",
        "1205",
        "1213"
    ].includes(String(error.meta?.code)) || error?.name === "PrismaClientUnknownRequestError" && /MysqlError \{ code: (1020|1205|1213),/.test(error.message);
}
async function transaction(fn) {
    for(let tries = 0; tries < 5; tries++){
        try {
            return await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$transaction(fn, {
                isolationLevel: "Serializable",
                maxWait: 10000,
                timeout: 15000
            });
        } catch (e) {
            if (!isTransactionConflict(e)) throw e;
            if (tries === 4) throw new HttpError(409, "Another update happened at the same time. Please retry.");
            await new Promise((resolve)=>setTimeout(resolve, 20 * (tries + 1) + Math.floor(Math.random() * 20)));
        }
    }
}
}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__10gystmm6e4s8._.js.map