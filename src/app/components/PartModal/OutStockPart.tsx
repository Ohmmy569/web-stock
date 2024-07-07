"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/firebase";

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
import {
  serverTimestamp,
  updateDoc,
  collection,
  doc,
  query,
} from "firebase/firestore";
import { Part } from "@/app/type";
import { Addhistory } from "@/app/calcu/addhistory";

interface ModalProps {
  Part : Part;
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  username : string;
  fetchPart : () => void;
}

const OutStockPartModal: React.FC<ModalProps> = ({
  Part,
  opened,
  onClose,
  title,
  username,
  fetchPart
}) => {
  const schema = z.object({
    amount: z.number().min(0, { message: "กรุณากรอกจำนวน" }).max(Part.amount, { message: "จำนวนที่เบิกมากกว่าจำนวนที่มีในคลัง" })
  });

  const form = useForm({
    initialValues: {
      amount: 0,
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (data: any , current : number , name : string , PartId : any ) => {
    try{
      // const collectionRef = collection(db, "parts");
      // const docRef = doc(collectionRef, Part.id);
      // await updateDoc(docRef, {
      //   amount: current - data.amount,
      // });
      // await Addhistory(
      //   username,
      //   Part.code,
      //   Part.type,
      //   Part.name,
      //   data.amount,
      //   Part.brand,
      //   Part.costPrice,
      //   Part.salePrice,
      //   "เบิกสินค้า"
      // );
      const resRe = await fetch(`http://localhost:3000/api/outstock/${PartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: current - data.amount,
        }),
      });

      if(resRe.ok){
        showNotification({
          title: "เบิกสินค้าสำเร็จ",
          message: "เบิกสินค้า " + name + " " + data.amount + " ชิ้น",
          color: "blue",
          icon: null,
        });
        form.reset();
      }
      else{
        showNotification({
          title: "เบิกสินค้าไม่สำเร็จ",
          message: "เกิดข้อผิดพลาดระหว่างเบิกสินค้า",
          color: "red",
          icon: null,
        });
      }
      fetchPart();
      form.reset();

    
    } catch (error) {
  
      form.reset();
      showNotification({
        title: "เบิกสินค้าสำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเบิกอ่ะไหล่",
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
            handlesubmit(data , Part.amount , Part.name , Part._id);
            form.reset();
            onClose();
          })();
        }}
      >
        <Box>
          <NumberInput
          description={"อยู่ในคลัง : " + Part?.amount + " ชิ้น"}
            label="จำนวน"
            placeholder="จำนวน"
            required
            {...form.getInputProps("amount")}
            min={0}
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

export default OutStockPartModal;
