// components/treemap.js
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Treemap({ tree, svg_width, svg_height }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!tree || !tree.children) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3
      .hierarchy(tree)
      .sum((d) => d.value || 0)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([svg_width, svg_height])
      .paddingInner(2)
      .paddingOuter(2)
      .tile(d3.treemapResquarify)(root);

    const color = d3.scaleOrdinal(d3.schemeSet3);

    const nodes = svg
      .append("g")
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    nodes
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", (d) => color(d.parent.data.name));

    nodes
      .append("text")
      .attr("x", 4)
      .attr("y", 14)
      .text((d) => `${d.data.name} (${d.data.value})`)
      .style("font-size", "10px")
      .style("fill", "black");
  }, [tree, svg_width, svg_height]);

  return (
    <svg
      ref={svgRef}
      width={svg_width}
      height={svg_height}
      viewBox={`0 0 ${svg_width} ${svg_height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
