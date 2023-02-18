const { Client } = require("pg");

export default async function handler(req, res) {
  const connUrl = req.body.connUrl;
  const client = new Client(connUrl);
  await client.connect();

  client.query(
    "SELECT column_name, table_name FROM information_schema.columns WHERE table_schema = 'public';",
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err });
      } else {
        const tables = [];
        const tableColumns = {};
        result.rows.forEach((row) => {
          if (!tables.includes(row.table_name)) {
            tables.push(row.table_name);
            tableColumns[row.table_name] = [];
          }
          tableColumns[row.table_name].push(row.column_name);
        });
        return res.status(200).json({ tables, tableColumns });
      }
    }
  );
}
