import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberFormatter,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Switch,
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
  IconPlus,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./TableScrollArea.module.css";
import { Part, Car } from "../type";
import { useSession, signOut } from "next-auth/react";
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
import EditPartModal from "@components/PartModal/EditPartModal";
import RestockPartModal from "@components/PartModal/RestockPart";
import OutStockPartModal from "./PartModal/OutStockPart";
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

  const [editPart, setEditPart] = useState<Part>({} as Part);
  const [brand, setBrand] = useState("all");
  const [typeofparts, setTypeofparts] = useState("all");
  const [EditPartName, setEditPartName] = useState([] as any[] | undefined);
  const [EditPartCode, setEditPartCode] = useState([] as any[] | undefined);
  const [EditCode, setEditCode] = useState("");
  const [PickBrand, setPickBrand] = useState("");

  const [RestockPart, setRestockPart] = useState<Part>({} as Part);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const [Restockopened, { open: openRestock, close: closeRestock }] =
    useDisclosure(false);
  const [OutStockopened, { open: openOutStock, close: closeOutStock }] =
    useDisclosure(false);

  const { data: session, status } = useSession();
  const UserEmail = session?.user?.email;
  const name = UserEmail?.split("@")[0];

  const [checked, setChecked] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

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

  const ModalCars = Cars;
  const ModalcarBrand = removeDuplicates(
    Cars?.map((Car: Car) => Car.brand) as string[]
  );
  const modalPartName = Parts?.map((Part: Part) => Part.name) as string[];
  const ModalTypeofParts = TypeofParts?.map(
    (TypeofPart: any) => TypeofPart.name
  ) as string[];
  const modalCode = PartCode;
  let modalEditPartName = Parts?.map((Part: Part) => Part.name) as string[];
  let modalEditPartCode = Parts?.map((Part: Part) => Part.code) as string[];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = Parts?.filter((Part: Part) => {
    const searchFields = Object.values(Part).join("").toLowerCase();

    return (
      searchFields.includes(search.toLowerCase()) &&
      (brand === "all" || Part.brand === brand) &&
      (typeofparts === "all" || Part.type === typeofparts) &&
      (checked ? Part.amount === 0 : true) &&
      (checkedIn ? Part.amount > 0 : true)
    );
  });

  function OpenEdit(Part: Part) {
    setEditPart(Part);
    setEditCode(Part.code);
    setEditPartName(modalEditPartName.filter((name) => name !== Part.name));
    setEditPartCode(modalEditPartCode.filter((code) => code !== Part.code));
    setPickBrand(Part.brand);
    openEdit();
  }

  function OpenRestock(Part: Part) {
    setRestockPart(Part);
    openRestock();
  }

  function OpenOutStock(Part: Part) {
    setRestockPart(Part);
    openOutStock();
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
      <Table.Td ta="center" align="center">
        {Part.code}
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.name}
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.type}
      </Table.Td>

      <Table.Td ta="center" align="center">
        {Part.brand}
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.model}
      </Table.Td>
      <Table.Td ta="center" align="center">
        <NumberFormatter thousandSeparator suffix=" ฿" value={Part.costPrice} />
      </Table.Td>
      <Table.Td ta="center" align="center">
        <NumberFormatter thousandSeparator suffix=" ฿" value={Part.salePrice} />
      </Table.Td>
      <Table.Td ta="center" align="center">
        {Part.amount}
      </Table.Td>
      <Table.Td ta="center" align="center">
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
          <Tooltip label="เติมสินค้า">
            <ActionIcon
              variant="filled"
              color="teal"
              onClick={() => OpenRestock(Part)}
            >
              <IconPackageImport />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="เบิกสินค้า">
            <ActionIcon
              variant="filled"
              color="blue.8"
              onClick={() => OpenOutStock(Part)}
              disabled={Part.amount === 0}
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
          <IconEngine size={30} />
          <Text size="xl" fw={700}>
            อ่ะไหล่รถยนต์
          </Text>
        </Group>
        <Tooltip label="เพิ่มอะไหล่ใหม่">
          <Button
            variant="filled"
            color="green"
            radius="md"
            leftSection={<IconPlus size={20} stroke={2.5} />}
            onClick={() => openAdd()}
          >
            เพิ่มอะไหล่ใหม่
          </Button>
        </Tooltip>
      </Group>

      <Group mt={-10} grow>
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
          data={[
            { label: "ทั้งหมด", value: "all" },
            ...ModalTypeofParts.map((type) => ({ label: type, value: type })),
          ]}
          defaultValue={"all"}
          onChange={(value) => setTypeofparts(value as string)}
          searchable
        />
        <Select
          placeholder="เลือกยี่ห้อรถยนต์"
          data={[
            { label: "ทั้งหมด", value: "all" },
            ...ModalcarBrand.map((brand) => ({ label: brand, value: brand })),
          ]}
          label="เลือกยี่ห้อรถยนต์"
          defaultValue={"all"}
          onChange={(value) => setBrand(value as string)}
          searchable
        />
        <Select
          placeholder="เลือกสถานะ"
          data={[
            { label: "ทั้งหมด", value: "all" },
            { label: "อ่ะไหล่ที่หมด", value: "0" },
            { label: "อ่ะไหล่ที่คงเหลือ", value: "1" },
          ]}
          label="เลือกสถานะ"
          defaultValue={"all"}
          onChange={(value) => {
            if (value === "0") {
              setChecked(true);
              setCheckedIn(false);
            } else if (value === "1") {
              setChecked(false);
              setCheckedIn(true);
            } else {
              setChecked(false);
              setCheckedIn(false);
            }
          }}
          searchable
        />
      </Group>
     

      <Paper shadow="sm" radius="md" p={"sm"} withBorder>
        <Table highlightOnHover stickyHeader striped stickyHeaderOffset={55}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta="center">รหัสบาร์โค๊ด</Table.Th>
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
      </Paper>

      <AddPartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มรายการอะไหล่ใหม่ </Text>}
        partName={modalPartName}
        typeofPart={ModalTypeofParts}
        carBrand={ModalcarBrand}
        Cars={ModalCars}
        Code={modalCode}
      />

      <EditPartModal
        opened={Editopened}
        onClose={closeEdit}
        title={
          <Text fw={900}>
            {" "}
            แก้ไขอ่ะไหล่ <strong>{EditCode}</strong>{" "}
          </Text>
        }
        EditPart={editPart}
        partName={EditPartName}
        partCode={EditPartCode}
        typeofPart={ModalTypeofParts}
        carBrand={ModalcarBrand}
        Cars={ModalCars}
      />
      <RestockPartModal
        opened={Restockopened}
        onClose={closeRestock}
        title={<Text fw={900}> เติมสินค้า {RestockPart.name} </Text>}
        Part={RestockPart}
        username={name as string}
      />
      <OutStockPartModal
        opened={OutStockopened}
        onClose={closeOutStock}
        title={<Text fw={900}> เบิกสินค้า {RestockPart.name} </Text>}
        Part={RestockPart}
        username={name as string}
      />
    </Stack>
  );
};

export default PartTable;
