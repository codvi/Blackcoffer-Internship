import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Heading, Select, Box } from '@chakra-ui/react';

const IntensityChart = ({ data }) => {
  const chartRef = useRef(null);
  const [xAxis, setXAxis] = useState('start_year'); // State to toggle between start_year and end_year

  useEffect(() => {
    // Set up data depending on selected x-axis
    const intensityData = data.map((item) => item.intensity);
    const years = data.map((item) => item[xAxis]);

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 1800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.2);
    const yScale = d3.scaleLinear().domain([0, d3.max(intensityData)]).range([height, 0]);

    const colorScale = d3.scaleThreshold()
      .domain([d3.max(intensityData) / 4, (d3.max(intensityData) / 4) * 2, (d3.max(intensityData) / 4) * 3])
      .range(['#2563eb', '#4ade80', '#fbbf24', '#f87171']); // Tailwind blue-500, green-400, yellow-400, red-400

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'bg-gray-800 text-white p-2 rounded-lg text-sm absolute hidden') // Tailwind for tooltip
      .style('position', 'absolute')
      .style('pointer-events', 'none');

    svg
      .selectAll('.bar')
      .data(intensityData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(years[i]))
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d))
      .attr('fill', (d) => colorScale(d))
      .on('mouseover', function (event, d) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 25}px`)
          .style('display', 'inline-block')
          .html(`Intensity: ${d}`);
        d3.select(this).attr('opacity', 0.8); // Highlight bar on hover
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 25}px`);
      })
      .on('mouseout', function () {
        tooltip.style('display', 'none');
        d3.select(this).attr('opacity', 1); // Restore bar opacity
      });

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append('g').call(d3.axisLeft(yScale));

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text(xAxis === 'start_year' ? 'Start Year' : 'End Year');

    svg
      .append('text')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text('Intensity (%)');

    return () => {
      d3.select(chartRef.current).selectAll('*').remove();
      tooltip.remove(); // Remove tooltip on cleanup
    };
  }, [data, xAxis]);

  return (
    <Box className="my-12 p-4 rounded-lg shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
      <Heading as="h2" mb={4} className="text-lg font-bold text-center">Intensity Chart</Heading>
      <Select
        mb={4}
        value={xAxis}
        onChange={(e) => setXAxis(e.target.value)}
        width="200px"
        mx="auto"
        borderColor="gray.300"
        focusBorderColor="blue.500"
        placeholder="Select X-Axis"
      >
        <option value="start_year">Start Year</option>
        <option value="end_year">End Year</option>
      </Select>
      <svg ref={chartRef} className="mx-auto"></svg>
    </Box>
  );
};

export default IntensityChart;
