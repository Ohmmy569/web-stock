"use client";
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
  IconCar,
  IconRefresh,
  IconPlus,
  IconDotsVertical,
} from "@tabler/icons-react";

import AddCarModal from "./ModelCarModal/AddCarModel";
import EditCarModal from "./ModelCarModal/EditCarModel";

import { Car, CarBrand } from "../type";

import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const CarTable = (props: any) => {
  let mobile = props.matches;
  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [Cars, setCars] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");
  const [dataBrand, setDataBrand] = useState([] as any[] | undefined);
  const [modelName, setModelName] = useState([] as any[] | undefined);
  const [editModelName, setEditModelName] = useState([] as any[] | undefined);
  const [editCar, setEditCar] = useState({} as Car);

  const [brand, setBrand] = useState("all");

  const fetchCar = async () => {
    const res = await fetch("/api/modelcar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resBrand = await fetch("/api/brandcar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resBrand.ok) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการดึงข้อมูลยี่ห้อรถยนต์",
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลยี่ห้อรถยนต์",
        color: "red",
      });
      return;
    }
    if (!res.ok) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการดึงข้อมูลรถยนต์",
        message: "เกิดข้อผิดพลาดในการดึงข้อมูลรถยนต์",
        color: "red",
      });
      return;
    }
    const dataBrand = (await resBrand.json()) as CarBrand[];
    const data = (await res.json()) as Car[];
    setCars(data);
    setDataBrand(dataBrand);
  };

  const BrandCarName = dataBrand?.map(
    (dataBrand: any) => dataBrand.brand
  ) as string[];

  useEffect(() => {
    fetchCar();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //remove space
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredCars = Cars?.filter((Car: Car) => {
    //"car.brand + car.model" and remove space
    const searchFields = Object.values(Car).join("").toLowerCase();

    return (
      searchFields.includes(search.toLowerCase()) &&
      (brand === "all" || Car.brand === brand)
    );
  });

  const rows = filteredCars?.map((Car: Car, index) => (
    <Table.Tr key={Car._id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td ta="center">{Car.brand}</Table.Td>
      <Table.Td ta="center">{Car.name}</Table.Td>
      <Table.Td ta="center">
        <Group gap={"xs"}>
          <Tooltip label="แก้ไข">
            <ActionIcon
              variant="filled"
              color="yellow.8"
              onClick={() => OpenEdit(Car)}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="ลบ">
            <ActionIcon
              variant="filled"
              color="red.8"
              onClick={() =>
                openDeleteModal(Car._id, Car.brand + " " + Car.name)
              }
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const OpenAdd = () => {
    setModelName(Cars?.map((Car: Car) => Car.name) || []);
    openAdd();
  };

  const OpenEdit = (Car: Car) => {
    setEditCar(Car);
    setEditModelName(Cars?.filter((name) => name !== Car.name));
    openEdit();
  };

  const openDeleteModal = (CarId: any, Carname: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}>ลบรุ่นรถยนต์</Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบ <strong> {Carname}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removeCar(CarId, Carname);
        onclose;
      },
    });
  };

  async function removeCar(CarId: any, Carname: any) {
    try {
      const res = await fetch(`/api/modelcar/${CarId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.ok) {
        showNotification({
          title: "ลบรุ่นรถยนต์สำเร็จ",
          message: "ลบประเภท " + Carname + " สำเร็จ",
          color: "blue",
        });
        fetchCar();
        setCars(Cars?.filter((Car: Car) => Car._id !== CarId));
      } else {
        showNotification({
          title: "เกิดข้อผิดพลาดในการลบรุ่นรถยนต์",
          message: "เกิดข้อผิดพลาดในการลบรุ่นรถยนต์",
          color: "red",
        });
      }
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการลบรุ่นรถยนต์",
        message: error.message,
        color: "red",
      });
    }
  }

  const mobileRows = filteredCars?.map((Car: Car, index: number) => (
    <Card withBorder padding="xs" key={Car._id}>
      <Grid justify="center" align="center" gutter="4" columns={4}>
        <Grid.Col span={4}>
          <Group justify="space-between">
            <Text fw={700} size="md">
              {Car.name}
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
                  onClick={() => OpenEdit(Car)}
                >
                  แก้ไข
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  color="red.9"
                  onClick={() =>
                    openDeleteModal(Car._id, Car.brand + " " + Car.name)
                  }
                >
                  ลบ
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Grid.Col span={4}>
            <Text size="sm">ยี่ห้อ : {Car.brand}</Text>
          </Grid.Col>
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
              <IconCar size={30} />
              <Text size="xl" fw={700}>
                รายการรถยนต์
              </Text>
            </Group>
            <Group gap={"xs"}>
              <Tooltip label="รีเฟรชข้อมูล">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => {
                    fetchCar();
                  }}
                  size="lg"
                >
                  <IconRefresh />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="เพิ่มรายการอะไหล่">
                <Button
                  variant="filled"
                  color="green"
                  radius="md"
                  leftSection={<IconPlus size={20} stroke={2.5} />}
                  onClick={OpenAdd}
                >
                  เพิ่มรถยนต์
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
            <Select
              placeholder="เลือกยี่ห้อรถยนต์"
              data={[
                { label: "ทั้งหมด", value: "all" },
                ...BrandCarName.map((brand) => ({
                  label: brand,
                  value: brand,
                })),
              ]}
              label="เลือกยี่ห้อรถยนต์"
              onChange={(value) => setBrand(value as string)}
              defaultValue={"all"}
              searchable
            />
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
                  <Table.Th ta="center">ยี่ห้อ</Table.Th>
                  <Table.Th ta="center">รุ่น</Table.Th>
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
              <IconCar size={30} />
              <Text size="lg" fw={700}>
                รายการรถยนต์
              </Text>
            </Group>
            <Group gap={"xs"}>
              <Tooltip label="รีเฟรชข้อมูล">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => {
                    fetchCar();
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
                  onClick={OpenAdd}
                >
                  เพิ่มรถยนต์
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
            <Select
              placeholder="เลือกยี่ห้อรถยนต์"
              data={[
                { label: "ทั้งหมด", value: "all" },
                ...BrandCarName.map((brand) => ({
                  label: brand,
                  value: brand,
                })),
              ]}
              label="เลือกยี่ห้อรถยนต์"
              onChange={(value) => setBrand(value as string)}
              defaultValue={"all"}
              searchable
            />
          </Group>
          <Stack gap={"xs"}> {mobileRows}</Stack>
        </>
      )}

      <AddCarModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}>เพิ่มรุ่นรถยนต์</Text>}
        brandCarName={BrandCarName}
        modelCarName={modelName}
        fetchCar={fetchCar}
        setCarsModelName={setCars}
        allCars={Cars as Car[]}
      />

      <EditCarModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> แก้ไขผู้ใช้งาน </Text>}
        Cars={editCar}
        allCars={Cars as Car[]}
        brandCarName={BrandCarName}
        fetchCar={fetchCar}
        setCarsModelName={setCars}
        modelCarName={editModelName}
      />
    </Stack>
  );
};

export default CarTable;
