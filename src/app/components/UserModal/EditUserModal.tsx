"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/firebase";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { User } from "@/app/type";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  users: User;
}

const EditUserModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  users,
}) => {
  const schema = z.object({
    username: z.string().nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" }),
    password: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
    confirm_password: z
      .string()
      .nonempty({ message: "กรุณายืนยันรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),

    role: z.string().nonempty({ message: "กรุณาเลือกสิทธิ์การใช้งาน" }),
  });

  const form = useForm({
    initialValues: {
      username: users?.email || "",
      password: users?.password || "",
      role: users?.role || "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setValues({
      username: users?.email || "",
      password: users?.password || "",
      role: users?.role || "",
    });
  }, [users]);

  function onClosed() {
    onClose();
    form.reset();
  }
  

  const handlesubmit = async (data: any, users: User[]) => {
    //leave this for now
  };
  return (
    <Modal opened={opened} onClose={onClosed} title={title}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            form.reset();
          })();
        }}
      >
        <Box>
          <TextInput
            label="ชื่อผู้ใช้"
            placeholder="กรอกชื่อผู้ใช้งาน"
            mb={"xs"}
            {...form.getInputProps("username")}
          />
          <TextInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            mb={"xs"}
            {...form.getInputProps("password")}
            disabled
          />
          <Select
            label="สิทธิ์การใช้งาน"
            placeholder="เลือกสิทธิ์การใช้งาน"
            data={[
              { value: "admin", label: "admin" },
              { value: "user", label: "user" },
            ]}
            {...form.getInputProps("role")}
          />
          <Center>
            <Group justify="space-between" mt={15}>
              {" "}
              <Button color="red" mt="md" onClick={onClosed}>
                ยกเลิก
              </Button>
            </Group>
          </Center>
        </Box>
      </form>
    </Modal>
  );
};

export default EditUserModal;
