"use client";
import Image from "next/image";
import UserTable from "@components/UserTable";
import { Center, ColorInput, Container, Grid , Text } from "@mantine/core";

export default function Home() {
  return (
    <Container>
      <Center>
        <UserTable />
      </Center>
    </Container>
  );
}
