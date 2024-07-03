"use client";
import React from "react";
import HistoryTable from "@/app/components/HistoryTable";
import {
  AppShell,
  Burger,
  Group,
  Divider,
  NavLink,
  Box,
  Image,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

function Page() {
  const matches = useMediaQuery("(min-width: 56.25em)");

  if (matches) {
    return (
      <div>
        <HistoryTable />
      </div>
    );
  } else {
    return (
      <div>
        <Text size="xl">SorrY, this page is only available on desktop</Text>
      </div>
    );
  }
}

export default Page;
