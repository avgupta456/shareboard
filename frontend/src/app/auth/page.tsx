"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Auth, ThemeSupa as AuthTheme } from "@supabase/auth-ui-react";

import { useSupabase } from "../../components/supabase-provider";

// Supabase auth needs to be triggered client-side
export default function Login() {
  const { supabase } = useSupabase();

  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        router.push("/dashboard");
      }
    });
  }, [supabase.auth, router]);

  // TODO: Change to correct colors
  // TODO: Currently a bug where cannot resubmit after failed login. See https://github.com/supabase/auth-ui/pull/93
  // TODO: Email verification
  return (
    <div className="mx-auto grid h-screen w-full max-w-md place-items-center p-6 ">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-7">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: AuthTheme,
            variables: {
              default: {
                colors: {
                  brand: "blue",
                  brandAccent: "darkblue",
                },
              },
            },
          }}
          providers={["google", "facebook"]}
        />
      </div>
    </div>
  );
}
