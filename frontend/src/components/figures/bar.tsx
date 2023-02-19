import { ResponsiveBar } from "@nivo/bar";

export const getBarData = async (rawData) => {
  try {
    if (!rawData) return null;
    if (rawData.length === 0) return null;
    if (rawData[0].length < 2) return null;
    if (rawData[0].length > 2) return null;

    let keys = Object.keys(rawData[0]);

    let x = keys[0];
    let y = keys[1];

    if (Number.isNaN(parseFloat(rawData[0][y]))) return null;

    const data = rawData.map((d) => {
      return {
        name: d[x],
        value: parseFloat(d[y]),
      };
    });

    return data;
  } catch (e) {
    return null;
  }
};

const Bar = ({ data }) => {
  return (
    <ResponsiveBar
      data={data}
      keys={["value"]}
      indexBy="name"
      margin={{ top: 30, right: 30, bottom: 30, left: 60 }}
      enableLabel={false}
      padding={0.1}
    />
  );
};

export default Bar;
