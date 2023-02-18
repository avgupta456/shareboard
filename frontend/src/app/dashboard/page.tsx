"use client";

import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

import { Button, MultiSelect, TextInput } from "@mantine/core";

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
  const [tables, setTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});
  const [selectedTables, setSelectedTables] = useState([]);
  const [question, setQuestion] = useState("");
  const [query, setQuery] = useState("");

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
          setTables(data.tables);
          setTableColumns(data.tableColumns);
        });
    };

    fetchTables();
  }, [debouncedConnUrl]);

  const handleQuestion = async () => {
    if (!question) return;

    const currSelectedTables = selectedTables.length > 0 ? selectedTables : tables;
    await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedTables: currSelectedTables,
        tableColumns,
        question,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newQuery = data?.response?.choices?.[0]?.text;
        if (newQuery) setQuery(newQuery);
      });
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
      <div className="w-full text-center text-lg font-bold mt-4">Either ask a question</div>
      <div className="w-full flex flex-wrap gap-4 mt-4">
        <TextInput
          label="Question"
          placeholder="Set Question"
          className="flex-grow"
          disabled={tables?.length === 0}
          value={question}
          onChange={(event) => setQuestion(event.currentTarget.value)}
        />
        <MultiSelect
          label="Tables (optional)"
          placeholder="Use Specific Tables"
          disabled={tables?.length === 0}
          className="w-96"
          data={tables?.map((table) => ({ label: table, value: table })) ?? []}
          value={selectedTables}
          onChange={setSelectedTables}
        />
        <Button
          variant="outline"
          color="blue"
          disabled={tables?.length === 0 || !question}
          className="mt-6"
          onClick={handleQuestion}
        >
          Ask Question
        </Button>
      </div>
      <div className="w-full text-center text-lg font-bold mt-4">Or enter a SQL query directly</div>
      <div className="w-full flex flex-wrap gap-4 mt-4">
        <TextInput
          label="Query"
          placeholder="Set Query"
          disabled={tables?.length === 0}
          className="flex-grow"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Button
          variant="outline"
          color="blue"
          disabled={tables?.length === 0 || !query}
          className="mt-6"
          onClick={() => console.log("TODO: Run Query")}
        >
          Run Query
        </Button>
      </div>
    </div>
  );
};

export default Page;
