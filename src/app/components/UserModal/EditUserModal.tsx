"use client";
import { use, useEffect, useState } from "react";

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
  Nameusers: string[] | undefined;
  fetchUser : () => void;
}

const EditUserModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  users,
  Nameusers,
  fetchUser,
}) => {
  const schema = z.object({
    username: z
      .string()
      .nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" })
      .refine(
        (value) => {
          if (Nameusers?.includes(value)) {
            return false;
          }
          return true;
        },
        { message: "มีผู้ใช้งานนี้อยู่แล้ว" }
      ),
    password: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสผ่าน" })
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

  

  const handlesubmit = async (data: any , UserId : string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${UserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            email: data.username,
            role: data.role,
          }
        ),
      });
      if(res.ok){
        showNotification({
          title: "แก้ไขผู้ใช้งานสำเร็จ",
          message: "แก้ไขผู้ใช้งานสำเร็จ",
          color: "green",
        });
        fetchUser();
        onClose();
      }
    } catch (error: any) {
      showNotification({
        title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
        message: error.message,
        color: "red",
      });
      onClose();
    }
  };
  return (
    <Modal opened={opened} onClose={onClosed} title={title}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data , users._id);
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
              <Button color="green" mt="md" type="submit">
                ยืนยัน
              </Button>{" "}
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
