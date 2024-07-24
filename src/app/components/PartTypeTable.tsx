import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Paper,
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
  IconArticleFilled,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";

import { useDisclosure } from "@mantine/hooks";

import AddTypePartModal from "@components/TypePartModal/Addtype";
import EditTypePartModal from "@components/TypePartModal/EditType";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { PartType } from "@/app/type";

const PartTypeTable = (props: any) => {
  let mobile = props.matches;
  const [PartType, setPartType] = useState([] as any[] | undefined);
  const [TypeName, setTypeName] = useState([] as any[] | undefined);

  const [search, setSearch] = useState("");
  const [editPartType, setEditPartType] = useState({} as PartType);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const fetchPartType = async () => {
    const res = await fetch("/api/typeofparts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทอ่ะไหล่",
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทอ่ะไหล่",
        color: "red",
      });
      return;
    }
    const data = await res.json();
    setPartType(data);
  };

  useEffect(() => {
    fetchPartType();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = PartType?.filter((PartType: PartType) => {
    const searchFields = Object.values(PartType).join("").toLowerCase();

    return searchFields.includes(search.toLowerCase());
  });

  function OpenEdit(PartTypeIN: PartType) {
    setEditPartType(PartTypeIN);
    setTypeName(PartType?.map((PartType: PartType) => PartType.name) || []);
    openEdit();
  }

  function OpenAdd() {
    setTypeName(PartType?.map((PartType: PartType) => PartType.name) || []);
    openAdd();
  }

  const openDeleteModal = (PartTypeId: any, Partname: any) => {
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
        removePart(PartTypeId, Partname);
        onclose;
      },
    });
  };
  async function removePart(PartTypeId: any, PartTypename: any) {
    try {
      const res = await fetch(`/api/typeofparts/${PartTypeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.ok) {
        showNotification({
          title: "ลบประเภทอ่ะไหล่สำเร็จ",
          message: "ลบประเภท " + PartTypename + " สำเร็จ",
          color: "blue",
        });
        fetchPartType();
      } else {
        showNotification({
          title: "เกิดข้อผิดพลาดในการลบประเภทอ่ะไหล่รถยนต์",
          message: "เกิดข้อผิดพลาดในการลบประเภทอ่ะไหล่รถยนต์",
          color: "red",
        });
      }
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการลบประเภทอ่ะไหล่รถยนต์",
        message: error.message,
        color: "red",
      });
    }
  }
  console.log("props", props);

  const rows = filteredParts?.map((PartType: PartType, index: number) => (
    <Table.Tr key={PartType._id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td ta="center">{PartType.name}</Table.Td>
      <Table.Td ta="center">
        <Group gap={"xs"}>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(PartType)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() => openDeleteModal(PartType._id, PartType.name)}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const mobileRows = filteredParts?.map((PartType: PartType, index: number) => (
    <Card withBorder padding="xs" key={PartType._id}>
      <Grid justify="center" align="center" gutter="4" columns={4}>
        <Grid.Col span={4}>
          <Group justify="space-between">
            <Text fw={700} size="md">
              {index + 1}.
            </Text>
            <Text fw={700} size="md">
              {PartType.name}
            </Text>
            <Group gap={"xs"}>
              <Tooltip label="แก้ไข">
                <ActionIcon
                  variant="filled"
                  color="yellow.8"
                  onClick={() => OpenEdit(PartType)}
                >
                  <IconEdit />
                </ActionIcon>
              </Tooltip>

              <Tooltip label="ลบ">
                <ActionIcon
                  variant="filled"
                  color="red.8"
                  onClick={() => openDeleteModal(PartType._id, PartType.name)}
                >
                  <IconTrash />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Grid.Col>
      </Grid>
    </Card>
  ));

  return (
    <Stack align="stretch" justify="center" gap="md">
      {mobile ? (
        <>
          <Group justify="space-between">
            <Group align="center" gap={5}>
              <IconArticleFilled size={30} />
              <Text size="xl" fw={700}>
                ประเภทอ่ะไหล่
              </Text>
            </Group>
            <Group gap={"xs"}>
              <Tooltip label="รีเฟรชข้อมูล">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => {
                    fetchPartType();
                  }}
                  size="lg"
                >
                  <IconRefresh />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="เพิ่มประเภทอ่ะไหล่">
                <Button
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={() => OpenAdd()}
                >
                  เพิ่มประเภท
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
                  <Table.Th ta="center">ลำดับ</Table.Th>
                  <Table.Th ta="center">ชื่อประเภท</Table.Th>

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
              <IconArticleFilled size={30} />
              <Text size="lg" fw={700}>
                ประเภทอ่ะไหล่
              </Text>
            </Group>
            <Group gap={"xs"}>
              <Tooltip label="รีเฟรชข้อมูล">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => {
                    fetchPartType();
                  }}
                  size="1.855rem"
                >
                  <IconRefresh size={"1.3rem"} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="เพิ่มรายการอะไหล่">
                <Button
                  size="xs"
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={() => OpenAdd()}
                >
                  เพิ่มประเภท
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

      <AddTypePartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        typeName={TypeName}
        fetchPartType={fetchPartType}
        types={PartType as any}
        setTypes={setPartType}
      />

      <EditTypePartModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        typeName={TypeName}
        TypePart={editPartType}
        fetchPartType={fetchPartType}
        types={PartType as any}
        setTypes={setPartType}
      />
    </Stack>
  );
};

export default PartTypeTable;
