"use client";

import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

import { Button } from "@mantine/core";

import { useSupabase } from "../../components/supabase-provider";
import { selectUser } from "../../db/users/select";

// import Calendar from "./calendar";

// do not cache this page
export const revalidate = 0;

const Page = () => {
  const { supabase, session } = useSupabase();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!session) return;
    const fetchUser = async () => {
      const currUser = await selectUser(supabase, session);
      setUser(currUser);
      setLoading(false);
    };

    fetchUser();
  }, [supabase, session]);

  console.log("User", user);

  if (loading) {
    return (
      <div className="w-full container mx-auto flex-grow p-4 flex items-center justify-center">
        <BounceLoader color="#3b82f6" loading={loading} size={75} />
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto flex-grow p-4 flex flex-col items-center">
      <p className="w-full text-center text-2xl">Dashboard</p>
    </div>
  );
};

export default Page;
