import { useState, useEffect } from "react";
import * as d3 from "d3";
import { Graph } from "../components/graph";
import { TreeMap } from "../components/treemap";
import { getTree } from "../utils/getTree";

// The data is from the healthcare dataset.
const csvUrl = "https://gist.githubusercontent.com/hogwild/a716b6186d730c1d86962e9acaa1e59f/raw/aca017d18e2330668ef2765c5c049f89becda4ac/healthcare_stroke_data.csv";

function useData(csvPath) {
  const [dataAll, setData] = useState(null);
  useEffect(() => {
    d3.csv(csvPath).then(data => setData(data));
  }, []);
  return dataAll;
}

const App = () => {
  const [selectedDisease, setSelectedDisease] = useState("stroke");
  const [firstAttr, setFirstAttr] = useState("stroke");
  const [secondAttr, setSecondAttr] = useState("null");
  const [thirdAttr, setThirdAttr] = useState("null");
  const [selectedCell, setSelectedCell] = useState(null); // for highlighting the selected cell in the treemap

  const WIDTH = 600;
  const HEIGHT = 400;
  const margin = { top: 20, right: 40, bottom: 20, left: 40 };
  const rawData = useData(csvUrl);
  if (!rawData) {
    return <p>Loading...</p>;
  }

  const attributes = [firstAttr, secondAttr, thirdAttr].filter(d => d !== "null");
  const data = rawData.filter(d => d[selectedDisease] === "1");
  const tree_ = getTree(data, attributes);
  const tree = { name: "root", children: tree_ };

  const options = [
    { value: "null", label: "None" },
    { value: "gender", label: "Gender" },
    { value: "stroke", label: "Stroke" },
    { value: "heart_disease", label: "Heart Disease" },
    { value: "hypertension", label: "Hypertension" },
    { value: "ever_married", label: "Ever Married" }
  ];

  const diseaseOptions = [
    { value: "stroke", label: "Stroke" },
    { value: "heart_disease", label: "Heart Disease" }
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Healthcare Data</h1>
      <h2>Context</h2>
      <p>
        In this assignment, we use the <a href="https://gist.github.com/hogwild/a716b6186d730c1d86962e9acaa1e59f">healthcare dataset</a> containing information about patients with stroke and heart disease.
        We visualize relationships between different attributes in the dataset.
      </p>
      <ul>
        <li>id: unique identifier</li>
        <li>gender: "Male", "Female" or "Other"</li>
        <li>hypertension: 0 or 1</li>
        <li>heart_disease: 0 or 1</li>
        <li>ever_married: "Yes" or "No"</li>
        <li>stroke: 0 or 1</li>
      </ul>

      <h2>Node-linked diagram</h2>
      <p>The node-link diagram shows relationships between different attributes in the data.</p>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h4>Overview</h4>
          <p>Each node represents an attribute. Node size indicates frequency. Link width shows co-occurrence strength.</p>
        </div>
        <div style={{ flex: 2 }}>
          <Graph margin={margin} svg_width={WIDTH} svg_height={HEIGHT} data={rawData} />
        </div>
      </div>

      <h2>Treemap</h2>
      <p>
        The treemap visualizes hierarchical groupings (e.g., stroke occurrences across marriage or gender groups).
      </p>

      <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
        <div style={{ flex: 1 }}>
          <h4>Disease</h4>
          <select onChange={e => setSelectedDisease(e.target.value)} value={selectedDisease}>
            {diseaseOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <h4 style={{ marginTop: "1rem" }}>Attributes</h4>
          <label>First: </label>
          <select onChange={e => setFirstAttr(e.target.value)} value={firstAttr}>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <br />
          <label>Second: </label>
          <select onChange={e => setSecondAttr(e.target.value)} value={secondAttr}>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <br />
          <label>Third: </label>
          <select onChange={e => setThirdAttr(e.target.value)} value={thirdAttr}>
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 2 }}>
          <h4>{`Why do people get ${selectedDisease}?`}</h4>
          <TreeMap
            margin={margin}
            svg_width={WIDTH}
            svg_height={HEIGHT}
            tree={tree}
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
          />
        </div>
      </div>

      <h2>References</h2>
      <p>
        Data source: <a href="https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset">Stroke Prediction Dataset</a>
      </p>
    </div>
  );
};

export default App;
