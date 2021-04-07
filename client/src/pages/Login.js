import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { login } from "api/handler/auth";
import { Form, Formik } from "formik";
import React from "react";
import { Link as RLink, useHistory } from "react-router-dom";
import userStore from "stores/userStore";
import toErrorMap from "utils/toErrorMap";
import InputField from "components/shared/InputField";
import { LoginSchema } from "validation/auth.schema";

export default function Login() {
  const history = useHistory();
  const setUser = userStore((state) => state.setUser);

  const handleLogIn = async (values, { setErrors }) => {
    try {
      const { data } = await login(values);
      if (data) {
        setUser(data);
        history.push("/channels/me");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setErrors({ password: "Invalid email or password 😢" });
      } else if (error?.response?.status === 404) {
        setErrors({ email: "No user found with this email 😟 " });
      } else {
        console.log(error);
        setErrors(toErrorMap(error));
      }
    }
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Box px={4} width="full" maxWidth="500px" textAlign="center">
        <Flex mb="4" justify="center">
          <Image src="/discord-logo.png" w="80px" />
        </Flex>
        <Box p={4} borderRadius={4} background="brandGray.light">
          <Box textAlign="center">
            <Heading fontSize="24px">Welcome Back</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleLogIn}
            >
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    label="Email"
                    name="email"
                    autoComplete="email"
                    type="email"
                  />
                  <InputField
                    label="password"
                    name="password"
                    autoComplete="password"
                    type="password"
                  />

                  <Box mt={4}>
                    <Link
                      as={RLink}
                      to="/forgot-password"
                      textColor="highlight.standard"
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  <Button
                    background="highlight.standard"
                    color="white"
                    width="full"
                    mt={4}
                    type="submit"
                    isLoading={isSubmitting}
                    _hover={{ bg: "highlight.hover" }}
                    _active={{ bg: "highlight.active" }}
                    _focus={{ boxShadow: "none" }}
                  >
                    Login
                  </Button>
                  <Text mt="4">
                    Don't have an account yet?{" "}
                    <Link
                      as={RLink}
                      to="/register"
                      textColor="highlight.standard"
                    >
                      Sign Up
                    </Link>
                  </Text>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
