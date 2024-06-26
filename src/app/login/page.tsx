"use client";
import React, { use, useEffect } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { signIn, signOut } from "next-auth/react";
import { auth } from "@/app/firebase/firebase";
import { useRouter } from "next/navigation";
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
  Image,
  Notification,
} from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

type account = {
  username: string;
  password: string;
};

export default function Page() {
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const schema = z.object({
    username: z.string().nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" }),
    password: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  });

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  //register
  // const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  // const handlesubmit = async (data: account) => {
  //   try {
  //     const response = await createUserWithEmailAndPassword(data.username, data.password);
  //     console.log("User created successfully:", response);
  //   } catch (error) {
  //     console.error("An unexpected error happened:", error);
  //   }
  // };

  const router = useRouter();
  const handlesubmit = async (data: account) => {
    try {
      const username = data.username + "@gmail.com";
      const password = data.password;
      const response = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (response?.error) {
        showNotification({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          color: "red",
          icon: xIcon,
        });
      } else {
        showNotification({
          title: "เข้าสู่ระบบสำเร็จ",
          message: "ยินดีต้อนรับเข้าสู่ระบบ",
          color: "green",
          icon: checkIcon,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      showNotification({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ",
        color: "yellow",
        icon: xIcon,
      });
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
            <Card.Section>
              <Image
                alt="Banner"
                w="100%"
                h={260}
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
