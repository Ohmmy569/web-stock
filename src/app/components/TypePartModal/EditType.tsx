"use client";
import { db } from "@/app/firebase/firebase";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  addDoc,
  serverTimestamp,
  collection,
  updateDoc,
  doc,
} from "firebase/firestore";

import { PartType } from "@/app/type";
import { useEffect } from "react";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  typeName:  string[] | undefined;
  TypePart : PartType;
}


const EditTypePartModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  typeName,
    TypePart,
}) => {
  const TypeName = typeName || [];

  const schema = z.object({
    name: z
      .string()
      .nonempty({ message: "กรุณากรอกชื่อประเภท" })
      .refine(
        (value) => {
          if (TypeName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "ชื่อประเภทซ้ำ" }
      )
  });

  const form = useForm({
    initialValues: {
      name: TypePart?.name || ""
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setFieldValue("name", TypePart?.name || "");
  }, [TypePart]);


  const handlesubmit = async (data: any) => {
    try {
      if (TypeName.includes(data.name)) {
        showNotification({
          title: "ชื่อประเภทซ้ำ",
          message: "กรุณากรอกชื่อประเภทใหม่",
          color: "red",
          icon: null,
        });
        return;
      }

      const collectionRef = collection(db, "typeofparts");
      const docRef = doc(collectionRef, TypePart.id);
      await updateDoc(docRef, {
        name: data.name,
        timestamp: serverTimestamp(),
      });
      showNotification({
        title: "เพิ่มประเภทอ่ะไหล่สำเร็จ",
        message: "เพิ่มประเภท " + data.name + " สำเร็จ",
        color: "blue",
        icon: null,
      });
      form.reset();
    } catch (error) {
  
      showNotification({
        title: "เพิ่มประเภทอ่ะไหล่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มประเภทอ่ะไหล่",
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
            handlesubmit(data);
            form.reset();
            onClose();
          })();
        }}
      >
        <Box>
          <TextInput
            label="ชื่อประเภทอ่ะไหล่"
            placeholder="กรอกประเภทอ่ะไหล่"
            mb={"xs"}
            {...form.getInputProps("name")}
          />
          <Center>
            <Group justify="space-between" mt={15}>
              <Button color="green" mt="md" type="submit">
                ยืนยัน
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

export default EditTypePartModal;
