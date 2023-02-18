"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Session } from "@supabase/supabase-js";

import { createClient } from "../utils/supabase-browser";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
  session: Session | null;
  loggedIn: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);
  const loggedIn = session !== null;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });

    supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, session, loggedIn }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  } else {
    return context;
  }
};
