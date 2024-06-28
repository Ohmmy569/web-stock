import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  NumberFormatter,
  ScrollArea,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconSearch,
  IconEngine,
  IconPackageExport,
  IconPackageImport,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./TableScrollArea.module.css";
import { Part, Car } from "../type";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useDisclosure } from "@mantine/hooks";
import { car } from "../type";

import AddPartModal from "@components/PartModal/AddPartModal";
// import EditPartModal from "./PartModal/EditPartModal";
import { modals } from "@mantine/modals";
import { set } from "zod";
import { showNotification } from "@mantine/notifications";

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const PartTable = () => {
  const [Parts, setParts] = useState([] as any[] | undefined);
  const [Cars, setCars] = useState(car as Car[] | undefined);
  const [PartCode, setPartCode] = useState([] as any[] | undefined);
  const [TypeofParts, setTypeofParts] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [editPart, setEditPart] = useState({} as Part);
  const [brand, setBrand] = useState("all");
  const [typeofparts, setTypeofparts] = useState("all");

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  useEffect(() => {
    const unsubscribeParts = queryCollection("parts", setParts);
    
    const unsubscribeTypeofParts = queryCollection(
      "typeofparts",
      setTypeofParts
    );
    const unsubscribeCode = queryCollection("partCode", setPartCode); 

    return () => {
      unsubscribeParts();
      
      unsubscribeTypeofParts();
      unsubscribeCode();
    };
  }, []);

  console.log(PartCode);
  

  const queryCollection = <T,>(
    collectionName: string,
    setState: React.Dispatch<React.SetStateAction<T[] | undefined>>
  ) => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setState(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as T[]
        );
      });
      return unsubscribe;
    } catch (error: any) {
      showNotification({
        title: `เกิดข้อผิดพลาดในการดึงข้อมูลจาก ${collectionName}`,
        message: error.message,
        color: "red",
      });
      return () => {};
    }
  };

  const ModalCars = Cars
  const ModalcarBrand = removeDuplicates(
    Cars?.map((Car: Car) => Car.brand) as string[]
  );
  const modalPartName = Parts?.map((Part: Part) => Part.name) as string[];
  const ModalTypeofParts = TypeofParts?.map(
    (TypeofPart: any) => TypeofPart.name
  ) as string[];
  const modalCode = PartCode

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //remove space
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = Parts?.filter((Part: Part) => {
    const searchFields = Object.values(Part).join("").toLowerCase();

    return (
      searchFields.includes(search.toLowerCase()) &&
      (brand === "all" || Part.brand === brand) &&
      (typeofparts === "all" || Part.type === typeofparts)
    );
  });

  

  function OpenEdit(Part: Part) {
    setEditPart(Part);
    openEdit();
  }

  const openDeleteModal = (PartId: any, Partname: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}> ลบรายการอ่ะไหล่ </Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบอ่ะไหล่ <strong> {Partname}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removePart(PartId);
        onclose;
      },
    });
  };

  const rows = filteredParts?.map((Part: Part) => (
    <Table.Tr key={Part.id}>
      <Table.Td ta="center">{Part.code}</Table.Td>
      <Table.Td ta="center">{Part.name}</Table.Td>
      <Table.Td ta="center">{Part.type}</Table.Td>

      <Table.Td ta="center">{Part.brand}</Table.Td>
      <Table.Td ta="center">{Part.model}</Table.Td>
      <Table.Td ta="center">
        <NumberFormatter thousandSeparator suffix=" ฿" value={Part.costPrice} />
      </Table.Td>
      <Table.Td ta="center">
        <NumberFormatter thousandSeparator suffix=" ฿" value={Part.salePrice} />
      </Table.Td>
      <Table.Td ta="center">{Part.amount}</Table.Td>
      <Table.Td ta="center">
        <Group gap={"xs"}>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(Part)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() =>
                openDeleteModal(Part.id, Part.code + " " + Part.name)
              }
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="เติมอ่ะไหล่">
            <ActionIcon
              variant="filled"
              color="green.8"
              // onClick={() => openDeleteModal(Part.id , Part.code + " " + Part.name)}
            >
              <IconPackageImport />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="เบิกอะไหล่">
            <ActionIcon
              variant="filled"
              color="blue.8"
              // onClick={() => openDeleteModal(Part.id , Part.code + " " + Part.name)}
            >
              <IconPackageExport />
            </ActionIcon>
          </Tooltip>
      
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  async function removePart(PartId: any) {
    try {
      const docRef = doc(db, "parts", PartId);
      await deleteDoc(docRef);
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการลบอ่ะไหล่รถยนต์",
        message: error.message,
        color: "red",
      });
    }
  }

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconEngine size={25} />
          <Text size="xl" fw={700}>
            อ่ะไหล่รถยนต์
          </Text>
        </Group>
        <Tooltip label="เพิ่มรายการอะไหล่">
          <Button
            variant="filled"
            color="lime.8"
            radius="md"
            onClick={() => openAdd()}
          >
            เพิ่มรายการอะไหล่
          </Button>
        </Tooltip>
      </Group>

      <Group mt={-10}>
        <TextInput
          label="ค้นหาทุกข้อมูล"
          placeholder="ค้นหาทุกข้อมูล"
          leftSection={
            <IconSearch
              style={{ width: "1rem", height: "1rem" }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Select
          placeholder="เลือกประเภท"
          label="เลือกประเภท"
          data={[{ label: "ทั้งหมด", value: "all" }
            , ...ModalTypeofParts.map((type) => ({ label: type , value: type }))]
          }
          onChange={(value) => setTypeofparts(value as string)}
        />
        <Select
          placeholder="เลือกยี่ห้อรถยนต์"
          data={[{ label: "ทั้งหมด", value: "all" }
            , ...ModalcarBrand.map((brand) => ({ label: brand, value: brand }))]
          }
          label="เลือกยี่ห้อรถยนต์"
          onChange={(value) => setBrand(value as string)}
        />
      </Group>

      <Card shadow="xs" padding="md" radius="md" withBorder>
        <ScrollArea
          style={{ height: "calc(100vh - 232px)" }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table highlightOnHover striped>
            <Table.Thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <Table.Tr>
                <Table.Th ta="center">รหัส</Table.Th>
                <Table.Th ta="center">ชื่อ</Table.Th>
                <Table.Th ta="center">ประเภท</Table.Th>
                <Table.Th ta="center">ยี่ห้อรถยนต์</Table.Th>
                <Table.Th ta="center">รุ่นรถยนต์</Table.Th>
                <Table.Th ta="center">ราคาทุน</Table.Th>
                <Table.Th ta="center">ราคาขาย</Table.Th>
                <Table.Th ta="center">จำนวณ</Table.Th>
                <Table.Th ta="center"> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      <AddPartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มรายการอะไหล่ </Text>}
        partName={modalPartName}
        typeofPart={ModalTypeofParts}
        carBrand={ModalcarBrand}
        Cars={ModalCars}
        Code={modalCode}
      />
      {/*
      <EditPartModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> แก้ไขผู้ใช้งาน </Text>}
        Parts={editPart }
      /> */}
    </Stack>
  );
};

export default PartTable;
