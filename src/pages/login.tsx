import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Box, Flex, Link } from '@chakra-ui/react';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {

  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik 
        initialValues={{ usernameOrEmail: "", password: "" }} 
        onSubmit={
          async (values, { setErrors }) => { 
            const res = await login(values);
            if (res.data?.login.errors) {
              setErrors(toErrorMap(res.data.login.errors));
            }
            else if (res.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next)
              } else {
                router.push('/');
              }
            }
          }
        }>

        {({ isSubmitting }) => (
          <Form>
              <InputField 
                name="usernameOrEmail" 
                placeholder="username or email"
                label="Username or Email"
              />
            
            <Box mt={4}>
              <InputField 
                name="password" 
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Flex>
              <Box ml={'auto'} mt={5}>
                <NextLink href="/forgot-password">
                  <Link> Go to Forgot Password </Link>
                </NextLink>
              </Box>
            </Flex>            
            <Button mt={8} type="submit" isLoading={isSubmitting} colorScheme="teal"> Login </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(Login) 


