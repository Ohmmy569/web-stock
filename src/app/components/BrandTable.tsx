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
  IconRefresh,
  IconBrandToyota,
} from "@tabler/icons-react";

import { useDisclosure } from "@mantine/hooks";

import AddTypePartModal from "@components/TypePartModal/Addtype";
import EditTypePartModal from "@components/TypePartModal/EditType";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { CarBrand } from "@/app/type";

const BrandTable = () => {
  const [CarBrand, setCarBrand] = useState([] as any[] | undefined);
  const [TypeName, setTypeName] = useState([] as any[] | undefined);

  const [search, setSearch] = useState("");
  const [editCarBrand, setEditCarBrand] = useState({} as CarBrand);

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const fetchCarBrand = async () => {
    const res = await fetch("http://localhost:3000/api/typeofparts", {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
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
    setCarBrand(data);
  };

  useEffect(() => {
    fetchCarBrand();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredParts = CarBrand?.filter((CarBrand: CarBrand) => {
    const searchFields = Object.values(CarBrand).join("").toLowerCase();

    return searchFields.includes(search.toLowerCase());
  });

  function OpenEdit(CarBrandIN: CarBrand) {
    setEditCarBrand(CarBrandIN);
    setTypeName(CarBrand?.map((CarBrand: CarBrand) => CarBrand.name) || []);
    openEdit();
  }

  function OpenAdd() {
    setTypeName(CarBrand?.map((CarBrand: CarBrand) => CarBrand.name) || []);
    openAdd();
  }

  const openDeleteModal = (CarBrandId: any, Partname: any) => {
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
        removePart(CarBrandId, Partname);
        onclose;
      },
    });
  };
  async function removePart(CarBrandId: any, CarBrandname: any) {
    try {
      const res = await fetch(`/api/typeofparts/${CarBrandId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.ok) {
        showNotification({
          title: "ลบประเภทอ่ะไหล่สำเร็จ",
          message: "ลบประเภท " + CarBrandname + " สำเร็จ",
          color: "blue",
        });
        fetchCarBrand();
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

  const rows = filteredParts?.map((CarBrand: CarBrand, index: number) => (
    <Table.Tr key={CarBrand._id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td ta="center">{CarBrand.name}</Table.Td>
      <Table.Td ta="center">
        <Group gap={"xs"}>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(CarBrand)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() => openDeleteModal(CarBrand._id, CarBrand.name)}
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
          <IconBrandToyota size={30} />
          <Text size="xl" fw={700}>
            ยี่ห้อรถยนต์
          </Text>
        </Group>
        <Group gap={"xs"}>
          <Tooltip label="รีเฟรชข้อมูล">
            <ActionIcon
              variant="filled"
              color="blue"
              onClick={() => {
                fetchCarBrand();
              }}
              size="lg"
            >
              <IconRefresh />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="เพิ่มยี่ห้อรถยนต์">
            <Button
              variant="filled"
              color="green"
              radius="md"
              leftSection={<IconPlus size={20} stroke={2.5} />}
              onClick={() => OpenAdd()}
            >
              เพิ่มยี่ห้อรถยนต์
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
        <Table highlightOnHover stickyHeader striped stickyHeaderOffset={55}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta="center">ลำดับ</Table.Th>
              <Table.Th ta="center">ชื่อยี่ห้อรถยนต์</Table.Th>

              <Table.Th ta="center"> </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      {/* <AddTypePartModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        typeName={TypeName}
        fetchCarBrand={fetchCarBrand}
      />

      <EditTypePartModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> เพิ่มประเภทอะไหล่ </Text>}
        typeName={TypeName}
        TypePart={editCarBrand}
        fetchCarBrand={fetchCarBrand}
      /> */}
    </Stack>
  );
};

export default BrandTable;