import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
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
import cx from "clsx";
import classes from "./TableScrollArea.module.css";
import { Car } from "../type";
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
import { car } from "../type";

// import AddCarModal from "@components/CarModal/AddCarModal";
// import EditCarModal from "./CarModal/EditCarModal";
import { modals } from "@mantine/modals";
import { set } from "zod";
import { showNotification } from "@mantine/notifications";

function removeDuplicates(arr: any[]) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const CarTable = () => {
  const [Cars, setCars] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [editCar, setEditCar] = useState({} as Car);
  const [brand, setBrand] = useState("all");

  const [Addopened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [Editopened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  useEffect(() => {
    // try {
    //   const collectionRef = collection(db, "cars");
    //   const q = query(collectionRef);
    //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //     setCars(
    //       querySnapshot.docs.map((doc) => ({
    //         ...doc.data(),
    //         id: doc.id,
    //       }))
    //     );
    //   });
    //   return unsubscribe;
    // } catch (error: any) {
    //   showNotification({
    //     title: "เกิดข้อผิดพลาดในการดึงข้อมูลรถยนต์",
    //     message: error.message,
    //     color: "red",
    //   });
    // }
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

  function OpenEdit(Car: Car) {
    setEditCar(Car);
    openEdit();
  }

  const rows = filteredCars?.map((Car: Car, index) => (
    <Table.Tr key={Car.id}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td ta="center">{Car.brand}</Table.Td>
      <Table.Td ta="center">{Car.model}</Table.Td>
      <Table.Td ta="center">
        <Tooltip label="แก้ไข">
          <ActionIcon
            variant="filled"
            color="yellow.8"
            onClick={() => OpenEdit(Car)}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        &nbsp;&nbsp;
        <Tooltip label="ลบ">
          <ActionIcon
            variant="filled"
            color="red.8"
            onClick={() => openDeleteModal(Car.id, Car.brand + " " + Car.model)}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  async function removeCar(CarId: any) {
    try {
      const docRef = doc(db, "Car", CarId);
      await deleteDoc(docRef);
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการลบรถยนต์",
        message: error.message,
        color: "red",
      });
    }
  }

  const openDeleteModal = (CarId: any, Carname: any) => {
    modals.openConfirmModal({
      title: <Text fw={900}> ลบรถยนต์ </Text>,
      centered: true,
      children: (
        <Text size="sm">
          ต้องการลบรถยนต์ <strong> {Carname}</strong> ใช่หรือไม่
        </Text>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      confirmProps: { color: "red" },
      onCancel: () => onclose,
      onConfirm: () => {
        removeCar(CarId);
        onclose;
      },
    });
  };

  function addBulkCar() {}

  const CarBrand = removeDuplicates(Cars?.map((Car: Car) => Car.brand) || []);

  // cars.forEach(async (car) => {
  //   try {
  //     await addDoc(collection(db, "cars"), car);
  //   } catch (error: any) {
  //     showNotification({
  //       title: "Failed to add Car",
  //       message: error.message,
  //       color: "red",
  //     });
  //   }
  // });

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconCar size={25} />
          <Text size="xl" fw={700}>
            รายการรถยนต์
          </Text>
        </Group>
        <Tooltip label="เพิ่มผู้ใช้งาน">
          <Button
            variant="filled"
            color="lime.8"
            radius="md"
            onClick={() => addBulkCar()}
          >
            เพิ่มรถยนต์
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
        <Select
          placeholder="เลือกยี่ห้อรถยนต์"
          data={[
            { label: "ทั้งหมด", value: "all" },
            ...CarBrand.map((brand) => ({ label: brand, value: brand })),
          ]}
          label="เลือกยี่ห้อรถยนต์"
          onChange={(value) => setBrand(value as string)}
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
                <Table.Th ta="center">ลำดับ</Table.Th>
                <Table.Th ta="center">ยี่ห้อรถยนต์</Table.Th>
                <Table.Th ta="center">รุ่นรถยนต์</Table.Th>
                <Table.Th ta="center"> </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

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
