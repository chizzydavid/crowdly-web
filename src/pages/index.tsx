import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery, useMeQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import { Stack, Flex, Button } from "@chakra-ui/react";
import PostCard from "../components/PostCard";
import { useState } from "react";

const Index = () => {
  const [variables, setVariables] = useState({ limit: 20, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({
    variables
  });
  const [{ data: me, }] = useMeQuery();

  if (!fetching && !data) {
    return <div> No posts to display </div>
  }

  return ( 
    <Layout>
      {!data && fetching ? <p> loading... </p> : 
        <Stack spacing={8} py={7}>
          {
          data.posts.posts.map((p) => 
            !p 
              ? null 
              : ( <PostCard belongsToUser={me.me?.id === p.creator.id} key={p.id} post={p}/> ))}
        </Stack>
      }

      {data && data.posts.hasMore && <Flex>
        <Button 
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
            })
          }}
          variant="solid" 
          colorScheme="whatsapp"
        > Load More </Button>
      </Flex>
      }
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
