import scaleKit from "@/lib/scalekit";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    (await cookies()).set("sk_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });
    const rediretctUrl = process.env.SCALEKIT_REDIRECT_URI;
    const options = {
      scopes: ["openid", "profile", "email", "offline_access"],
      state
    };
    const authorizationUrl = scaleKit.getAuthorizationUrl(
      rediretctUrl!,
      options
    );
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json(
      { error: "Authentication failed to generate authorization URL" },
      { status: 500 }
    );
  }
}
