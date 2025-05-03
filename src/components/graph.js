import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getNodes } from '../utils/getNodes';
import { getLinks } from '../utils/getLinks';
import { drag } from '../utils/drag';

export function Graph(props) {
  const { margin, svg_width, svg_height, data } = props;

  const rawNodes = getNodes({ rawData: data });
  const links = getLinks({ rawData: data });

  const uniqueNodes = Array.from(
    new Map(rawNodes.map(d => [d.name.trim().toLowerCase(), { ...d, name: d.name.trim().toLowerCase() }])).values()
  );

  const nodeNames = new Set(uniqueNodes.map(d => d.name));
  const validLinks = links
    .map(link => ({
      ...link,
      source: link.source.trim().toLowerCase(),
      target: link.target.trim().toLowerCase()
    }))
    .filter(link => nodeNames.has(link.source) && nodeNames.has(link.target));

  const width = svg_width - margin.left - margin.right;
  const height = svg_height - margin.top - margin.bottom;

  const lineWidth = d3.scaleLinear()
    .range([2, 6])
    .domain(d3.extent(validLinks, d => d.value));

  const radius = d3.scaleLinear()
    .range([10, 50])
    .domain(d3.extent(uniqueNodes, d => d.value));

  const color = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
    .domain(uniqueNodes.map(d => d.name));

  const d3Selection = useRef();

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(d3Selection.current);
    svg.selectAll("*").remove();

    // ✅ 创建 HTML tooltip div（浮动不遮挡）
    let tooltipDiv = d3.select("#tooltip-div");
    if (tooltipDiv.empty()) {
      tooltipDiv = d3.select("body").append("div")
        .attr("id", "tooltip-div")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("padding", "6px")
        .style("font-size", "12px")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("visibility", "hidden")
        .style("z-index", "9999");
    }

    const g = svg.append("g");

    const simulation = d3.forceSimulation(uniqueNodes)
      .force("link", d3.forceLink(validLinks).id(d => d.name).distance(d => 20 / d.value))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(height / 2).strength(0.02))
      .force("collide", d3.forceCollide().radius(d => radius(d.value) + 20))
      .tick(3000);

    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(validLinks)
      .join("line")
      .attr("stroke-width", d => lineWidth(d.value));

    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(uniqueNodes)
      .enter()
      .append("g")
      .call(drag(simulation));

    node.append("circle")
      .attr("r", d => radius(d.value))
      .attr("fill", d => color(d.name))
      .on("mouseover", function (event, d) {
        tooltipDiv
          .style("visibility", "visible")
          .text(d.name);
      })
      .on("mousemove", function (event) {
        tooltipDiv
          .style("top", (event.pageY - 28) + "px")
          .style("left", (event.pageX + 12) + "px");
      })
      .on("mouseout", function () {
        tooltipDiv.style("visibility", "hidden");
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // ✅ 添加图例 Legend
    const legend = g.append("g")
      .attr("transform", "translate(0, 0)");

    const spacing = 20;
    const legendItems = uniqueNodes.map(d => d.name);

    legend.selectAll("rect")
      .data(legendItems)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * spacing)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d));

    legend.selectAll("text")
      .data(legendItems)
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * spacing + 12)
      .text(d => d)
      .attr("font-size", 12)
      .attr("fill", "black");
  }, [width, height, data]);

  return (
    <svg
      viewBox={`0 0 ${svg_width} ${svg_height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%" }}
    >
      <g ref={d3Selection} transform={`translate(${margin.left}, ${margin.top})`} />
    </svg>
  );
}
