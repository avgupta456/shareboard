from typing import List

from dotenv import load_dotenv  # type: ignore

from sqlalchemy import create_engine, inspect
import openai

load_dotenv()

# flake8: noqa E402
from constants import CONN_URL, OPENAI_KEY

engine = create_engine(CONN_URL)

schema = "public"
inspector = inspect(engine)  # type: ignore


openai.api_key = OPENAI_KEY


def get_table_names() -> List[str]:
    return inspector.get_table_names(schema)


def get_table_schema(table_name: str) -> str:
    columns = [
        c["name"]
        for c in inspector.get_columns(table_name, schema)
        if not c["is_hidden"]
    ]
    return f"Table {table_name}, columns = [{', '.join(columns)}]"


def make_prompt(tables: List[str], question: str) -> str:
    schemas = []
    for table in tables:
        schemas.append(get_table_schema(table))

    prompt = """Create a valid Postgres SQL query to answer the question.

Schema:
Table customers, columns = [CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId]

Question: Create a MySQL query for all customers in Texas named Jane

Answer: SELECT * FROM customers WHERE State = 'Texas' AND FirstName = 'Jane'

Schema:
"""

    prompt += "\n\n".join(table_schema for table_schema in schemas)
    prompt += f"\n\nQuestion: {question}\n\nAnswer:"

    return prompt


def get_response(prompt: str) -> str:
    response = openai.Completion.create(
        model="code-davinci-002",
        prompt=prompt,
        temperature=0,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=["Schema:", "Question:", "Answer:"],
    )

    return response.choices[0].text.strip()


def run_query(query: str) -> str:
    with engine.connect() as con:
        rs = con.execute(query)
        return rs.fetchall()


prompt = make_prompt(
    ["team_years"],
    "List the top 10 teams in MI that won the most matches in 2022.",
)

print(prompt)

query = get_response(prompt)

print(query)

print(run_query(query))
