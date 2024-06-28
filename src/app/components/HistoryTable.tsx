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
  IconArticleFilled,
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

import AddPartModal from "@components/PartModal/AddPartModal";
// import EditPartModal from "./PartModal/EditPartModal";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { PartType } from "../type";

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const PartHistoryTable = () => {
  const [PartType, setPartType] = useState([] as any[] | undefined);

  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [editPart, setEditPart] = useState({} as Part);
  const [brand, setBrand] = useState("all");
  const [typeofparts, setTypeofparts] = useState("all");

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  useEffect(() => {
    // const unsubscribePartsType = queryCollection("typeofparts", setPartType);
    return () => {
    //   unsubscribePartsType();
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //remove space
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = PartType?.filter((Part: Part) => {
    const searchFields = Object.values(Part).join("").toLowerCase();

    return searchFields.includes(search.toLowerCase());
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
      <Table.Td ta="center">{Part.name}</Table.Td>
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
          <IconArticleFilled size={25} />
          <Text size="xl" fw={700}>
            ประเภทอ่ะไหล่รถยนต์
          </Text>
        </Group>
        <Tooltip label="เพิ่มรายการอะไหล่">
          <Button
            variant="filled"
            color="lime.8"
            radius="md"
            onClick={() => openAdd()}
          >
            เพิ่มรายการประเภทอะไหล่
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
        
                <Table.Th ta="center">ชื่อประเภท</Table.Th>
               
                <Table.Th ta="center"> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* <AddPartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มรายการอะไหล่ </Text>}
        partName={modalPartName}
        typeofPart={ModalTypeofParts}
        carBrand={ModalcarBrand}
        Cars={ModalCars}
        Code={modalCode}
      /> */}
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

export default PartHistoryTable;
