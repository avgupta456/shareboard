import "server-only";

import React from "react";

import SupabaseListener from "../components/supabase-listener";
import SupabaseProvider from "../components/supabase-provider";
import { createClient } from "../utils/supabase-server";
import RootStyleRegistry from "./emotion";
import Footer from "./footer";
import "./globals.css";
import Navbar from "./navbar";
import "./preflight.css";

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>{/* TODO: Add Analytics */}</head>
      <body>
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          <RootStyleRegistry>
            <div className="min-h-screen flex flex-col bg-white text-gray-800">
              <Navbar />
              {children}
              <Footer />
            </div>
          </RootStyleRegistry>
        </SupabaseProvider>
      </body>
    </html>
  );
}
