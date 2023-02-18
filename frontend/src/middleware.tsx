import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Check if user is authenticated.
    const supabase = createMiddlewareSupabaseClient<any>({ req, res });
    const session = (await supabase.auth.getSession())?.data?.session;
    if (!session) {
      // Auth condition not met, redirect to home page.
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}
