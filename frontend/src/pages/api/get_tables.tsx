const { Client } = require("pg");

export default async function handler(req, res) {
  const connUrl = req.body.connUrl;
  const client = new Client(connUrl);
  await client.connect();

  client.query("SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public';", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }

    const tables = result.rows.map((row) => row.tablename);
    res.status(200).json({ tables });
  });
}
