import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useUpdatePostMutation, usePostQuery } from '../../../generated/graphql';
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import Layout from '../../../components/Layout';
import { useIsAuth } from '../../../utils/useIsAuth';
import { Formik, Form } from 'formik';
import InputField from '../../../components/InputField';

const EditPost: React.FC = () => {
  const [, updatePost] = useUpdatePostMutation();
  useIsAuth();
  const router = useRouter();
  const postId = parseInt(router.query.id as string);

  const [{ fetching, data } ] = usePostQuery({
    variables: { id: postId }
  });
  
  if (fetching)
  return (<div> loading.. </div>)

  if (!data.post)
  return (<div> could not find post </div>)

  return (
    <Layout variant="small">
      <Formik 
        initialValues={{ title: data.post.title, text: data.post.text }} 
        onSubmit={async (values) => { 
          const { error } = await updatePost({ 
            id: postId,
            text: values.text,
            title: values.title
           });
          if (!error) {
            router.push('/');
          }
        }}>

        {({ isSubmitting }) => (
          <Form>
              <InputField 
                name="title" 
                placeholder="title"
                label="Title"
              />

            <Box mt={4}>
              <InputField 
                textarea
                name="text" 
                placeholder="text.."
                label="Body"
              /> 
            </Box>            
            
            <Button 
              mt={8} 
              type="submit" 
              isLoading={isSubmitting} 
              colorScheme="teal"
            > 
              Update Post 
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}


export default withUrqlClient(createUrqlClient)(EditPost);

