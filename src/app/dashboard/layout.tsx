"use client";
import React, { useState } from "react";
import {
  AppShell,
  Burger,
  Skeleton,
  Group,
  Grid,
  rem,
  Button,
  Divider,
  NavLink,
  Box,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconShoppingCartCog,
  IconCar,
  IconEngine,
  IconTablePlus,
} from "@tabler/icons-react";
import classes from "@css/nav.module.css";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const data = [
    { link: "/dashboard/parts", label: "รายการอะไหล่", icon: IconEngine },
    {
      link: "/dashboard/parts/page.tsx",
      label: "รายการเบิกอะไหล่",
      icon: IconShoppingCartCog,
    },
    { link: "/dashboard/car", label: "รายการรถยนต์", icon: IconCar },
    {
      link: "/dashboard/parts/page.tsx",
      label: "รายการเพิ่มอะไหล่",
      icon: IconTablePlus,
    },
  ];
  const [active, setActive] = useState(0);

    const handleClick = (event : any, index : any)  => {
    event.preventDefault();
    setActive(index);

    window.location.href = data[index].link;
    

  }

  const items = data.map((item, index) => (
    <NavLink
      href={item.link}
      key={item.label}
      active={index === active}
      label={item.label}
      leftSection={<item.icon size="2rem" stroke={2} />}
      onClick={(event) => handleClick(event, index)}
      color={"#4746ED"}
      fw={900}
       // ตั้งค่าขนาดตัวอักษรที่ใหญ่ขึ้น
    />
  ));
  

  return (
    <section>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 250,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="sm"
      >
        <AppShell.Header bg={"myblue"}>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="md"
              c={"white"}
              color="white"
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar >
          <Box >{items}</Box>
        
          
        </AppShell.Navbar>
        <AppShell.Main> {children}</AppShell.Main>
      </AppShell>
    </section>
  );
}
