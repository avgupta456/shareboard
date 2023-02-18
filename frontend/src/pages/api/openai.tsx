const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const selectedTables = req.body.selectedTables;
  const tableColumns = req.body.tableColumns;
  const question = req.body.question;

  let prompt = `Create the simplest valid Postgres SQL query to answer the question. Infer specific rows wanted, and limit to 20 rows if not specified.

  START
  Schema:
  Table customers, columns = [customerId, firstName, lastName, company, address, city, state, country, postalCode, phone, fax, email, supportRepId]
  
  Question: List all customers in Texas named Jane

  Answer: SELECT customerId, firstName, lastName, state FROM customers WHERE state = 'Texas' AND firstName = 'Jane'
  END

  START
  Schema:
  Table sp500, columns = [market_cap, year_high, ebidta, price, price_per_earning, earning_per_share, year_low, sector, symbol, name]

  Question: What is the price-per-earning grouped by sector?

  Answer: SELECT sector, AVG(price_per_earning) FROM sp GROUP BY sector
  END

  START
  Schema:
`;

  selectedTables.forEach((table) => {
    prompt += `Table ${table}, columns = [${tableColumns[table].join(", ")}]\n`;
  });

  prompt += `
  Question: ${question}

  Answer: `;

  const response = await openai.createCompletion({
    model: "code-davinci-002",
    prompt: prompt,
    temperature: 0,
    max_tokens: 64,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["END", "Schema:", "Question:", "Answer:"],
  });

  return res.status(200).json({ response: response.data });
}
