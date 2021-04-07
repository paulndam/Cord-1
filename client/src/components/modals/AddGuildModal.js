import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createGuild, joinGuild } from "api/handler/guilds";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import userStore from "stores/userStore";
import { gKey } from "utils/querykeys";
import toErrorMap from "utils/toErrorMap";
import { GuildSchema } from "validation/guild.schema";
import InputField from "components/shared/InputField";

export default function AddGuildModal({ isOpen, onClose }) {
  const [screen, setScreen] = useState("START");

  const goBack = () => setScreen("START");
  const submitClose = () => {
    setScreen("START");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={submitClose} isCentered size="sm">
      <ModalOverlay />
      {screen === "INVITE" && (
        <JoinServerModal goBack={goBack} submitClose={submitClose} />
      )}
      {screen === "CREATE" && (
        <CreateServerModal goBack={goBack} submitClose={submitClose} />
      )}
      {screen === "START" && (
        <ModalContent bg="brandGray.light">
          <ModalHeader textAlign="center" fontWeight="bold">
            Create a server
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing="5">
              <Text textAlign="center">
                Your server is where you and your friends hang out. Make yours
                and start talking.
              </Text>

              <Button
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: "highlight.hover" }}
                _active={{ bg: "highlight.active" }}
                _focus={{ boxShadow: "none" }}
                w="full"
                onClick={() => setScreen("CREATE")}
              >
                Create My Own
              </Button>

              <Divider />

              <Text>Have an invite already?</Text>

              <Button
                mt="4"
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: "highlight.hover" }}
                _active={{ bg: "highlight.active" }}
                _focus={{ boxShadow: "none" }}
                w="full"
                onClick={() => setScreen("INVITE")}
              >
                Join a Server
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
}

function JoinServerModal({ goBack, submitClose }) {
  const cache = useQueryClient();
  const history = useHistory();
  async function handleJoinServer(values, { setErrors }) {
    if (values.length === "") {
      setErrors({ link: "Please enter a valid link" });
    } else {
      try {
        const { data } = await joinGuild(values);
        if (data) {
          cache.invalidateQueries(gKey);
          submitClose();
          history.push(`/channels/${data.id}/${data.default_channel_id}`);
        }
      } catch (error) {
        const status = error?.response?.status;
        if (status === 404 || status === 400) {
          setErrors({ link: error?.response?.data?.message });
        } else {
          setErrors(toErrorMap(error));
        }
      }
    }
  }

  return (
    <ModalContent bg="brandGray.light">
      <Formik initialValues={{ link: "" }} onSubmit={handleJoinServer}>
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader textAlign="center" fontWeight="bold" pb="0">
              Join a Server
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={3}>
              <Text fontSize="14px" textColor="brandGray.accent">
                Enter an invite below to join an existing server
              </Text>
              <InputField label="invite link" name="link" />

              <Text
                mt="4"
                fontSize="12px"
                fontWeight="semibold"
                textColor="brandGray.accent"
                textTransform="uppercase"
              >
                invite links should look like
              </Text>

              <Text mt="2" fontSize="12px" textColor="brandGray.accent">
                drqgi2
              </Text>
              <Text fontSize="12px" textColor="brandGray.accent">
                https://discord.gg/drqgi2
              </Text>
            </ModalBody>

            <ModalFooter bg="brandGray.dark">
              <Button mr={6} variant="link" onClick={goBack} fontSize={"14px"}>
                Back
              </Button>
              <Button
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: "highlight.hover" }}
                _active={{ bg: "highlight.active" }}
                _focus={{ boxShadow: "none" }}
                isLoading={isSubmitting}
                fontSize={"14px"}
              >
                Join Server
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </ModalContent>
  );
}

function CreateServerModal({ goBack, submitClose }) {
  const current = userStore((state) => state.current);
  const history = useHistory();
  const cache = useQueryClient();

  async function handleCreateServer(values, { setErrors }) {
    try {
      const { data } = await createGuild(values);
      if (data) {
        cache.setQueryData(gKey, (guilds) => {
          return [...guilds, data];
        });
        submitClose();
        history.push(`/channels/${data.id}/${data.default_channel_id}`);
      }
    } catch (errors) {
      setErrors(toErrorMap(errors));
    }
  }

  return (
    <ModalContent bg="brandGray.light">
      <Formik
        initialValues={{
          name: `${current.username}'s server`,
        }}
        validationSchema={GuildSchema}
        onSubmit={handleCreateServer}
      >
        {({ isSubmitting, values }) => (
          <Form initialValues={{ name: `${current.username}'s server 😎 ` }}>
            <ModalHeader textAlign="center" fontWeight="bold" pb="0">
              Create your server
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={3}>
              <InputField label="server name" name="name" value={values.name} />
            </ModalBody>

            <ModalFooter bg="brandGray.dark">
              <Button mr={6} fontSize={"14px"} variant="link" onClick={goBack}>
                Back
              </Button>
              <Button
                background="highlight.standard"
                color="white"
                type="submit"
                _hover={{ bg: "highlight.hover" }}
                _active={{ bg: "highlight.active" }}
                _focus={{ boxShadow: "none" }}
                isLoading={isSubmitting}
                fontSize={"14px"}
              >
                Create
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </ModalContent>
  );
}
