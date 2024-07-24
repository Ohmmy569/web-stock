"use client";

import { Box, Button, Center, Group, Modal, NumberInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Part } from "@/app/type";
import { AddOuhistory } from "@/app/calcu/addOuhistory";

interface ModalProps {
  Part: Part;
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  username: string;
  fetchPart: () => void;
  setParts : (value : any[]) => void;
  parts : Part[];
}

const OutStockPartModal: React.FC<ModalProps> = ({
  Part,
  opened,
  onClose,
  title,
  username,
  fetchPart,
  setParts,
  parts,
}) => {
  const schema = z.object({
    amount: z
      .number()
      .min(0, { message: "กรุณากรอกจำนวน" })
      .max(Part.amount, { message: "จำนวนที่เบิกมากกว่าจำนวนที่มีในคลัง" }),
  });

  const form = useForm({
    initialValues: {
      amount: 0,
    },
    validate: zodResolver(schema),
  });

  const handlesubmit = async (
    data: any,
    current: number,
    name: string,
    PartId: any
  ) => {
    try {
      const resRe = await fetch(
        `/api/outstock/${PartId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: current - data.amount,
          }),
        }
      );

      if (resRe.ok) {
        await AddOuhistory(
          username,
          Part.code,
          Part.type,
          Part.name,
          data.amount,
          Part.brand,
          Part.costPrice,
          Part.sellPrice,
          "เบิกสินค้า"
        );
        showNotification({
          title: "เบิกสินค้าสำเร็จ",
          message: "เบิกสินค้า " + name + " " + data.amount + " ชิ้น",
          color: "blue",
          icon: null,
        });
        form.reset();
      } else {
        showNotification({
          title: "เบิกสินค้าไม่สำเร็จ",
          message: "เกิดข้อผิดพลาดระหว่างเบิกสินค้า",
          color: "red",
          icon: null,
        });
      }
      fetchPart();
      setParts(
        parts.map((parts) =>
          parts._id === PartId ? { ...parts, amount: current - data.amount } : parts
        )
      )
      form.reset();
    } catch (error) {
      form.reset();
      showNotification({
        title: "เบิกสินค้าไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเบิกอ่ะไหล่" + error,
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
            handlesubmit(data, Part.amount, Part.name, Part._id);
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
