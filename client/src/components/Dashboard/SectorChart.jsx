import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Box, Heading, Select } from "@chakra-ui/react";

const SectorChart = ({ data }) => {
  const [selectedSector, setSelectedSector] = useState("All");
  const [filteredData, setFilteredData] = useState(data);

  const handleFilterChange = (event) => {
    const sector = event.target.value;
    setSelectedSector(sector);
  };

  useEffect(() => {
    if (selectedSector === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.sector === selectedSector));
    }
  }, [selectedSector, data]);

  const sectorCounts = {};
  filteredData.forEach((item) => {
    if (item.sector in sectorCounts) {
      sectorCounts[item.sector]++;
    } else {
      sectorCounts[item.sector] = 1;
    }
  });

  const chartData = {
    labels: Object.keys(sectorCounts),
    datasets: [
      {
        data: Object.values(sectorCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
          "#9C27B0",
          "#3F51B5",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
          "#9C27B0",
          "#3F51B5",
        ],
      },
    ],
  };

  const uniqueSectors = ["All", ...new Set(data.map((item) => item.sector))];

  return (
    <Box>
           {" "}
      <Heading as="h2" mb={4} textColor={"black"}>
                Sector Distribution      {" "}
      </Heading>
           {" "}
      <Select
        placeholder="Select Sector"
        value={selectedSector}
        onChange={handleFilterChange}
        mb={4}
        textColor={"white"}
        bg={"black"}
      >
               {" "}
        {uniqueSectors.map((sector, index) => (
          <option key={index} value={sector}>
                        {sector}         {" "}
          </option>
        ))}
             {" "}
      </Select>
            <Pie data={chartData} />   {" "}
    </Box>
  );
};

export default SectorChart;
