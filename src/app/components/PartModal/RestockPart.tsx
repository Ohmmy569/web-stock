"use client";
import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  NumberInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Part } from "@/app/type";
import { AddRehistory } from "@/app/calcu/addRehistory";

interface ModalProps {
  Part : Part;
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  username : string;
  fetchPart : () => void;
}

const RestockPartModal: React.FC<ModalProps> = ({
  Part,
  opened,
  onClose,
  title,
  username,
  fetchPart
}) => {
  const schema = z.object({
    amount: z.number().min(0, { message: "กรุณากรอกจำนวน" }),
  });

  const form = useForm({
    initialValues: {
      amount: 0,
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (data: any , current : number , name : string , PartId : any) => {
    try{
 
      const resRe = await fetch(`/api/instock/${PartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount + current,
        }),
      });

      if(resRe.ok){
        await AddRehistory(
          username,
          Part.code,
          Part.type,
          Part.name,
          data.amount,
          Part.brand,
          Part.costPrice,
          Part.sellPrice,
          "เติมสินค้า"
        );
        showNotification({
          title: "เติมสินค้าสำเร็จ",
          message: "เติมสินค้า " + name + " " + data.amount + " ชิ้น",
          color: "blue",
          icon: null,
        });
        form.reset();
      }
      else{
        showNotification({
          title: "เติมสินค้าไม่สำเร็จ",
          message: "เกิดข้อผิดพลาดระหว่างเติมสินค้า",
          color: "red",
          icon: null,
        });
      }
      fetchPart();
      form.reset();
    } catch (error) {
  
      form.reset();
      showNotification({
        title: "เติมอ่ะไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเติมอ่ะไหล่" + error,
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

export default RestockPartModal;
