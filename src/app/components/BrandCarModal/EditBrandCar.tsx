"use client";

import { Box, Button, Center, Group, Modal, TextInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { CarBrand } from "@/app/type";
import { useEffect } from "react";
interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  BrandCarName: string[] | undefined;
  fetchCarBrand: () => void;
  BrandCar: CarBrand;
}

const EditBrandCarModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  BrandCarName,
  fetchCarBrand,
  BrandCar
}) => {
  const TypeName = BrandCarName || [];

  const schema = z.object({
    name: z
      .string()
      .nonempty({ message: "กรุณากรอกยี่ห้อรถยนต์" })
      .refine(
        (value) => {
          if (TypeName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "ยี่ห้อรถยนต์ซ้ำ" }
      ),
  });

  const form = useForm({
    initialValues: {
      name: BrandCar?.brand || ""
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setFieldValue("name", BrandCar?.brand || "");
  }, [BrandCar]);

  const handlesubmit = async (data: any , brandID : any) => {
    try {
      if (TypeName.includes(data.name)) {
        showNotification({
          title: "ยี่ห้อรถยนต์ซ้ำ",
          message: "กรุณากรอกยี่ห้อรถยนต์ใหม่",
          color: "red",
          icon: null,
        });
        return;
      }

      
      const resType = await fetch(`/api/brandcar/${brandID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: data.name,
        }),
      });
      if (resType.ok) {
        showNotification({
            title: "เพิ่มยี่ห้อรถยนต์สำเร็จ",
            message: "เพิ่มยี่ห้อรถยนต์สำเร็จ",
            color: "green",
            icon: null,
        });
        form.reset();
        fetchCarBrand();
      } else {
        showNotification({
            title: "เพิ่มยี่ห้อรถยนต์ไม่สำเร็จ",
            message: "เกิดข้อผิดพลาดระหว่างเพิ่มยี่ห้อรถยนต์",
            color: "red",
            icon: null,
        });
      }
    } catch (error) {
      showNotification({
        title: "เพิ่มยี่ห้อรถยนต์ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มยี่ห้อรถยนต์",
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
            handlesubmit(data , BrandCar._id);
            form.reset();
            onClose();
          })();
        }}
      >
        <Box>
          <TextInput
            label="ยี่ห้อรถยนต์"
            placeholder="กรอกยี่ห้อรถยนต์"
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

export default EditBrandCarModal;
