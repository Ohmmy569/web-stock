import React, { use, useEffect } from "react";
import { useState } from "react";
import { User } from "../type";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/../firebase";
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

  // useEffect(() => {
  //   setUsers([
  //     {
  //       id: 1,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 2,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 3,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 4,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 5,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 6,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 7,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 8,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 9,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 10,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 11,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 12,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 13,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 14,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 15,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 16,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 17,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 18,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 19,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 20,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 21,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 22,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 23,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 24,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 25,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 26,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 27,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 28,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 29,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 30,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 31,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 32,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 33,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //     {
  //       id: 34,
  //       username: "Jane Doe",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 35,
  //       username: "John Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 36,
  //       username: "Jane Smith",
  //       password: "password",
  //       role: "User",
  //     },
  //     {
  //       id: 37,
  //       username: "John Doe",
  //       password: "password",
  //       role: "Admin",
  //     },
  //   ]);
  // }, []);

  useEffect(() => {
    try {
      const collectionRef = collection(db, "user");
      const q = query(collectionRef);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setUsers(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
      return unsubscribe;
    } catch (error : any) {
      console.error("Error getting documents: ", error);
    }
  }, []);

  const rows = users?.map((user: User) => (
    <Table.Tr key={user.id}>
      <Table.Td ta="center">{user.username}</Table.Td>
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
      bg="var(--mantine-color-body)"
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
          h={500}
          onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        >
          <Table miw={700} highlightOnHover>
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
