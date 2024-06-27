"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  users: User[];
}

const AddUserModal: React.FC<ModalProps> = ({
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
      username: "",
      password: "",
      confirm_password: "",
      role: "user",
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (data: any, users: User[]) => {
    try {
      if (data.password !== data.confirm_password) {
        showNotification({
          title: "รหัสผ่านไม่ตรงกัน",
          message: "กรุณากรอกรหัสผ่านให้ตรงกัน",
          color: "red",
          icon: null,
        });
        return;
      }

      //check if user already exists

      const username = data.username + "@gmail.com";
      const user = users.find((user) => user.email === username);

      if (user) {
        showNotification({
          title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
          message: "มีผู้ใช้งานนี้อยู่แล้ว",
          color: "red",
          icon: null,
        });
        return;
      }
      const password = data.password;
      const response = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      if (response) {
        const CollectionRef = collection(db, "user");
        const docRef = await addDoc(CollectionRef, {
          email: username,
          role: data.role,
          password: password,
          timestamp: serverTimestamp(),
        });

        showNotification({
          title: "เพิ่มผู้ใช้งานสำเร็จ",
          message: "เพิ่มผู้ใช้งานเรียบร้อยแล้ว",
          color: "green",
          icon: null,
        });
        onClose();
      }
    } catch (error) {
      showNotification({
        title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มผู้ใช้งาน",
        color: "red",
        icon: null,
      });
    }
  };
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data, users);
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
          <PasswordInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            type="password"
            mb={"xs"}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="ยืนยันรหัสผ่าน"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            type="password"
            mb={"xs"}
            {...form.getInputProps("confirm_password")}
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
              <Button color="green" mt="md" type="submit">
                เพิ่มผู้ใช้งาน
              </Button>
              <Button color="red" mt="md" onClick={onClose}>
                ยกเลิก
              </Button>
            </Group>
          </Center>
        </Box>
      </form>
    </Modal>
  );
};

export default AddUserModal;
