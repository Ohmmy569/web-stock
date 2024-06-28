// Code: Dashboard Layout
"use client";
import React, { useEffect, useState } from "react";
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
import { useDisclosure } from "@mantine/hooks";
import {
  IconShoppingCartCog,
  IconCar,
  IconEngine,
  IconTablePlus,
  IconLogout,
  IconUser,
  IconHistory,
  IconArticleFilled
} from "@tabler/icons-react";
import classes from "@css/nav.module.css";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { db } from "@/app/firebase/firebase";
import { User } from "../type";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([] as any[] | undefined);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    const collectionRef = collection(db, "user");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUsers(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  }, [status, router]);

  const [opened, { toggle }] = useDisclosure();
  const data = [
    {
      link: "/dashboard/parts",
      label: "อะไหล่รถยนต์",
      icon: IconEngine,
    },
    {
      link: "/dashboard/typeofparts",
      label: "ประเภทอะไหล่",
      icon: IconArticleFilled,
    },
    // {
    //   link: "/dashboard/outparts",
    //   label: "เบิกอะไหล่รถยนต์",
    //   icon: IconShoppingCartCog,
    // },
    // {
    //   link: "/dashboard/addparts",
    //   label: "เติมอะไหล่รถยนต์",
    //   icon: IconTablePlus,
    // },
    {
      link: "/dashboard/car",
      label: "รายการรถยนต์",
      icon: IconCar,
    },
 
    {
      link: "/dashboard/partHistory",
      label: "ประวัติการใช้งาน",
      icon: IconHistory,
    },
   
  ];

  const handleClick = (event: any, index: any) => {
    router.push(data[index].link);
    event.preventDefault();
  };

  const pathname = usePathname();

  if (status === "authenticated") {
    const UserEmail = session?.user?.email;
    const name = UserEmail?.split("@")[0];
    const ThisUser = users?.find(
      (user: User) => user.email === UserEmail
    ) as User;

    
    const passname = name;

    if (ThisUser?.role === "admin") {
      data.push({
        link: "/dashboard/user",
        label: "รายการผู้ใช้งาน",
        icon: IconUser,
      });
    }

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
                  const isActive = pathname?.startsWith(item.link);

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
                  label={name}
                  leftSection={<IconUser size="2rem" stroke={2} />}
                  color={"myblue"}
                  c={"myblue"}
                  fw={900}
                  p={10}
                  className={classes.navlink}
                />
                <NavLink
                  label={<strong>ออกจากระบบ</strong>}
                  leftSection={<IconLogout size="2rem" stroke={2} />}
                  onClick={() => signOut()}
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
}

DashboardLayout.requireAuth = true;
