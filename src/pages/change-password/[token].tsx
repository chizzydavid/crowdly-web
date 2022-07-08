import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, Box, Link, Flex } from '@chakra-ui/react';
import Wrapper from '../../components/Wrapper';
import InputField from '../../components/InputField';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { NextPage } from 'next';
import NextLink from "next/link";


const ChangePassword: NextPage = () => {
  const [tokenErr, setTokenErr] = useState('');
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  
  return (
    <Wrapper variant="small">
      <Formik 
        initialValues={{ newPassword: "" }} 
        onSubmit={async (values, { setErrors }) => { 
          const res = await changePassword({
            newPassword: values.newPassword,
            token: typeof router.query.token === "string" ? router.query.token : ""
          });

          if (res.data?.changePassword.errors) {
            const errors = toErrorMap(res.data.changePassword.errors);
            if ("token" in errors) {
              setTokenErr(errors.token);
            }
            setErrors(errors);
          }
          else if (res.data?.changePassword.user) {
            router.push('/');
          }
        }}>

        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField 
                name="newPassword" 
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>

            {tokenErr ? <Box style={{ color: 'red' }}> {tokenErr} </Box> : null}
            <Flex>
              <Box ml={'auto'} mt={5}>
                <NextLink href="/forgot-passord">
                  <Link> Go to Forgot Password </Link>
                </NextLink>
              </Box>
            </Flex>
            <Button mt={8} type="submit" isLoading={isSubmitting} colorScheme="teal"> Change Password </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}


export default withUrqlClient(createUrqlClient)(ChangePassword);

