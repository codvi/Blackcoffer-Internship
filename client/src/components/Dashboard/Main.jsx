import React, { useState, useEffect } from "react";
import axios from "axios";
import IntensityChart from "./IntensityChart";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Navbar from "./Navbar";
import RegionChart from "./RegionChart";
import { ChakraProvider, Flex, Box, Grid, Center } from "@chakra-ui/react";
import RelevanceBubbleChart from "./Relevance";
import TopicsRadarChart from "./TopicChart";
import PieChart from "./SectorChart";
import CountryChart from "./Country";
import LikelihoodRadarChart from "./LikelihoodChart";

Chart.register(CategoryScale);

const Main = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      const API_URL = "http://localhost:5000";
      try {
        const response = await axios.get(`${API_URL}/api/data`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataFromApi();
  }, []);

  return (
    <ChakraProvider>
      <Navbar />
      <IntensityChart data={data} />
      <Flex direction={{ base: "column", md: "row" }} m={50}>
        <Box
          flex={{ base: "1", md: "0.5" }}
          maxW="50%"
          p={5}
          m={2}
          bg="#F0FFF4"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
          borderRadius={20}
          _hover={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" }}
        >
          <RegionChart data={data} />
        </Box>
        <Box
          flex={{ base: "1", md: "0.5" }}
          maxW="50%"
          p={5}
          m={2}
          bg="#E6FFFA"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
          borderRadius={20}
          _hover={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)" }}
        >
          <TopicsRadarChart data={data} />
        </Box>
      </Flex>
      <RelevanceBubbleChart data={data} />
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={8} alignContent={"center"}>
            <Box
              bg="white"
              p={6}
              boxShadow="lg"
              rounded="lg"
              _hover={{ boxShadow: "xl" }}
            >
              <PieChart data={data} />
            </Box>
            <Box
              bg="white"
              p={6}
              boxShadow="lg"
              rounded="lg"
              _hover={{ boxShadow: "xl" }}
            >
              <LikelihoodRadarChart data={data} />
            </Box>
          </Grid>
          <CountryChart data={data} />
    </ChakraProvider>
  );
};

export default Main;
