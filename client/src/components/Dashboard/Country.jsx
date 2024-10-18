import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Select,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import * as d3 from "d3";

const CountryChart = ({ data }) => {
  const { colorMode } = useColorMode();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const uniqueCountries = [...new Set(data.map((entry) => entry.country))];
    setCountries(uniqueCountries);
    setSelectedCountry(uniqueCountries[0]); 
  }, [data]);

  useEffect(() => {
    if (!selectedCountry) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const countryData = data.filter(
      (entry) => entry.country === selectedCountry
    );

    const sectors = {};
    countryData.forEach((entry) => {
      if (!sectors[entry.sector]) {
        sectors[entry.sector] = [];
      }
      sectors[entry.sector].push(entry.intensity);
    });

    const sectorLabels = Object.keys(sectors);
    const sectorIntensities = sectorLabels.map(
      (sector) => d3.sum(sectors[sector]) // Summing up intensities
    );

    const chartWidth = 1800;
    const chartHeight = 500;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    const xScale = d3
      .scaleBand()
      .domain(sectorLabels)
      .range([margin.left, chartWidth - margin.right])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(sectorIntensities)])
      .nice()
      .range([chartHeight - margin.bottom, margin.top]);

    const barColor =
      colorMode === "light" ? "rgba(79, 59, 169, 0.7)" : "rgba(144, 104, 190, 0.7)";

    svg
      .append("g")
      .selectAll("rect")
      .data(sectorIntensities)
      .join("rect")
      .attr("x", (d, i) => xScale(sectorLabels[i]))
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - margin.bottom - yScale(d))
      .attr("fill", barColor);

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }, [selectedCountry, data, colorMode]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <Box p={6} shadow="md" bg={useColorModeValue("white", "gray.800")} m={50}>
      <Flex direction="column" margin="auto">
        <Heading as={"h2"} textAlign="left" mb={4} style={{ textAlign: "left" }}>
          Country Chart
        </Heading>
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          mb={4}
          w="300px"
          colorScheme="purple"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
        <svg ref={chartRef} />
      </Flex>
    </Box>
  );
};

export default CountryChart;
