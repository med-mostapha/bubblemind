import scaleKit from "@/lib/scalekit";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";
import { user as User } from "@/db/schema";
import { db } from "@/db/client";
import { eq } from "drizzle-orm";
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    console.error("Authentication error:", error, error_description);
    return new Response("Authentication failed: " + error_description, {
      status: 400
    });
  }
  if (!code) {
    console.error("No authorization code found in the callback URL.");
    return new Response("Authentication failed: No code provided", {
      status: 400
    });
  }

  try {
    const rediretctUri = process.env.SCALEKIT_REDIRECT_URI!;

    const authResult = await scaleKit.authenticateWithCode(code, rediretctUri);

    const { user, idToken } = authResult;

    const claims = await scaleKit.validateToken(idToken);
    console.log("ScaleKit token claims:", claims);

    const organizationId =
      (claims as any).organization_id ||
      ((claims as any).org && (claims as any).org.id) ||
      (claims as any).oid ||
      null;

    if (!organizationId) {
      console.error("Organization ID not found in token claims", claims);
      return NextResponse.json(
        { error: "Organization ID not found in token claims", claims },
        { status: 500 }
      );
    }

    const existing = await db
      .select()
      .from(User)
      .where(eq(User.email, user.email));

    if (existing.length === 0) {
      await db.insert(User).values({
        email: user.email,
        name: user.name || "Anonymous",
        organization_id: organizationId
      });
    }

    const response = NextResponse.redirect(new URL("/", req.url));
    const userSession = {
      email: user.email,
      organization_id: organizationId
    };

    response.cookies.set("user_session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    // Enhanced error logging for debugging
    console.error("Error during authentication:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      if (error.stack) console.error("Error stack:", error.stack);
    } else {
      console.error("Error details:", JSON.stringify(error));
    }
    return new Response(
      "Authentication failed to authenticate user. See server logs for details.",
      {
        status: 500
      }
    );
  }
}
