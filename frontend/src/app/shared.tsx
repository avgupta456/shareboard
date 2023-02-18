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
  fetch("/api/openai", {
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

  fetch("/api/run_query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ connUrl, query }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Raw Output", data);
      setOutput(data?.result ?? data?.error ?? []);
    });
};

export const OutputTable = ({ output }) => {
  const headers = output?.[0] ? Object.keys(output?.[0]) : [];
  const rows = Array.isArray(output) ? output?.map((row) => Object.values(row)) : [];

  return (
    <div className="overflow-x-auto text-sm">
      <table className="table-auto">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th className="px-2 py-1" key={i}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td className="border px-2 py-1" key={j}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
