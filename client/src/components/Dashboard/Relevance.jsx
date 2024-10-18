import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Heading } from "@chakra-ui/react";

const RelevanceBubbleChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 300;

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.likelihood) + 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.impact) + 1])
      .range([height - margin.bottom, margin.top]);

    const rScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => Math.max(d.relevance * 5, d.intensity))])
      .range([0, 50]);

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "bg-gray-50 rounded-lg shadow-md p-4");

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(xScale).tickSize(-height + margin.top + margin.bottom)
      )
      .attr("class", "text-gray-600")
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .text("Likelihood");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickSize(-width + margin.left + margin.right))
      .attr("class", "text-gray-600")
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -35)
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .text("Impact");

    ["relevance", "intensity"].forEach((key, index) => {
      svg
        .selectAll(`.${key}-bubbles`)
        .data(data)
        .enter()
        .append("circle")
        .attr("class", `${key}-bubbles`)
        .attr("cx", (d) => xScale(d.likelihood))
        .attr("cy", (d) => yScale(d.impact))
        .attr("r", (d) =>
          rScale(key === "relevance" ? d.relevance * 5 : d.intensity)
        )
        .attr("fill", index === 0 ? "#6366F1" : "#22C55E")
        .attr("opacity", 0.8)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 1)
            .attr("stroke-width", 2)
            .attr(
              "r",
              rScale(key === "relevance" ? d.relevance * 6 : d.intensity * 1.2)
            );

          svg
            .append("text")
            .attr("id", "tooltip")
            .attr("x", xScale(d.likelihood) + 10)
            .attr("y", yScale(d.impact) - 10)
            .attr("fill", "white")
            .attr("class", "text-sm bg-black p-1 rounded-md shadow-lg")
            .text(`Relevance: ${d.relevance}, Intensity: ${d.intensity}`);
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 0.8)
            .attr("stroke-width", 1)
            .attr(
              "r",
              rScale(key === "relevance" ? data.relevance * 5 : data.intensity)
            );

          d3.select("#tooltip").remove();
        });
    });
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Heading as={"h2"} textAlign="left" mb={4} style={{ textAlign: "left" }}>
                  Relevance Chart        {" "}
      </Heading>{" "}
      <svg ref={svgRef} className="w-full h-[600px]" />
    </div>
  );
};

export default RelevanceBubbleChart;
