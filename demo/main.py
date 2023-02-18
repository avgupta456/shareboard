from dotenv import load_dotenv  # type: ignore

from sqlalchemy import create_engine, inspect

load_dotenv()

# flake8: noqa E402
from constants import CONN_URL

print(CONN_URL)

engine = create_engine(CONN_URL)


def print_all_tables():
    schema = "public"
    inspector = inspect(engine)  # type: ignore
    for table_name in inspector.get_table_names(schema):  # type: ignore
        columns = [
            c["name"]
            for c in inspector.get_columns(table_name, schema)
            if not c["is_hidden"]
        ]
        print(f"Table {table_name}: columns=[{', '.join(columns)}]")
        print()


print_all_tables()
