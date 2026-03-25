import { isAuthorized } from "@/lib/isAuthorized";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await isAuthorized();

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json(user);
}
