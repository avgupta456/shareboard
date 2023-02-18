"use client";

import { v4 as uuidv4 } from "uuid";

import React, { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

import { Button, MultiSelect, TextInput } from "@mantine/core";

import { useSupabase } from "../../components/supabase-provider";
import { insertGeneralLink } from "../../db/general_links/insert";
import { selectUser } from "../../db/users/select";
import {
  OutputTable,
  TableHeaders,
  fetchTables as _fetchTables,
  handleQuery as _handleQuery,
  handleQuestion as _handleQuestion,
} from "../shared";
import DBSelect from "./databases";

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
  const [output, setOutput] = useState([]);

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
      await _fetchTables(debouncedConnUrl, setTables, setTableColumns);
    };

    fetchTables();
  }, [debouncedConnUrl]);

  const handleQuestion = async () => {
    await _handleQuestion(question, selectedTables, tables, tableColumns, setQuery);
  };

  const handleQuery = async () => {
    await _handleQuery(query, connUrl, setOutput);
  };

  const saveGeneralLink = async () => {
    if (!connUrl) return;

    // generate UUID
    const link = uuidv4();
    const user_id = session.user.id;

    await insertGeneralLink(supabase, link, user_id, connUrl, "Temp Name");
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
        <Button variant="outline" color="blue" disabled={!connUrl} onClick={saveGeneralLink}>
          Save Connection
        </Button>
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
      <div className="w-full">
        <TableHeaders tableColumns={tableColumns} selectedTables={selectedTables} />
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
          onClick={handleQuery}
        >
          Run Query
        </Button>
      </div>
      <div className="w-full text-center text-lg font-bold mt-4">Output</div>
      <div className="w-full">
        <OutputTable output={output} />
      </div>
    </div>
  );
};

export default Page;
