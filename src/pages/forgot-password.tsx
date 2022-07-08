import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, Box, Link, Flex } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient, } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [messageResponse, setMessageResponse] = useState('');
  const [, forgotPassword] = useForgotPasswordMutation();

  
  return (
    <Wrapper variant="small">
      <Formik 
        initialValues={{ email: "" }} 
        onSubmit={async (values) => { 
          await forgotPassword(values);
          setMessageResponse('Instructions have been sent to this email address')
        }}>

      {({ isSubmitting }) => messageResponse ? (<Box> {messageResponse} </Box>) : (
          <Form>
            <Box mt={4}>
              <InputField 
                name="email" 
                placeholder="email"
                label="Email"
                type="email"
              />
            </Box>

            <Button mt={8} type="submit" isLoading={isSubmitting} colorScheme="teal"> Submit </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);

