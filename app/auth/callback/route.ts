import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

/**
 * Supabase Auth callback handler.
 * Called after email magic-link click or OAuth redirect.
 * Exchanges the one-time code for a session and redirects to the dashboard.
 */
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code !== null) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error === null) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to login with an error indicator
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
};
