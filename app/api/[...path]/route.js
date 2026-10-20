import { handleApi } from "../../../lib/api.js";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req, ctx) {
  return handleApi(req, (await ctx.params).path);
}
export async function POST(req, ctx) {
  return handleApi(req, (await ctx.params).path);
}
export async function PATCH(req, ctx) {
  return handleApi(req, (await ctx.params).path);
}
export async function DELETE(req, ctx) {
  return handleApi(req, (await ctx.params).path);
}
