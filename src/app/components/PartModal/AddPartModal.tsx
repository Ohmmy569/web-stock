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
  addDoc,
  serverTimestamp,
  updateDoc,
  collection,
  doc,
  query,
} from "firebase/firestore";
import { Car, partCode } from "@/app/type";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  partName: string[];
  typeofPart: string[];
  carBrand: string[];
  Cars: Car[] | undefined;
  Code: partCode[] | undefined;
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
}) => {
  const [CarModel, setCarModel] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const PartName = partName || [];
  const CarBrand = carBrand || [];
  const TypeofPart = typeofPart || [];

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
    amount: z.number().min(0, { message: "กรุณากรอกจำนวน" }),
  });

  const form = useForm({
    initialValues: {
      name: "",
      typeofPart: "",
      brand: "",
      model: [],
      costPrice: "",
      salePrice: "",
      amount: "",
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
    }
  }, [selectedBrand, Cars]);

  const handlesubmit = async (data: any, code: partCode[]) => {
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

      const thisSubBrand = data.brand.toUpperCase().substring(0, 3);
      const thisNumber = code.find((part) =>
        part.code.includes(thisSubBrand)
      )?.amount;
      const ThisNumber = thisNumber ? thisNumber + 1 : 1;

      const thisCode = thisSubBrand + ThisNumber.toString().padStart(3, "0");
      const thisID = code.find((part) => part.code.includes(thisSubBrand))?.id;

      const collectionCode = collection(db, "partCode");
      //update collection partCode
      //if the code already exists, update the amount
      if(thisID === undefined){
        const collectionRef = collection(db, "partCode");
        await addDoc(collectionRef, {
          code: thisCode,
          amount: ThisNumber,
      
        });
      }
      else{
        const docRef = doc(collectionCode, thisID);
        updateDoc(docRef, {
          amount: ThisNumber,
        });
      }

      const collectionRef = collection(db, "parts");
      await addDoc(collectionRef, {
        code: thisCode,
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
        title: "เพิ่มอ่ะไหล่สำเร็จ",
        message: "เพิ่มอ่ะไหล่ " + data.name + " สำเร็จ",
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
            handlesubmit(data, Code || []);
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
          <NumberInput
            label="จำนวน"
            placeholder="กรอกจำนวน"
            mb={"xs"}
            {...form.getInputProps("amount")}
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
