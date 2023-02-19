"use client";

import React, { useEffect, useState } from "react";

import { Button, MultiSelect, TextInput } from "@mantine/core";

import Bar, { getBarData } from "../../components/figures/bar";
import {
  OutputTable,
  TableHeaders,
  fetchTables as _fetchTables,
  handleQuery as _handleQuery,
  handleQuestion as _handleQuestion,
} from "../../components/shared";
import { useSupabase } from "../../components/supabase-provider";
import { selectGeneralLink } from "../../db/general_links/select";

const Page = ({ params }: { params: { link: string } }) => {
  const { supabase } = useSupabase();
  const { link } = params;

  const [generalLink, setGeneralLink] = useState(null);
  const [connUrl, setConnUrl] = useState("");
  const [tables, setTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});
  const [selectedTables, setSelectedTables] = useState([]);
  const [question, setQuestion] = useState("");
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState([]);
  const [barData, setBarData] = useState(null);

  useEffect(() => {
    const fetchGeneralLink = async () => {
      const tempGeneralLink = await selectGeneralLink(supabase, link);
      setGeneralLink(tempGeneralLink);
      setConnUrl(tempGeneralLink.conn_str);
    };

    fetchGeneralLink();
  }, [supabase, link]);

  useEffect(() => {
    if (!connUrl) return;

    const fetchTables = async () => {
      await _fetchTables(connUrl, setTables, setTableColumns);
    };

    fetchTables();
  }, [connUrl]);

  const handleQuestion = async () => {
    await _handleQuestion(question, selectedTables, tables, tableColumns, setQuery);
  };

  useEffect(() => {
    if (!query) return;

    const handleQuery = async () => {
      await _handleQuery(query, connUrl, setOutput);
    };

    handleQuery();
  }, [connUrl, query]);

  useEffect(() => {
    if (!output) return;

    const updateBarData = async () => {
      const newBarData = await getBarData(output);
      setBarData(newBarData);
    };

    updateBarData();
  }, [output]);

  if (!generalLink) {
    return (
      <div className="w-full container mx-auto flex-grow p-4 flex items-center justify-center">
        Link not found
      </div>
    );
  }

  console.log(barData);

  return (
    <div className="w-full container mx-auto flex-grow p-4 flex flex-col items-center justify-center">
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold">General Link: {generalLink.name}</h1>
      </div>
      <div className="w-full flex gap-4 mt-4">
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
      <div className="w-full text-center text-lg font-bold mt-4">Output</div>
      <div className="w-full flex">
        <div className="flex-grow flex items-center">
          <OutputTable output={output} />
        </div>
        {barData && (
          <div className="w-[750px] h-[500px]">
            <Bar data={barData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
