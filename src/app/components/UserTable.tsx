import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Menu,
  Paper,
  rem,
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
  IconRefresh,
  IconPassword,
  IconDotsVertical,
} from "@tabler/icons-react";
import { User } from "../type";
import { useDisclosure } from "@mantine/hooks";

import AddUserModal from "@components/UserModal/AddUserModal";
import EditUserModal from "@components/UserModal/EditUserModal";
import NewPassModal from "@components/UserModal/NewPasswordModal";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";

const UserTable = (props: any) => {
  let mobile = props.matches;
  const [users, setUsers] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState({} as User);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [Passopened, { open: openPass, close: closePass }] =
    useDisclosure(false);

  const [editNameEmail, setEditNameEmail] = useState(
    [] as string[] | undefined
  );
  const nameEmail = users?.map((user: User) => user.email) as string[];

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as User[];
      setUsers(data);
    } catch (error: any) {
      showNotification({
        title: "เรียกข้อมูลผู้ใช้งานไม่สำเร็จ",
        message: error.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchUser();
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
    setEditNameEmail(nameEmail.filter((name) => name !== user.email));
    openEdit();
  }

  function OpenPass(user: User) {
    setEditUser(user);
    openPass();
  }

  const rows = filteredUsers?.map((user: User) => (
    <Table.Tr key={user._id}>
      <Table.Td ta="center">{user.email}</Table.Td>
      <Table.Td ta="center">
        {new Date(user.createdAt).toLocaleString()}
      </Table.Td>
      <Table.Td ta="center">{user.role}</Table.Td>
      <Table.Td ta="center">
        <Group gap={"xs"}>
          <Tooltip label="เปลี่ยนรหัสผ่าน">
            <ActionIcon
              variant="filled"
              color="blue.8"
              onClick={() => OpenPass(user)}
            >
              <IconPassword />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(user)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() => openDeleteModal(user._id, user.email)}
              disabled={user.role === "admin"}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  async function removeUser(UserId: any, Username: any) {
    try {
      await fetch(`/api/users/${UserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      showNotification({
        title: "ลบบัญชีผู้ใช้งานสำเร็จ",
        message: "ลบบัญชีผู้ใช้ " + UserId + " แล้ว",
        color: "green",
      });
      fetchUser();
    } catch (error: any) {
      showNotification({
        title: "ลบบัญชีผู้ใช้งานไม่สำเร็จ",
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
        removeUser(UserId, Username);
        onclose;
      },
    });
  };

  const mobileRows = filteredUsers?.map((user: User) => (
    <Card withBorder padding="xs" key={user._id}>
      <Grid justify="center" align="center" gutter="4" columns={4}>
      <Grid justify="center" align="center" gutter="4" columns={4}>
        <Grid.Col span={4}>
          <Group justify="space-between">
            <Text fw={700} size="md">
              {user.email}
            </Text>

            <Menu shadow="md" position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon variant="subtle" color="blue" size="sm">
                  <IconDotsVertical stroke={3} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconEdit style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="yellow.9"
                  onClick={() => OpenEdit(user)}
                >
                  แก้ไข
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="red.9"
                  onClick={() =>
                    openDeleteModal(user._id, user.email)
                  }
                  disabled={user.role === "admin"}
                >
                  ลบ
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconPassword 
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                  color="blue.9"
                  onClick={() => OpenPass(user)}
                >
                  เปลี่ยนรหัสผ่าน
                </Menu.Item>
            
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text size="sm">
            <b>เวลาที่สร้าง : </b>
            {new Date(user.createdAt).toLocaleString()}
          </Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text size="sm">
            <b>บทบาท : </b>
            {user.role}
          </Text>
        </Grid.Col>
        
      </Grid>
      </Grid>
    </Card>
  ));

  return (
    <Stack align="stretch" justify="center" gap="md">
      {mobile ? (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconUserFilled size={20} />
              <Text size="xl" fw={700}>
                รายชื่อผู้ใช้งาน
              </Text>
            </Group>
            <Group gap={5}>
              <Tooltip label="รีเฟรชข้อมูล">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={fetchUser}
                  size="lg"
                >
                  <IconRefresh />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="เพิ่มผู้ใช้งาน">
                <Button
                  variant="filled"
                  color="green"
                  radius="md"
                  onClick={openAdd}
                >
                  เพิ่มผู้ใช้งาน
                </Button>
              </Tooltip>
            </Group>
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

            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
          </Group>

          <Paper shadow="sm" radius="md" p={"sm"} withBorder>
            <Table
              highlightOnHover
              stickyHeader
              striped
              stickyHeaderOffset={55}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th ta="center">ชื่อผู้ใช้</Table.Th>
                  <Table.Th ta="center">เวลาที่สร้าง</Table.Th>
                  <Table.Th ta="center">บทบาท</Table.Th>
                  <Table.Th ta="center"> </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Paper>
        </>
      ) : (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconUserFilled size={20} />
              <Text size="lg" fw={700}>
                รายชื่อผู้ใช้งาน
              </Text>
            </Group>
            <Group gap={5}>
              <Tooltip label="รีเฟรชข้อมูล">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={fetchUser}
                  size="1.855rem"
                >
                  <IconRefresh size={"1.3rem"} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="เพิ่มผู้ใช้งาน">
                <Button
                  variant="filled"
                  color="green"
                  radius="md"
                  size="xs"
                  onClick={openAdd}
                >
                  เพิ่มผู้ใช้งาน
                </Button>
              </Tooltip>
            </Group>
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
          </Group>
          <Stack gap={"xs"}> {mobileRows}</Stack>
        </>
      )}
      <AddUserModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มผู้ใช้งาน </Text>}
        Nameusers={nameEmail}
        fetchUser={fetchUser}
      />

      <EditUserModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> แก้ไขผู้ใช้งาน </Text>}
        users={editUser}
        Nameusers={editNameEmail}
        fetchUser={fetchUser}
      />

      <NewPassModal
        opened={Passopened}
        onClose={closePass}
        title={<Text fw={900}> สร้างรหัสผ่านสำหรับ {editUser.email} </Text>}
        users={editUser}
      />
    </Stack>
  );
};

export default UserTable;
