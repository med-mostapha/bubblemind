import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("user_session");
  cookieStore.delete("sk_state");

  return NextResponse.json({ success: true });
}
