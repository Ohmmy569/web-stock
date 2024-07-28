"use client";
import { Box, Button, Center, Group, Modal, TextInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import { PartType } from "@/app/type";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  typeName: string[] | undefined;
  TypePart: PartType;

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
      ),
  });

  const form = useForm({
    initialValues: {
      name: TypePart?.name || "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setFieldValue("name", TypePart?.name || "");
  }, [TypePart]);
  const [name , setName] = useState("");
  const queryClient = useQueryClient();
  const editMuntation = useMutation({
    mutationFn: async (id: any) => {
      await axios.put(`/api/typeofparts/${id}`, { name });
    },
    onSuccess: () => {
      showNotification({
        title: "แก้ไขประเภทอ่ะไหล่สำเร็จ",
        message: "แก้ไขประเภท "+ name +" อ่ะไหล่เรียบร้อย",
        color: "green",
        icon: null,
      });
      queryClient.invalidateQueries({ queryKey: ["PartTypes"] });
    },
    onError: () => {
      showNotification({
        title: "เพิ่มประเภทอ่ะไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มประเภทอ่ะไหล่",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = async (data: any , id : any) => {
    setName(data.name);
    editMuntation.mutate(id);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data, TypePart._id);
            onClose();
            form.reset();
         
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
