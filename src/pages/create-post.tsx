import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Box } from '@chakra-ui/react';
import Layout from '../components/Layout';
import InputField from '../components/InputField';
import { useCreatePostMutation } from '../generated/graphql';
// import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from '../utils/useIsAuth';



const CreatePost: React.FC<{}> = ({}) => {
  const [, createPost] = useCreatePostMutation();
  useIsAuth();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Formik 
        initialValues={{ title: "", text: "", }} 
        onSubmit={async (values) => { 
          const { error } = await createPost({ input : values });
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
            
            <Button mt={8} type="submit" isLoading={isSubmitting} colorScheme="teal"> Create Post </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}


export default withUrqlClient(createUrqlClient)(CreatePost) 
