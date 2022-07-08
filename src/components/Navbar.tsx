// import React from 'react';
import React, { FunctionComponent } from 'react';
// import React, { PropsWithChildren, FunctionComponent, ReactNode } from 'react'; WithUrqlProps

import { Flex, Box, Link, Button, Heading } from '@chakra-ui/react';
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import isServer from '../utils/isServer';
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Navbar: React.FC = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer()
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {

  }
  else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login"><Link mr={3}> Login </Link></NextLink>
        <NextLink href="/register"><Link> Register </Link></NextLink> 
      </>
    );

  } else {
      body = (
        <Flex align="center">
          <NextLink href="/create-post">
            <Button as={Link} mr={4}> Create Post </Button>
          </NextLink> 
          <Box mr={3}> {data.me?.username} </Box>
          <Button 
            onClick={() => logout()} 
            variant="link"
            isLoading={logoutFetching}
          > Logout </Button>
        </Flex> 
      );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="yellow" p={4} align="center">
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link mr={3}> <Heading fontSize="xl">Crowdly</Heading> </Link>
        </NextLink>
        <Box ml={"auto"}>
          {body}
        </Box>
      </Flex>
    </Flex>
  );
}

export default withUrqlClient(createUrqlClient)
// (Navbar);
 (Navbar as FunctionComponent);



