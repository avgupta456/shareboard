import { classnames } from "../utils/utils";

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

export const TableHeaders = ({ tableColumns, selectedTables }) => {
  return (
    <div className="w-full flex flex-col text-sm mt-4">
      {selectedTables.map((table, i) => (
        <div key={i} className="w-full flex flex-col mb-2">
          <div className="w-full text-center text-base font-bold mb-1">{table}</div>
          <div className="w-full flex flex-row overflow-x-scroll scrollbar-hide">
            {tableColumns[table].map((column, j) => (
              <div key={j} className={classnames("px-2 py-1 text-sm", j % 2 && "bg-gray-100")}>
                {column}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const OutputTable = ({ output }) => {
  const headers = output?.[0] ? Object.keys(output?.[0]) : [];
  const rows = Array.isArray(output) ? output?.map((row) => Object.values(row)) : [];

  return (
    <div className="w-full overflow-x-scroll scrollbar-hide text-sm">
      <table className="table-auto mx-auto">
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
              {row.map((cell: any, j) => (
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
