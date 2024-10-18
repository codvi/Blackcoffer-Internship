import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Box, Heading, Checkbox, CheckboxGroup } from '@chakra-ui/react';

const TopicsRadarChart = ({ data }) => {
  const chartRef = useRef(null);
  const width = 700;
  const height = 700;
  const levels = 5; 
  const maxValue = 5; 

  const [selectedTopics, setSelectedTopics] = useState(data.map(item => item.topic));

  const filteredData = data.filter(item => selectedTopics.includes(item.topic));

  useEffect(() => {
    if (!filteredData || !chartRef.current) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const radius = Math.min(width / 2, height / 2);
    const angleSlice = (2 * Math.PI) / filteredData.length;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    svg.selectAll(".grid-circle")
      .data(d3.range(1, levels + 1).reverse())
      .enter().append("circle")
      .attr("class", "grid-circle")
      .attr("r", d => rScale(d * maxValue / levels))
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);

    const axisGrid = svg.append("g").attr("class", "axisWrapper");

    axisGrid.selectAll(".axis")
      .data(filteredData)
      .enter().append("g")
      .attr("class", "axis")
      .each(function (d, i) {
        d3.select(this).append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("y2", (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
          .attr("stroke", "gray");

        d3.select(this).append("text")
          .attr("x", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("y", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
          .attr("dy", "0.35em")
          .style("font-size", "12px")
          .style("text-anchor", "middle")
          .text(d => d.topic);
      });

    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.relevance))
      .angle((d, i) => i * angleSlice);

    const radarData = filteredData.map(item => item);

    svg.append("path")
      .datum(radarData)
      .attr("d", radarLine)
      .style("fill", "rgba(75, 192, 192, 0.6)")
      .style("stroke", "rgba(75, 192, 192, 1)")
      .style("stroke-width", 2)
      .style("fill-opacity", 0.6);

  }, [filteredData]);

  const handleTopicChange = (selected) => {
    setSelectedTopics(selected);
  };

  return (
    <div className="p-6" >
      <Box >
        <Heading as="h2" textColor={'black'}mb={5} >
          Topics Radar Chart
        </Heading>

        <Box mb={20}className="mb-6 p-6 border border-gray-200 rounded-lg">
          <CheckboxGroup value={selectedTopics} onChange={handleTopicChange} className="space-y-2">
            {data.map(item => (
              <Checkbox
                key={item.topic}
                value={item.topic}
                className="mr-2"
                textColor={'black'}
              >
                {item.topic}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Box>

        <div className='mt-10'>
          <Box className="mt-20 mx-auto" style={{ maxWidth: width }}>
            <svg ref={chartRef} className="mx-auto" />
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default TopicsRadarChart;
