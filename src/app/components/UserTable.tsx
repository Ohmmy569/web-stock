import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconUserFilled,
  IconSearch,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./TableScrollArea.module.css";
import { User } from "../type";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { deleteUser , } from "firebase/auth";
import { db } from "../firebase/firebase";
import { useDisclosure } from "@mantine/hooks";

import AddUserModal from "@components/UserModal/AddUserModal";
import EditUserModal from "./UserModal/EditUserModal";
import { modals } from "@mantine/modals";
import { set } from "zod";
import { showNotification } from "@mantine/notifications";


const UserTable = () => {
  const [users, setUsers] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [editUser , setEditUser] = useState({} as User);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  useEffect(() => {
    try {
      const collectionRef = collection(db, "user");
      const q = query(collectionRef);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setUsers(
          querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().timestamp?.toDate().getTime(),
          }))
        );
      });
      return unsubscribe;
    } catch (error: any) {
      showNotification({
        title: "Failed to fetch users",
        message: error.message,
        color: "red",
      });
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredUsers = users?.filter((user: User) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
    )
  );

  function OpenEdit(user: User) {
    setEditUser(user);
    openEdit();
  }

  const rows = filteredUsers?.map((user: User) => (
    <Table.Tr key={user.id}>
      <Table.Td ta="center">{user.email}</Table.Td>
      <Table.Td ta="center">***********</Table.Td>
      <Table.Td ta="center">
        {new Date(user.timestamp).toLocaleString()}
      </Table.Td>
      <Table.Td ta="center">{user.role}</Table.Td>
      <Table.Td ta="center">
        <Tooltip label="แก้ไข">
          <ActionIcon variant="filled" color="yellow.8"  onClick={() => OpenEdit(user)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        &nbsp;&nbsp;
        <Tooltip label="ลบ">
          <ActionIcon
            variant="filled"
            color="red.8"
            onClick={() => openDeleteModal(user.id, user.email)}
            disabled={user.role === "admin"}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  async function  removeUser(UserId: any) {
    try {
      const docRef = doc(db, "user", UserId);
      await deleteDoc(docRef);

      
    }
    catch (error: any) {
      showNotification({
        title: "Failed to delete user",
        message: error.message,
        color: "red",
      });
    }
  }

  const openDeleteModal = (UserId: any, Username: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}> ลบบัญชีผู้ใช้งาน </Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบบัญชี <strong> {Username}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removeUser(UserId);
        onclose;
      },
    });
  };

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconUserFilled size={20} />
          <Text size="xl" fw={700}>
            รายชื่อผู้ใช้งาน
          </Text>
        </Group>
        <Tooltip label="เพิ่มผู้ใช้งาน">
          <Button variant="filled" color="lime.8" radius="md" onClick={openAdd}>
            เพิ่มผู้ใช้งาน
          </Button>
        </Tooltip>
      </Group>

      <TextInput
        placeholder="Search by any field"
        leftSection={
          <IconSearch style={{ width: "1rem", height: "1rem" }} stroke={1.5} />
        }
        value={search}
        onChange={handleSearchChange}
      />

      <Card shadow="xs" padding="md" radius="md" withBorder>
        <ScrollArea
          style={{ height: "calc(100vh - 217px)" }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table highlightOnHover striped>
            <Table.Thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <Table.Tr>
                <Table.Th ta="center">ชื่อผู้ใช้</Table.Th>
                <Table.Th ta="center">รหัสผ่าน</Table.Th>
                <Table.Th ta="center">เวลาที่สร้าง</Table.Th>
                <Table.Th ta="center">บทบาท</Table.Th>
                <Table.Th ta="center"> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      <AddUserModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มผู้ใช้งาน </Text>}
        users={users || []}
      />

      <EditUserModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> แก้ไขผู้ใช้งาน </Text>}
        users={editUser }
      />
    </Stack>
  );
};

export default UserTable;
