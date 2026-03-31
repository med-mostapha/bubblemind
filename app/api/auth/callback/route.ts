import scaleKit from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";
import { user as User } from "@/db/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

function extractOrganizationId(claims: Record<string, unknown>): string | null {
  if (typeof claims.organization_id === "string") return claims.organization_id;
  const org = claims.org as Record<string, unknown> | undefined;
  if (org && typeof org.id === "string") return org.id;
  if (typeof claims.oid === "string") return claims.oid;
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const savedState = cookieStore.get("sk_state")?.value;

  if (!state || !savedState || state !== savedState) {
    return new Response("Authentication failed: Invalid state parameter", {
      status: 400,
    });
  }

  cookieStore.delete("sk_state");

  if (error) {
    console.error("Authentication error:", error, error_description);
    return new Response("Authentication failed: " + error_description, {
      status: 400,
    });
  }

  if (!code) {
    return new Response("Authentication failed: No code provided", {
      status: 400,
    });
  }

  try {
    const redirectUri = process.env.SCALEKIT_REDIRECT_URI!;
    const authResult = await scaleKit.authenticateWithCode(code, redirectUri);
    const { user, idToken } = authResult;

    const claims = (await scaleKit.validateToken(idToken)) as Record<
      string,
      unknown
    >;
    const organizationId = extractOrganizationId(claims);

    if (!organizationId) {
      console.error("Organization ID not found in token claims", claims);
      return NextResponse.json(
        { error: "Organization ID not found in token claims" },
        { status: 500 },
      );
    }

    const existing = await db
      .select()
      .from(User)
      .where(eq(User.email, user.email));

    const isNewUser = existing.length === 0;

    if (isNewUser) {
      await db.insert(User).values({
        email: user.email,
        name: user.name || "Anonymous",
        organization_id: organizationId,
      });
    }

    const redirectTo = new URL("/dashboard", req.url);
    const response = NextResponse.redirect(redirectTo);

    response.cookies.set(
      "user_session",
      JSON.stringify({
        email: user.email,
        organization_id: organizationId,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    return response;
  } catch (error) {
    console.error("Error during authentication:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if (error.stack) console.error("Error stack:", error.stack);
    }
    return new Response("Authentication failed. See server logs for details.", {
      status: 500,
    });
  }
}
