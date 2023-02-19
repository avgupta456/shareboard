"use client";

import React, { useEffect, useState } from "react";

import { Button, MultiSelect, Progress, TextInput } from "@mantine/core";

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
import { classnames } from "../../utils/utils";

const Page = ({ params }: { params: { link: string } }) => {
  const { supabase } = useSupabase();
  const { link } = params;

  const [generalLink, setGeneralLink] = useState(null);
  const [connUrl, setConnUrl] = useState("");
  const [tables, setTables] = useState([]);
  const [tableColumns, setTableColumns] = useState({});
  const [showTableColumns, setShowTableColumns] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [question, setQuestion] = useState("");
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState([]);
  const [barData, setBarData] = useState(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", updateDimensions);
    updateDimensions();
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setSelectedTables([]);
    setQuestion("");
    setQuery("");
    setOutput([]);
    setBarData(null);
  }, [tables]);

  useEffect(() => {
    if (selectedTables.length === 0) {
      setShowTableColumns(false);
      setQuestion("");
      setQuery("");
      setOutput([]);
      setBarData(null);
    }
  }, [selectedTables]);

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

  const handleQuery = async () => {
    await _handleQuery(query, connUrl, setOutput);
  };

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

  return (
    <div className="w-full container mx-auto flex-grow p-4 flex flex-col items-center justify-center">
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold">{generalLink.name}</h1>
      </div>
      <div className="w-full my-4">
        <Progress
          radius="xl"
          size={24}
          sections={[
            tables?.length > 0 && { value: 20, color: "blue", label: "Connect" },
            selectedTables?.length > 0 && { value: 20, color: "pink", label: "Choose Tables" },
            (question || query) && { value: 20, color: "grape", label: "Question" },
            query && { value: 20, color: "violet", label: "Query" },
            output?.length > 0 && { value: 20, color: "blue", label: "Output" },
          ]}
        />
      </div>
      <div className="text-lg font-bold mt-4">Specify Tables</div>
      <div className="w-1/2 flex gap-4 mt-4">
        <MultiSelect
          label="Tables"
          placeholder="Use Specific Tables"
          disabled={tables?.length === 0}
          withAsterisk
          className="flex-grow"
          data={tables?.map((table) => ({ label: table, value: table })) ?? []}
          value={selectedTables}
          onChange={setSelectedTables}
        />
        <Button
          variant="outline"
          color="blue"
          disabled={selectedTables?.length === 0}
          className="mt-6"
          onClick={() => setShowTableColumns(!showTableColumns)}
        >
          {showTableColumns ? "Hide" : "Show"} Table Columns
        </Button>
      </div>
      {showTableColumns && (
        <TableHeaders tableColumns={tableColumns} selectedTables={selectedTables} />
      )}
      <div className="w-full flex gap-8 mt-4">
        <div className="w-1/2 flex flex-col">
          <div className="w-full text-center text-lg font-bold mt-4">Either Ask a Question</div>
          <TextInput
            label="Question"
            placeholder="Set Question"
            className="flex-grow"
            disabled={tables?.length === 0}
            value={question}
            onChange={(event) => setQuestion(event.currentTarget.value)}
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
        <div className="w-1/2 flex flex-col">
          <div className="w-full text-center text-lg font-bold mt-4">Or Write a Query</div>
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
      </div>

      <div className="w-full text-center text-lg font-bold mt-8">Output</div>
      <div className="w-full flex mt-4">
        <div className={classnames(barData ? "w-1/2" : "w-full", "h-full")}>
          <OutputTable output={output} />
        </div>
        {barData && <Bar data={barData} width={width / 2} height={400} />}
      </div>
    </div>
  );
};

export default Page;
