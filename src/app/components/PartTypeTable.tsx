import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Modal,
  NumberFormatter,
  Paper,
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
  IconPlus,
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

import AddTypePartModal from "@components/TypePartModal/Addtype";
import EditTypePartModal from "@components/TypePartModal/EditType";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { PartType } from "../type";

const PartTypeTable = () => {
  const [PartType, setPartType] = useState([] as any[] | undefined);
  const [TypeName, setTypeName] = useState([] as any[] | undefined);

  const [search, setSearch] = useState("");
  const [editPartType, setEditPartType] = useState({} as PartType);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  useEffect(() => {
    const unsubscribePartsType = queryCollection("typeofparts", setPartType);
    return () => {
      unsubscribePartsType();
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

  function OpenEdit(PartTypeIN : PartType) {
    setEditPartType(PartTypeIN);
    setTypeName(PartType?.map((Part: Part) => Part.name) || []);
    openEdit();
  }

  function OpenAdd() {
    setTypeName(PartType?.map((Part: Part) => Part.name) || []);
    openAdd();
  }

  const openDeleteModal = (PartId: any, Partname: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}> ลบประเภทอ่ะไหล่ </Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบประเภท <strong> {Partname}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removePart(PartId, Partname);
        onclose;
      },
    });
  };
  async function removePart(PartId: any, Partname: any) {
    try {
      const docRef = doc(db, "typeofparts", PartId);
      await deleteDoc(docRef);
      showNotification({
        title: "ลบประเภทอ่ะไหล่สำเร็จ",
        message: "ลบประเภท " + Partname + " สำเร็จ",
        color: "blue",
      });
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการลบประเภทอ่ะไหล่รถยนต์",
        message: error.message,
        color: "red",
      });
    }
  }

  const rows = filteredParts?.map((Part: Part, index: number) => (
    <Table.Tr key={Part._id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
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
              onClick={() => openDeleteModal(Part._id, Part.name)}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconArticleFilled size={30} />
          <Text size="xl" fw={700}>
            ประเภทอ่ะไหล่
          </Text>
        </Group>
        <Tooltip label="เพิ่มรายการอะไหล่">
          <Button
            variant="filled"
            color="green"
            radius="md"
            leftSection={<IconPlus size={20} stroke={2.5} />}
            onClick={() => OpenAdd()}
          >
            เพิ่มประเภทอ่ะไหล่
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
        <Text>
        &nbsp;
        </Text>
        <Text>
        &nbsp;
        </Text>
        <Text>
        &nbsp;
        </Text>
      </Group>
      <Paper shadow="sm" radius="md" p={"sm"} withBorder>
        <Table highlightOnHover stickyHeader striped stickyHeaderOffset={55}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta="center">ลำดับ</Table.Th>
              <Table.Th ta="center">ชื่อประเภท</Table.Th>

              <Table.Th ta="center"> </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      <AddTypePartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        typeName={TypeName}
      />
      
      <EditTypePartModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        typeName={TypeName}
        TypePart={editPartType}
      />
    </Stack>
  );
};

export default PartTypeTable;
