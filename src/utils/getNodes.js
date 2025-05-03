import { groups } from "d3";

export function getNodes({ rawData }) {
  const nodes = [];

  const heartDisease = groups(rawData, d => d.heart_disease);
  nodes.push({ name: "heart_disease", value: heartDisease[1]?.[1]?.length || 0 });

  const married = groups(rawData, d => d.ever_married);
  nodes.push({ name: "ever_married", value: married[0][1].length });
  nodes.push({ name: "never_married", value: married[1][1].length });

  const hypertension = groups(rawData, d => d.hypertension);
  nodes.push({ name: "hypertension", value: hypertension[1]?.[1]?.length || 0 });

  const gender = groups(rawData, d => d.gender);
  nodes.push({ name: "male", value: gender[0][1].length });
  nodes.push({ name: "female", value: gender[1][1].length });

  const stroke = groups(rawData, d => d.stroke);
  nodes.push({ name: "stroke", value: stroke[1]?.[1]?.length || 0 });

  return nodes;
}
