## Inspiration

As a researcher at a Yale cancer bio lab, I repeatedly found my time spent browsing large data files to perform routine analyses. This process was tedious, but became even more time-consuming when sharing results with colleagues who would also need to download and interact with the data. At startups and elsewhere, we have all run into the issue of data shareability and accessibility. These experiences prompted us to develop Shareboard, a data platform that allows users to instantly create and share AI-enhanced data dashboards.

## What it does

Shareboard integrates with multiple data sources to streamline the data analysis and sharing workflow. After creating an account with Shareboard, users can upload datasets through SQL connection strings and CSV import (through Supabase). We then create a shareable link that allows all collaborators to view and interact with the data.

Going one step further, Shareboard eliminates the need for technical knowledge of the data pipeline. Using plain natural language, users can ask open-ended questions to Shareboard, which translates the request into SQL queries and executes them against the saved data source. Shareboard returns both raw data and interactive visualizations to enable rapid iteration and conclusions.

## How we built it

Shareboard is primarily a website built with NextJS, TypeScript, TailwindCSS and Mantine UI. We used Vercel for continuous deployment and NodeJS serverless functions for our backend infrastructure. We relied heavily on Supabase for User Authentication, Postgres DB with Realtime Updates, Row Level Security (RLS) to eliminate a conventional backend, and CSV upload. We integrated with the OpenAI GPT-3 Codex Completion endpoint and iterated over several prompt pipelines to create the conversational component. We also created a simple Python command line interface for debugging.

## Challenges we ran into

Data comes in many, many forms, and connecting Shareboard with all of them proved challenging. Using the Postgres connection string format, we were able to support a broad set of database configurations. We also supported CSV files through uploading to the Supabase dashboard. In the future, we would look into connecting NoSQL, Excel, and other data formats.

## Accomplishments that we're proud of

After quickly connecting to the OpenAI API, we were able to steadily optimize several aspects of our natural language features. We tested several OpenAI models and settled on the Codex davinci model trained heavily on code input. We used few-shot prompting to guide the model to generate simple, robust, and efficient SQL queries answering the user's questions. Finally, we include the generated query in the frontend to allow for more technical users to collaborate with the model and build upon its suggested queries. As a result of our effort here, the conversational component is very robust and scales well to unseen schemas.

## What we learned

Through building Shareboard, we gained a greater appreciation for the challenges of building a unified entrypoint to diverse data sources, and the applicability of large language models in simplifying the user experience. We became more proficient in LLM prompting and creating a complementary product to the model's strengths and weaknesses. We were very impressed with the multiple ways Supabase and Vercel sped up the development process, eliminating the need for a standalone backend, database, and OAuth authentication.

## What's next for Shareboard

Unlike most hackathon projects we have worked on in the past, we are very happy with how robust and generalizable Shareboard is. Instead of starting from scratch with best practices, we expect to be able to make just minor changes and launch as a fully-functional product. More concretely, we plan to enable additional data integrations, continue to refine the NLP methods, and expand on the visualizations/output formatting. We are very excited to go to market and validate the product in real-world use cases in academia and industry.
