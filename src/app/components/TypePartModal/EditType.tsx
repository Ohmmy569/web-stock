"use client";
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

import { PartType } from "@/app/type";
import { useEffect } from "react";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  typeName:  string[] | undefined;
  TypePart : PartType;
  fetchPartType : () => void;
}


const EditTypePartModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  typeName,
    TypePart,
    fetchPartType
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


  const handlesubmit = async (data: any , typePartId : any) => {
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

      const res = await fetch(`/api/typeofparts/${typePartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
        }),
      });
      if (res.ok) {
        showNotification({
          title: "แก้ไขประเภทอ่ะไหล่สำเร็จ",
          message: "แก้ไขประเภท " + data.name + " สำเร็จ",
          color: "green",
          icon: null,
        });
        fetchPartType();
        form.reset();
      } else {
        showNotification({
          title: "แก้ไขประเภทอ่ะไหล่สำเร็จ",
          message: "เกิดข้อผิดพลาดระหว่างแก้ไขประเภทอ่ะไหล่",
          color: "red",
          icon: null,
        });
      }
    } catch (error) {
  
      showNotification({
        title: "แก้ไขประเภทอ่ะไหล่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างแก้ไขประเภทอ่ะไหล่",
        color: "red",
        icon: null,
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data , TypePart._id);
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
