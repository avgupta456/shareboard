import { forwardRef } from "react";

import { Avatar, Group, Select, Text } from "@mantine/core";

const data = [
  {
    image: "/postgres.svg",
    label: "PostgreSQL",
    value: "postgres",
  },
  {
    image: "/mysql.svg",
    label: "MySQL",
    value: "mysql",
  },
  {
    image: "/sqlserver.svg",
    label: "SQL Server",
    value: "sqlserver",
  },
  {
    image: "/sqlite.svg",
    label: "SQLite",
    value: "sqlite",
  },
  {
    image: "/mongo.svg",
    label: "MongoDB",
    value: "mongo",
  },
  {
    image: "/cockroach.svg",
    label: "CockroachDB",
    value: "cockroach",
  },
  {
    image: "/planetscale.svg",
    label: "PlanetScale",
    value: "planetscale",
  },
  {
    image: "/mariadb.png",
    label: "MariaDB",
    value: "mariadb",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar size="sm" src={image} />
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
);

const DBSelect = ({ setSelected }: { setSelected: (value: string) => void }) => (
  <Select
    placeholder="Select a Database"
    itemComponent={SelectItem}
    data={data}
    searchable
    maxDropdownHeight={400}
    nothingFound="No databases found"
    filter={(value, item) =>
      item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
      item.description.toLowerCase().includes(value.toLowerCase().trim())
    }
    onChange={(value) => setSelected(value)}
  />
);

export default DBSelect;
