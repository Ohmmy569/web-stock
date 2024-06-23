"use client";
import React, { useEffect, useState } from "react";
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
  Image,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconShoppingCartCog,
  IconCar,
  IconEngine,
  IconTablePlus,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import classes from "@css/nav.module.css";

import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  const data = [
    {
      link: "/dashboard/parts",
      label: 
          "รายการอะไหล่รถยนต์"
        
      ,
      icon: IconEngine,
    },
    {
      link: "/dashboard/outparts",
      label: 
          "รายการอะไหล่ที่เบิก"
      ,
      icon: IconShoppingCartCog,
    },
    {
      link: "/dashboard/car",
      label: 
          "รายการรถยนต์"
      ,
      icon: IconCar,
    },
    {
      link: "/dashboard/addparts",
      label: 
          "เพิ่มอะไหล่รถยนต์"
      ,
      icon: IconTablePlus,
    },
  ];

  const handleClick = (event: any, index: any) => {
    window.location.href = data[index].link;
    event.preventDefault();
  };

  const pathname = usePathname();
  const username = "Apcar";

  return (
    <section>
      <AppShell
        header={{ height: 55 }}
        navbar={{
          width: 240,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="sm"
      >
        <AppShell.Header bg={"myblue"}>
          <Group h="100%" px="xs" justify="space-between" gap="xl">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="md"
                c={"white"}
                color="white"
              />{" "}
            </Group>

            <Image
              alt="Banner"
              w="100%"
              h={54}
              radius="md"
              src="/navicon.png"
              m={0}
            />
            <Text> </Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <AppShell.Section grow>
            <Box>
              {data.map((item, index) => {
                const isActive = pathname.startsWith(item.link);

                return (
                  <NavLink
                    href={item.link}
                    key={index}
                    active={isActive}
                    label={item.label}
                    leftSection={<item.icon size="2rem" stroke={2} />}
                    onClick={(event) => handleClick(event, index)}
                    color={"#4746ED"}
                    fw={900}
                    p={10}
            
                  />
                );
              })}
            </Box>
          </AppShell.Section>
          <AppShell.Section pb={5}>
            <Divider p={5} size={2} />
            <Box>
            <NavLink
                label={username}
                leftSection={<IconUser size="2rem" stroke={2} />}
                // onClick={}
                color={"myblue"}
                c={"myblue"}
                fw={900}
                p={10}
                className={classes.navlink}
         
              />
              <NavLink
                label={"ออกจากระบบ"}
                leftSection={<IconLogout size="2rem" stroke={2} />}
                // onClick={}
                color={"red"}
                c={"red"}
                
                fw={900}
                p={10}
           
              />
            </Box>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main> {children}</AppShell.Main>
      </AppShell>
    </section>
  );
}
