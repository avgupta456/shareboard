const { Client } = require("pg");

export default async function handler(req, res) {
  const connUrl = req.body.connUrl;
  const client = new Client(connUrl);
  await client.connect();

  const query = req.body.query;

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    } else {
      return res.status(200).json({ result: result.rows });
    }
  });
}
