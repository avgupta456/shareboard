const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const selectedTables = req.body.selectedTables;
  const tableColumns = req.body.tableColumns;
  const question = req.body.question;

  let prompt = `Create a valid Postgres SQL query to answer the question.

  Schema:
  Table customers, columns = [CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId]
  
  Question: Create a MySQL query for all customers in Texas named Jane
  
  Answer: SELECT * FROM customers WHERE State = 'Texas' AND FirstName = 'Jane'
  
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
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["Schema:", "Question:", "Answer:"],
  });

  return res.status(200).json({ response: response.data });
}
