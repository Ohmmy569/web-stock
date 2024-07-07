import React, { useEffect, useState } from "react";
import {
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconSearch,
  IconCar,
  IconHistory,
} from "@tabler/icons-react";

import { PartHistory } from "@/app/type";
import { collection, onSnapshot, query } from "firebase/firestore";
import { showNotification } from "@mantine/notifications";
import { db } from "../firebase/firebase";

const PartHistoryTable = () => {
  const [History, setHistory] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");

  const [sortbyDate, setSortbyDate] = useState("desc");
  const [action, setAction] = useState("all");

  useEffect(() => {
    const unsubscribePartsType = queryCollection("history", setHistory);
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
            timestamp: doc.data().timestamp?.toDate().getTime(),
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
    let value = event.target.value.replace(/\s/g, "");
    setSearch(value);
  };

  const filteredHistory = History?.filter((history: PartHistory) => {
    const searchFields = Object.values(history).join("").toLowerCase();
    return (
      searchFields.includes(search.toLowerCase()) &&
      (action === "all" || history.action === action)
    );
  }).sort((a, b) => {
    if (sortbyDate === "asc") {
      return a.timestamp - b.timestamp;
    } else {
      return b.timestamp - a.timestamp;
    }
  });

  const rows = filteredHistory?.map((history: PartHistory) => (
    <Table.Tr key={history._id}>
      <Table.Td ta="center">
        {" "}
        {new Date(history.timestamp).toLocaleString()}
      </Table.Td>
      <Table.Td ta="center">{history.username}</Table.Td>
      <Table.Td ta="center">
        {history.action == "เบิกสินค้า" ? (
          <Text color="red" fw={900}>
            {history.action}
          </Text>
        ) : (
          <Text color="green" fw={900}>
            {history.action}
          </Text>
        )}
      </Table.Td>
      <Table.Td ta="center">{history.partCode}</Table.Td>
      <Table.Td ta="center">{history.partName}</Table.Td>
      <Table.Td ta="center">{history.amount}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack align="stretch" justify="center" gap="md">
      <Group justify="space-between">
        <Group align="center" gap={5}>
          <IconHistory size={30} />
          <Text size="xl" fw={700}>
            ประวัติการเบิก - เติมอะไหล่
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
          placeholder="เลือกการกระทำ"
          data={[
            { label: "ทั้งหมด", value: "all" },
            { label: "เติมสินค้า", value: "เติมสินค้า" },
            { label: "เบิกสินค้า", value: "เบิกสินค้า" },
          ]}
          label="เลือกการกระทำ"
          defaultValue={"all"}
          onChange={(value) => setAction(value as string)}
          searchable
        />
        <Select
          placeholder="เลือกเรียงตามวันที่ / เวลา"
          data={[
            { label: "จากใหม่สุดไปเก่าสุด", value: "desc" },
            { label: "จากเก่าสุดไปใหม่สุด", value: "asc" },
          ]}
          label="เลือกเรียงตามวันที่ / เวลา"
          defaultValue={"desc"}
          onChange={(value) => setSortbyDate(value as string)}
        />
        <Text>&nbsp;</Text>
      </Group>

      <Paper shadow="sm" radius="md" p={"sm"} withBorder>
        <Table highlightOnHover stickyHeader striped stickyHeaderOffset={55}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th ta="center">วันที่ / เวลา</Table.Th>
              <Table.Th ta="center">ผู้ใช้</Table.Th>
              <Table.Th ta="center">การกระทำ</Table.Th>
              <Table.Th ta="center">รหัสอะไหล่</Table.Th>
              <Table.Th ta="center">ชื่ออะไหล่</Table.Th>
              <Table.Th ta="center">จำนวน</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

    </Stack>
  );
};

export default PartHistoryTable;
