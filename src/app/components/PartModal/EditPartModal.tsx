"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/firebase";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Checkbox,
  CheckboxGroup,
  MultiSelect,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  
  serverTimestamp,
  updateDoc,
  collection,
  doc,
  query,
} from "firebase/firestore";
import { Car, Part, partCode } from "@/app/type";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  partName: string[] | undefined;
  typeofPart: string[];
  carBrand: string[];
  Cars: Car[] | undefined;
  EditPart: Part;
}

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const EditPartModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  partName,
  typeofPart,
  carBrand,
  Cars,
  EditPart,
}) => {
  const [CarModel, setCarModel] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const PartName = partName || [];
  const CarBrand = carBrand || [];
  const TypeofPart = typeofPart || [];
  const Editmodel: string[] = EditPart?.model?.split(" , ") || [];
  

  const schema = z.object({
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
      name: "",
      typeofPart: "",
      brand: "",
      model: [],
      costPrice: 0,
      salePrice: 0,
   
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (selectedBrand) {
      const filteredModels =
        Cars?.filter((car) => car.brand === selectedBrand).map(
          (car) => car.model
        ) || [];
      //append value "all" to the beginning of the array
      setCarModel(removeDuplicates(["ใช้ได้ทุกรุ่น", ...filteredModels]));
    } else {
      setCarModel([]);

      form.setValues({
        name: EditPart?.name,
        typeofPart: EditPart?.type,
        brand: EditPart?.brand,
        model: Editmodel as any,
        costPrice: EditPart?.costPrice,
        salePrice: EditPart?.salePrice,
      
      });
    }
  }, [selectedBrand, Cars, EditPart]);

  const handlesubmit = async (data: any) => {
    try {
      if (PartName.includes(data.name)) {
        showNotification({
          title: "ชื่ออ่ะไหล่ซ้ำ",
          message: "กรุณากรอกชื่ออ่ะไหล่ใหม่",
          color: "red",
          icon: null,
        });
        return;
      }
      let model = "";
      if (data.model.length > 1) {
        model = data.model.join(" , ");
      } else {
        model = data.model[0];
      }

      const collectionRef = collection(db, "parts");
      const docRef = doc(collectionRef, EditPart.id);
      await updateDoc(docRef, {
        name: data.name,
        type: data.typeofPart,
        brand: data.brand,
        model: model,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        amount: data.amount,
        timestamp: serverTimestamp(),
      });
      showNotification({
        title: "แก้ไขอ่ะไหล่สำเร็จ",
        message: "แก้ไขอ่ะไหล่สำเร็จ " + data.name + " สำเร็จ",
        color: "blue",
        icon: null,
      });
      form.reset();
    } catch (error) {
      console.log(error);
      form.reset();
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
            handlesubmit(data);
            form.reset();
            onClose();
          })();
        }}
      >
        <Box>
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

export default EditPartModal;
