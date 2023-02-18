export const fetchTables = async (debouncedConnUrl, setTables, setTableColumns) => {
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

export const handleQuestion = async (question, selectedTables, tables, tableColumns, setQuery) => {
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

export const handleQuery = async (query, connUrl, setOutput) => {
  if (!query) return;

  await fetch("/api/run_query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connUrl, query }),
  })
    .then((res) => res.json())
    .then((data) => {
      setOutput(data?.result ?? data?.error ?? []);
    });
};
