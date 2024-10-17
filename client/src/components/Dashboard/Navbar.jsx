import React from "react";
import {
  Box,
  Flex,
  Container,
  Input,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const toast = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };
  return (
    <Box
      py={2}
      bgGradient="linear(to-b, #4F3BA9, #9068BE)"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center">
          <Box w="80%">
            <Input
              type="text"
              placeholder="Search..."
              size="sm"
              borderRadius="full"
              bg={"white"}
              px={4}
              py={1}
              color={"white"}
              _placeholder={{
                color:"gray.500" ,
              }}
              _focus={{ outline: "none" }}
            />
          </Box>
          <Box>
            <Flex align="center">
              
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon boxSize={6} />}
                  variant="unstyled"
                />
                <MenuList>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
              <Avatar
                size="sm"
                src="https://avatars.githubusercontent.com/u/110231091?s=400&u=dfefa66e38cbdd84674e1a9f55737a51827b8725&v=4"
                ml={3}
              />
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
