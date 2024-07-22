"use client";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
  MultiSelect,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";

import { Car } from "@/app/type";
import { useRouter } from "next/navigation";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  partName: string[];
  typeofPart: string[];
  carBrand: string[];
  Cars: Car[] | undefined;
  Code: string[] | undefined;
  fetchPart : () => void;
}

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const AddPartModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  partName,
  typeofPart,
  carBrand,
  Cars,
  Code,
  fetchPart
}) => {
  const [CarModel, setCarModel] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const router = useRouter();

  const PartName = partName || [];
  const CodeName = Code || [];
  const CarBrand = carBrand || [];
  const TypeofPart = typeofPart || [];

  const schema = z.object({
    code: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสอ่ะไหล่" })
      .refine(
        (value) => {
          if (CodeName.includes(value)) {
            return false; // Invalid if the code already exists in CodeName
          }
          return true; // Valid if the code doesn't exist in CodeName
        },
        { message: "รหัสอ่ะไหล่ซ้ำ" }
      ),
    name: z
      .string()
      .nonempty({ message: "กรุณากรอกชื่ออ่ะไหล่" })
      .refine(
        (value) => {
          if (PartName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "ชื่ออ่ะไหล่ซ้ำ" }
      ),
    typeofPart: z.string().nonempty({ message: "กรุณาเลือกประเภทอ่ะไหล่" }),
    brand: z.string().nonempty({ message: "กรุณาเลือกยี่ห้อรถยนต์" }),
    model: z.array(z.string()).nonempty({ message: "กรุณาเลือกรุ่นรถยนต์" }),
    costPrice: z.number().min(0, { message: "กรุณากรอกราคาทุน" }),
    salePrice: z.number().min(0, { message: "กรุณากรอกราคาขาย" }),
  });

  const form = useForm({
    initialValues: {
      code: "",
      name: "",
      typeofPart: "",
      brand: "",
      model: [],
      costPrice: "",
      salePrice: "",
     
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (selectedBrand) {
      const filteredModels =
        Cars?.filter((car) => car.brand === selectedBrand).map(
          (car) => car.name
        ) || [];
      //append value "all" to the beginning of the array
      setCarModel(removeDuplicates(["ใช้ได้ทุกรุ่น", ...filteredModels]));
    } else {
      setCarModel([]);
    }
  }, [selectedBrand, Cars]);

  const handlesubmit = async (data: any) => {
    try {
      let model = "";
      if (data.model.length > 1) {
        model = data.model.join(" , ");
      } else {
        model = data.model[0];
      }

      const res = await fetch("/api/parts", {
        method: "POST",
        body: JSON.stringify({
          code: data.code,
          name: data.name,
          type: data.typeofPart,
          brand: data.brand,
          model: model,
          costPrice: data.costPrice,
          sellPrice: data.salePrice,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(res.ok){
      showNotification({
        title: "เพิ่มอ่ะไหล่สำเร็จ",
        message: "เพิ่มอ่ะไหล่ " + data.name + " สำเร็จ",
        color: "green",
        icon: null,
      });
    }
    else {
      showNotification({
        title: "เพิ่มอ่ะไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มอ่ะไหล่",
        color: "red",
        icon: null,
      });
    }
    fetchPart();
      form.reset();
    } catch (error) {
  
      showNotification({
        title: "เพิ่มอ่ะไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มอ่ะไหล่" + error,
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
            label="รหัสอ่ะไหล่"
            placeholder="กรอกรหัสอ่ะไหล่"
            mb={"xs"}
            {...form.getInputProps("code")}
          />
          <TextInput
            label="ชื่ออ่ะไหล่"
            placeholder="กรอกชื่ออ่ะไหล่"
            mb={"xs"}
            {...form.getInputProps("name")}
          />
          <Select
            label="ประเภทอ่ะไหล่"
            placeholder="เลือกประเภทอ่ะไหล่"
            data={[...TypeofPart.map((type) => ({ label: type, value: type }))]}
            {...form.getInputProps("typeofPart")}
            mb={"xs"}
            searchable
          />

          <Select
            placeholder="เลือกยี่ห้อรถยนต์"
            data={[
              ...CarBrand.map((brand) => ({ label: brand, value: brand })),
            ]}
            label="เลือกยี่ห้อรถยนต์"
            {...form.getInputProps("brand")}
            onChange={(value) => {
              form.setFieldValue("model", []);
              setSelectedBrand(value as string);
              form.setFieldValue("brand", value as string);
            }}
            mb={"xs"}
            searchable
          />
          <MultiSelect
            label="รุ่นรถยนต์"
            mb={"xs"}
            placeholder="เลือกรุ่นรถยนต์"
            data={[
              ...CarModel.map((model) => ({ label: model, value: model })),
            ]}
            {...form.getInputProps("model")}
            searchable
          />
          <NumberInput
            label="ราคาทุน"
            placeholder="กรอกราคาทุน"
            mb={"xs"}
            {...form.getInputProps("costPrice")}
          />
          <NumberInput
            label="ราคาขาย"
            placeholder="กรอกราคาขาย"
            mb={"xs"}
            {...form.getInputProps("salePrice")}
          />
          <Center>
            <Group justify="space-between" mt={15}>
              <Button color="green" mt="md" type="submit">
                เพิ่มอ่ะไหล่
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

export default AddPartModal;
