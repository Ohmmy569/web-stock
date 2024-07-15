"use client";


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
  Nameusers: string[];
  fetchUser: () => void;
}

const AddUserModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  Nameusers,
  fetchUser,
}) => {
  const NameUsers = Nameusers || [];
  const schema = z.object({
    username: z.string()
    .nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" })
    .refine((value) => {
      if(NameUsers.includes(value + "@gmail.com")){
        return false;
        }
        return true;
        }, { message: "มีผู้ใช้งานนี้อยู่แล้ว" }),
    password: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
    confirm_password: z
      .string()
      .nonempty({ message: "กรุณายืนยันรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),

    

    role: z.string().nonempty({ message: "กรุณาเลือกสิทธิ์การใช้งาน" }),
  }).refine((data) => data.password == data.confirm_password, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirm_password"], 
  });;

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirm_password: "",
      role: "user",
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (data: any) => {
    try {
      const email = data.username + "@gmail.com";
      const password = data.password;
      if (data.password !== data.confirm_password) {
        showNotification({
          title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
          message: "กรุณากรอกรหัสผ่านให้ตรงกัน",
          color: "red",
          icon: null,
        });
        return;
      }

      const resCheckUser = await fetch("http://localhost:3000/api/checkUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const Isuser = await resCheckUser.json();

      if (Isuser === null) {
        showNotification({
          title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
          message: "มีผู้ใช้งานนี้อยู่แล้ว",
          color: "yellow",
          icon: null,
        });
        return;
      } else {
        const res = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            role: data.role,
          }),
        });

        if (res.ok) {
          showNotification({
            title: "เพิ่มผู้ใช้งานสำเร็จ",
            message: "เพิ่มผู้ใช้งาน " + data.username + " สำเร็จ",
            color: "green",
            icon: null,
          });
        } else {
          showNotification({
            title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
            message: "เกิดข้อผิดพลาดระหว่างเพิ่มผู้ใช้งาน",
            color: "red",
            icon: null,
          });
        }
        onClose();
        fetchUser();
      }
    } catch (error) {
      showNotification({
        title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มผู้ใช้งาน",
        color: "red",
        icon: null,
      });
      fetchUser();
    }
  };
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data);
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
                เพิ่ม
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
