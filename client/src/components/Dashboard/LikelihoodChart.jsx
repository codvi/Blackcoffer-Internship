import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Heading } from "@chakra-ui/react";

const LikelihoodRadarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Prepare the data
    const likelihoodData = data.map((d) => d.likelihood);
    const countries = data.map((d) => d.country);
    const totalAxes = countries.length;
    const maxValue = 5; // Define dimensions

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2; // Create SVG

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`); // Radar chart scales

    const angleSlice = (Math.PI * 2) / totalAxes;
    const radarScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]); // Draw the radar chart circles

    svg
      .selectAll(".levels")
      .data(d3.range(1, maxValue + 1))
      .enter()
      .append("circle")
      .attr("class", "grid-circle")
      .attr("r", (d) => radarScale(d))
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("opacity", 0.3);

    svg
      .selectAll(".axis")
      .data(countries)
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", (d, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        return `rotate(${(angle * 180) / Math.PI}) translate(${radius},0)`;
      })
      .append("text")
      .attr("class", "country-label")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text((d) => d); // Radar chart lines and points

    const radarLine = d3
      .lineRadial()
      .radius((d) => radarScale(d))
      .angle((d, i) => i * angleSlice);

    svg
      .append("path")
      .datum(likelihoodData)
      .attr("class", "radar-area")
      .attr("d", radarLine)
      .style("fill", "rgba(79, 59, 169, 0.7)")
      .style("stroke", "rgba(79, 59, 169, 1)")
      .style("stroke-width", 2)
      .style("opacity", 0.7); // Tooltip on hover

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("display", "none");

    svg
      .selectAll(".radar-point")
      .data(likelihoodData)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("r", 5)
      .attr(
        "cx",
        (d, i) => radarScale(d) * Math.cos(i * angleSlice - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => radarScale(d) * Math.sin(i * angleSlice - Math.PI / 2)
      )
      .attr("fill", "white")
      .attr("stroke", "rgba(79, 59, 169, 1)")
      .attr("stroke-width", 2)
      .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event);
        tooltip
          .style("left", x + "px")
          .style("top", y - 20 + "px")
          .style("display", "inline-block")
          .html(`Likelihood: ${d}`);
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        tooltip.style("display", "none");
        d3.select(this).attr("opacity", 1);
      }); // Cleanup on unmount

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
      tooltip.remove();
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-xl mx-auto mt-8">
      <Heading as={"h2"} textAlign="left" mb={4} textColor={"black"} style={{ textAlign: "left" }}>
                  Likelihood Chart        {" "}
      </Heading>
            <svg  ref={chartRef}></svg>   {" "}
    </div>
  );
};

export default LikelihoodRadarChart;
