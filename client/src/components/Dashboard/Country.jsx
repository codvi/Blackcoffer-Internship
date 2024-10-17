import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Flex,
  Heading,
  Select,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";

const CountryChart = ({ data }) => {
  const { colorMode } = useColorMode();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [chartData, setChartData] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Extract unique country names from the data
    const uniqueCountries = [...new Set(data.map((entry) => entry.country))];
    setCountries(uniqueCountries);
    setSelectedCountry(uniqueCountries[0]); // Set default selected country to the first one
  }, [data]);

  useEffect(() => {
    if (!selectedCountry) return;

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
      (sector) => sectors[sector]
    );

    const chartBackgroundColor =
      colorMode === "light"
        ? "rgba(79, 59, 169, 0.7)"
        : "rgba(144, 104, 190, 0.7)";

    setChartData({
      labels: sectorLabels,
      datasets: [
        {
          label: "Intensity",
          data: sectorIntensities,
          backgroundColor: chartBackgroundColor,
        },
      ],
    });
  }, [selectedCountry, data, colorMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        grid: {
          color: colorMode === "light" ? "gray.200" : "gray.900",
        },
      },
    },
  };

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
          w="200px"
          colorScheme="purple"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>
        <Box height="500px" width={"100%"}>
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </Box>
      </Flex>
    </Box>
  );
};

export default CountryChart;
