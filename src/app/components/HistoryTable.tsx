import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconHistory, IconRefresh } from "@tabler/icons-react";

import { PartHistory } from "@/app/type";
import { showNotification } from "@mantine/notifications";

const PartHistoryTable = () => {
  const [History, setHistory] = useState([] as any[] | undefined);
  const [search, setSearch] = useState("");

  const [sortbyDate, setSortbyDate] = useState("desc");
  const [action, setAction] = useState("all");

  const fetchHistory = async () => {
    try {
      const resHistory = await fetch("/api/addhistory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resHistory.ok) {
        showNotification({
          title: "เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ",
          message: "เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ",
          color: "red",
        });
        return;
      }

      const dataHistory = (await resHistory.json()) as History[];

      setHistory(dataHistory);
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ",
        message: error.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (sortbyDate === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  const rows = filteredHistory?.map((history: PartHistory) => (
    <Table.Tr key={history._id}>
      <Table.Td ta="center">
        {" "}
        {new Date(history.createdAt).toLocaleString()}
      </Table.Td>
      <Table.Td ta="center">{history.user}</Table.Td>
      {history.action == "เบิกสินค้า" ? (
        <Table.Td ta="center" c={"red"} fw={700}>{history.action}</Table.Td>
      ) : (
        <Table.Td ta="center"  c={"green"} fw={700}>{history.action}</Table.Td>
      )}
      <Table.Td ta="center">{history.partCode}</Table.Td>
      <Table.Td ta="center">{history.partName}</Table.Td>
      {history.action == "เบิกสินค้า" ? (
        <Table.Td ta="center" c={"red"} fw={700}>{history.amount}</Table.Td>
      ) : (
        <Table.Td ta="center"  c={"green"} fw={700}>{history.amount}</Table.Td>
      )}
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
        <Tooltip label="รีเฟรชข้อมูล">
          <ActionIcon
            variant="filled"
            color="blue"
            onClick={() => {
              fetchHistory();
            }}
            size="lg"
          >
            <IconRefresh />
          </ActionIcon>
        </Tooltip>
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
            { label: "ใหม่ไปเก่า", value: "desc" },
            { label: "เก่าไปใหม่", value: "asc" },
          ]}
          label="เลือกเรียงตามวันที่ / เวลา"
          defaultValue={"asc"}
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
