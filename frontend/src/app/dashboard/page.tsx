"use client";

import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

import Link from "next/link";

import { Button, MultiSelect, TextInput } from "@mantine/core";

import {
  OutputTable,
  TableHeaders,
  fetchTables as _fetchTables,
  handleQuery as _handleQuery,
  handleQuestion as _handleQuestion,
} from "../../components/shared";
import { useSupabase } from "../../components/supabase-provider";
import { insertGeneralLink } from "../../db/general_links/insert";
import { selectGeneralLinks } from "../../db/general_links/select";
import { selectUser } from "../../db/users/select";
import DBSelect from "./databases";

// do not cache this page
export const revalidate = 0;

const Page = () => {
  const { supabase, session } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [db, setDB] = useState(null);
  const [connUrl, setConnUrl] = useState("");
  const [name, setName] = useState("");
  const [debouncedConnUrl, setDebouncedConnUrl] = useState(null);

  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (!session) return;
    const fetchUser = async () => {
      const currUser = await selectUser(supabase, session);
      setUser(currUser);

      const newUrls = await selectGeneralLinks(supabase, currUser.user_id);
      setUrls(newUrls);

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

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "general_links" },
        (payload) => setUrls((tasks) => [...tasks, payload.new as any])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setUrls, urls]);

  const saveGeneralLink = async () => {
    if (!connUrl) return;
    if (!name) return;

    // generate UUID
    const link = uuidv4();
    const user_id = session.user.id;

    await insertGeneralLink(supabase, link, user_id, debouncedConnUrl, name);
  };

  if (loading) {
    return (
      <div className="w-full container mx-auto flex-grow p-4 flex items-center justify-center">
        <BounceLoader color="#3b82f6" loading={loading} size={75} />
      </div>
    );
  }

  return (
    <div className="w-full container mx-auto flex-grow p-4 flex flex-col items-center">
      <p className="w-full text-center text-2xl">Create a new Dashboard</p>
      <div className="w-full flex gap-4 items-end">
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
        <TextInput
          label="Name"
          placeholder="Set Name"
          className="flex-grow"
          withAsterisk
          disabled={!db}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Button
          variant="outline"
          color="blue"
          disabled={!connUrl || !name}
          onClick={saveGeneralLink}
        >
          Create Connection
        </Button>
      </div>
      {urls?.length > 0 && (
        <>
          <p className="w-full text-center text-2xl mt-16">Or use an existing Dashboard</p>
          {[...urls].reverse().map((url) => (
            <Link
              className="w-full m-4 p-4 rounded-lg border-2 border-gray-200 hover:bg-blue-100"
              key={url.link}
              href={`/${url.link}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-lg">{url.name}</p>
              <p className="text-md">{url.conn_str}</p>
            </Link>
          ))}
        </>
      )}
    </div>
  );
};

export default Page;
