import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Heading, Select } from '@chakra-ui/react';

const RegionChart = ({ data }) => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [filteredData, setFilteredData] = useState(data);

  // Function to handle filter change
  const handleFilterChange = (event) => {
    const region = event.target.value;
    setSelectedRegion(region);
  };

  // Update the chart data based on the selected filter
  useEffect(() => {
    if (selectedRegion === 'All') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.region === selectedRegion));
    }
  }, [selectedRegion, data]);

  // Calculate region counts based on filtered data
  const regionCounts = {};
  filteredData.forEach(item => {
    if (item.region in regionCounts) {
      regionCounts[item.region]++;
    } else {
      regionCounts[item.region] = 1;
    }
  });

  // Chart data for Doughnut chart
  const chartData = {
    labels: Object.keys(regionCounts),
    datasets: [
      {
        data: Object.values(regionCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#FF9800',
          '#9C27B0',
          '#3F51B5',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#FF9800',
          '#9C27B0',
          '#3F51B5',
        ],
      },
    ],
  };

  // Get unique regions for the filter dropdown
  const uniqueRegions = ['All', ...new Set(data.map(item => item.region))];

  return (
    <Box>
      <Heading as="h2" mb={4} textColor={'black'}>
        Region Distribution
      </Heading>
      <Select
        placeholder="Select Region"
        value={selectedRegion}
        onChange={handleFilterChange}
        mb={4}
textColor={'white'}
bg={'black'}
      >
        {uniqueRegions.map((region, index) => (
          <option key={index} value={region}>
            {region}
          </option>
        ))}
      </Select>
      <Doughnut data={chartData} />
    </Box>
  );
};

export default RegionChart;
