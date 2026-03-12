import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await isAuthorized();
  return NextResponse.json(user || null);
}
