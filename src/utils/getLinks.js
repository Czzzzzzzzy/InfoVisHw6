import { groups } from "d3";

export function getLinks({ rawData }) {
  const links = [];

  const genderHeart = groups(rawData, d => d.gender, d => d.heart_disease);
  links.push({ source: "male", target: "heart_disease", value: genderHeart[0][1][1][1]?.length || 0 });
  links.push({ source: "female", target: "heart_disease", value: genderHeart[1][1][1][1]?.length || 0 });

  const strokeHeart = groups(rawData, d => d.heart_disease, d => d.stroke);
  links.push({ source: "heart_disease", target: "stroke", value: strokeHeart[1][1][1][1]?.length || 0 });

  const heartHyper = groups(rawData, d => d.heart_disease, d => d.hypertension);
  links.push({ source: "heart_disease", target: "hypertension", value: heartHyper[1][1][1][1]?.length || 0 });

  const heartMarried = groups(rawData, d => d.heart_disease, d => d.ever_married);
  links.push({ source: "heart_disease", target: "ever_married", value: heartMarried[1][1][0][1]?.length || 0 });
  links.push({ source: "heart_disease", target: "never_married", value: heartMarried[1][1][1][1]?.length || 0 });

  const strokeGender = groups(rawData, d => d.stroke, d => d.gender);
  links.push({ source: "stroke", target: "male", value: strokeGender[1][1][0][1]?.length || 0 });
  links.push({ source: "stroke", target: "female", value: strokeGender[1][1][1][1]?.length || 0 });

  const strokeHyper = groups(rawData, d => d.stroke, d => d.hypertension);
  links.push({ source: "stroke", target: "hypertension", value: strokeHyper[1][1][1][1]?.length || 0 });

  const strokeMarried = groups(rawData, d => d.stroke, d => d.ever_married);
  links.push({ source: "stroke", target: "ever_married", value: strokeMarried[1][1][0][1]?.length || 0 });
  links.push({ source: "stroke", target: "never_married", value: strokeMarried[1][1][1][1]?.length || 0 });

  const hyperGender = groups(rawData, d => d.hypertension, d => d.gender);
  links.push({ source: "hypertension", target: "male", value: hyperGender[1][1][0][1]?.length || 0 });
  links.push({ source: "hypertension", target: "female", value: hyperGender[1][1][1][1]?.length || 0 });

  const hyperMarried = groups(rawData, d => d.hypertension, d => d.ever_married);
  links.push({ source: "hypertension", target: "ever_married", value: hyperMarried[1][1][0][1]?.length || 0 });
  links.push({ source: "hypertension", target: "never_married", value: hyperMarried[1][1][1][1]?.length || 0 });

  return links;
}
