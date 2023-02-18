import { forwardRef } from "react";

import { Avatar, Group, Select, Text } from "@mantine/core";

const data = [
  {
    image: "/postgres.svg",
    label: "PostgreSQL",
    value: "postgres",
    disabled: true,
  },
  {
    image: "/mysql.svg",
    label: "MySQL",
    value: "mysql",
    disabled: true,
  },
  {
    image: "/sqlserver.svg",
    label: "SQL Server",
    value: "sqlserver",
    disabled: true,
  },
  {
    image: "/sqlite.svg",
    label: "SQLite",
    value: "sqlite",
    disabled: true,
  },
  {
    image: "/mongo.svg",
    label: "MongoDB",
    value: "mongo",
    disabled: true,
  },
  {
    image: "/cockroach.svg",
    label: "CockroachDB",
    value: "cockroach",
    disabled: false,
  },
  {
    image: "/planetscale.svg",
    label: "PlanetScale",
    value: "planetscale",
    disabled: true,
  },
  {
    image: "/mariadb.png",
    label: "MariaDB",
    value: "mariadb",
    disabled: true,
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  disabled: boolean;
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
    label="Database Type"
    placeholder="Select a Database"
    withAsterisk
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
