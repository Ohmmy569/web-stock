"use client";
import React, { use, useEffect } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";


import { z } from "zod";
import {
  Card,
  Container,
  Box,
  Button,
  TextInput,
  createTheme,
  MantineProvider,
  Center,
  rem,
  PasswordInput,
  Text,
  Image
} from "@mantine/core";

type account = {
  username: string;
  password: string;
};

export default function Page() {
  const schema = z.object({
    username: z.string().nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" }),
    password: z.string().nonempty({ message: "กรุณากรอกรหัสผ่าน" }),
  });




  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (data: account) => {
    try{
    const response = await fetch("/api/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  catch (error) {
    console.error("An unexpected error happened:", error);
  }
  };

  return (
    <Container size="responsive" py={100}>
      <Center>
        <Card bg="#F8F9FA" shadow="xs" padding="lg" withBorder w={500}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.onSubmit((data) => {
                handlesubmit(data);
                form.reset();
              })();
            }}
          >
            <Card.Section
            >
             <Image
     
      alt="Banner"
      w="100%"
      h={290}
      radius="md"

  
      src="/banner.png"
      m={0}
    />
    </Card.Section>
            <Box mt={20}>
           
              <TextInput
                label="ชื่อผู้ใช้"
                placeholder="กรอกชื่อผู้ใช้งาน"
                mb={"xs"}
                {...form.getInputProps("username")}
              />
              <PasswordInput
                label="รหัสผ่าน"
                placeholder="กรอกรหัสผ่าน"
                type="password"
                mb={"xs"}
                {...form.getInputProps("password")}
              />
              <Center>
                <Button color="#070b91" fullWidth mt="md" type="submit">
                  Log In
                </Button>
              </Center>
            </Box>
          </form>
        </Card>
      </Center>
    </Container>
  );
}
