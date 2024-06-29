import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
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
  IconCarCrash,
  IconCar,
} from "@tabler/icons-react";

import { Car } from "../type";

import { car } from "../type";

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const CarTable = () => {
  const [Cars, setCars] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");

  const [brand, setBrand] = useState("all");


  useEffect(() => {
    setCars(car);
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
    <Table.Tr key={Car.id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td ta="center">{Car.brand}</Table.Td>
      <Table.Td ta="center">{Car.model}</Table.Td>
    </Table.Tr>
  ));


  const CarBrand = removeDuplicates(Cars?.map((Car: Car) => Car.brand) || []);

 

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconCar size={30} />
          <Text size="xl" fw={700}>
            รายการรถยนต์
          </Text>
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
            ...CarBrand.map((brand) => ({ label: brand, value: brand })),
          ]}
          label="เลือกยี่ห้อรถยนต์"
          onChange={(value) => setBrand(value as string)}
        />
        <Text>
        &nbsp;
        </Text>
        <Text>
        &nbsp;
        </Text>
      </Group>

      <Paper  shadow="sm" radius="md" p={"sm"} withBorder>
      <Table highlightOnHover stickyHeader striped stickyHeaderOffset={55} >
            <Table.Thead>
              <Table.Tr>
                <Table.Th ta="center">ลำดับ</Table.Th>
                <Table.Th ta="center">ยี่ห้อรถยนต์</Table.Th>
                <Table.Th ta="center">รุ่นรถยนต์</Table.Th>
                <Table.Th ta="center"> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
  
      </Paper>

      {/* <AddCarModal
        opened={Addopened}
        onClose={closeAdd}
        title={<Text fw={900}> เพิ่มผู้ใช้งาน </Text>}
        Cars={Cars || []}
      />

      <EditCarModal
        opened={Editopened}
        onClose={closeEdit}
        title={<Text fw={900}> แก้ไขผู้ใช้งาน </Text>}
        Cars={editCar }
      /> */}
    </Stack>
  );
};

export default CarTable;
