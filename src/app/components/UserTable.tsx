import React, { use, useEffect } from "react";
import { useState } from "react";
import { User } from "../type";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/app/firebase/firebase"
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import cx from "clsx";
import classes from "./TableScrollArea.module.css";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";

const UserTable = () => {
  const [users, setUsers] = useState([] as any[] | undefined);

  useEffect(() => {
    setUsers([
      {
        id: 1,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 2,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 3,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 4,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 5,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 6,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 7,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 8,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 9,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 10,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 11,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 12,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 13,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 14,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 15,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 16,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 17,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 18,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 19,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 20,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 21,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 22,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 23,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 24,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 25,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 26,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 27,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 28,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 29,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 30,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 31,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 32,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 33,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
      {
        id: 34,
        email: "Jane Doe",
        password: "password",
        role: "User",
      },
      {
        id: 35,
        email: "John Smith",
        password: "password",
        role: "User",
      },
      {
        id: 36,
        email: "Jane Smith",
        password: "password",
        role: "User",
      },
      {
        id: 37,
        email: "John Doe",
        password: "password",
        role: "Admin",
      },
    ]);
  }, []);

  // useEffect(() => {
  //   try {
  //     const collectionRef = collection(db, "user");
  //     const q = query(collectionRef);
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       setUsers(
  //         querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  //       );
  //     });
  //     return unsubscribe;
  //   } catch (error : any) {
  //     console.error("Error getting documents: ", error);
  //   }
  // }, []);

  const rows = users?.map((user: User) => (
    <Table.Tr key={user.id}>
      <Table.Td ta="center">{user.email}</Table.Td>
      <Table.Td ta="center">{user.password}</Table.Td>
      <Table.Td ta="center">{user.role}</Table.Td>
  
      <Table.Td ta="center">
        <Tooltip label="แก้ไข">
          <ActionIcon variant="filled" color="yellow.8">
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        &nbsp;&nbsp;
        <Tooltip label="ลบ">
          <ActionIcon variant="filled" color="red.8">
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  const [scrolled, setScrolled] = useState(false);
  

  return (
    <Stack
      align="stretch"
      justify="center"
      gap="md"
    >
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconUserFilled size={20} />
          <Text size="xl" fw={700}>
            รายชื่อผู้ใช้งาน
          </Text>
        </Group>
        <Tooltip label="เพิ่มผู้ใช้งาน">
          <Button variant="filled" color="lime.8" radius="md">
            เพิ่มผู้ใช้งาน
          </Button>
        </Tooltip>
      </Group>

      <Card shadow="xs" padding="md" radius="md" withBorder>
        <ScrollArea
           style={{ height: "calc(100vh - 170px)" }}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table highlightOnHover striped>
            <Table.Thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <Table.Tr>
                <Table.Th ta="center">ชื่อผู้ใช้</Table.Th>
                <Table.Th ta="center">รหัสผ่าน</Table.Th>
                <Table.Th ta="center">บทบาท</Table.Th>
                <Table.Th ta="center"> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
};

export default UserTable;
