import React from 'react';
import { Heading } from '@chakra-ui/react';
import { usePostQuery } from '../../generated/graphql';
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Layout from '../../components/Layout';


const Post: React.FC = () => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, fetching } ] = usePostQuery({
    pause: intId == -1,
    variables: {
      id: intId
    }
  });

  
  if (fetching)
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  
  if (!data.post)
    return (
      <Layout>
        <div>could not find post</div>
      </Layout>
    );
    return (
      <Layout>
        <Heading fontSize="xl">{data.post.title}</Heading>
        <div>{data.post.text}</div>
      </Layout>
    )
}


export default withUrqlClient(createUrqlClient, { ssr: true })(Post);

