"use client";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  brandCarName: string[] | undefined;
  modelCarName: string[] | undefined;
  fetchCar: () => void;
}

const AddCarModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  modelCarName,
  brandCarName,
  fetchCar,
}) => {
  const BrandCarName = brandCarName || [];
  const ModelCarName = modelCarName || [];

  const schema = z.object({
    model: z
      .string()
      .nonempty({ message: "กรุณากรอกรุ่นรถยนต์" })
      .refine(
        (value) => {
          if (ModelCarName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "รุ่นรถยนต์ซ้ำ" }
      ),
    brand: z.string().nonempty({ message: "กรุณาเลือกยี่ห้อรถยนต์" }),
  });

  const form = useForm({
    initialValues: {
      brand: "",
      model: "",
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (data: any) => {
    try {
      if (ModelCarName.includes(data.model)) {
        showNotification({
          title: "ยี่ห้อรถยนต์ซ้ำ",
          message: "กรุณากรอกยี่ห้อรถยนต์ใหม่",
          color: "red",
          icon: null,
        });
        return;
      }

      const resType = await fetch("/api/modelcar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: data.brand,
          model: data.model,
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
        fetchCar();
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
          <Select
            data={[
              ...BrandCarName.map((brand) => ({ label: brand, value: brand })),
            ]}
            placeholder="เลือกยี่ห้อรถยนต์"
            mb={"xs"}
            {...form.getInputProps("brand")}
          />
          <TextInput
            label="ยี่ห้อรถยนต์"
            placeholder="กรอกยี่ห้อรถยนต์"
            mb={"xs"}
            {...form.getInputProps("model")}
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

export default AddCarModal;
