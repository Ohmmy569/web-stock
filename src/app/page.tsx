"use client";
import Image from "next/image";
import UserTable from "@components/UserTable";
import { Center, ColorInput, Container, Grid , Text } from "@mantine/core";
import { BasicAppShell } from "@components/Navbar";

export default function Home() {
  return (
    <>
    <BasicAppShell />
    <Container>
      <Center>
        <UserTable />
      </Center>
      <Center>
        <UserTable />
      </Center>
      <Center>
        <UserTable />
      </Center>
    </Container>
    </>
  );
}
