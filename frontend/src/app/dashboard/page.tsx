"use client";

import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

import { TextInput } from "@mantine/core";

import { useSupabase } from "../../components/supabase-provider";
import { selectUser } from "../../db/users/select";
import DBSelect from "./databases";

// import Calendar from "./calendar";

// do not cache this page
export const revalidate = 0;

const Page = () => {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [db, setDB] = useState(null);
  const [connUrl, setConnUrl] = useState("");
  const [debouncedConnUrl, setDebouncedConnUrl] = useState(null);

  useEffect(() => {
    if (!session) return;
    const fetchUser = async () => {
      const currUser = await selectUser(supabase, session);
      setUser(currUser);
      setLoading(false);
    };

    fetchUser();
  }, [supabase, session]);

  useEffect(() => {
    if (!connUrl) return;
    const timeout = setTimeout(() => {
      setDebouncedConnUrl(connUrl);
    }, 500);

    return () => clearTimeout(timeout);
  }, [connUrl]);

  useEffect(() => {
    if (!debouncedConnUrl) return;

    const fetchTables = async () => {
      await fetch("/api/get_tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ connUrl: debouncedConnUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("DATA", data);
        });
    };

    fetchTables();
  }, [debouncedConnUrl]);

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
      <div className="w-full flex gap-4">
        <DBSelect setSelected={setDB} />
        <TextInput
          label="Connection String"
          placeholder="Set Connection String"
          className="flex-grow"
          withAsterisk
          disabled={!db}
          value={connUrl}
          onChange={(event) => setConnUrl(event.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default Page;
