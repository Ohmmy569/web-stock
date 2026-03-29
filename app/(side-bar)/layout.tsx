'use client';
import React from 'react';

import { usePathname, useRouter } from 'next/navigation';

import {
  AppShell,
  Box,
  Burger,
  Divider,
  Group,
  Image,
  NavLink,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  IconArticleFilled,
  IconBrandToyota,
  IconCar,
  IconEngine,
  IconHistory,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';

import { authClient } from '@/utils/auth/auth-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending, error } = authClient.useSession();

  const router = useRouter();

  const [opened, { toggle, close }] = useDisclosure();
  const data = [
    {
      link: '/part',
      label: 'อะไหล่รถยนต์',
      icon: IconEngine,
    },
    {
      link: '/part-type',
      label: 'ประเภทอะไหล่',
      icon: IconArticleFilled,
    },
    {
      link: '/car-brand',
      label: 'ยี่ห้อรถยนต์',
      icon: IconBrandToyota,
    },
    {
      link: '/car-model',
      label: 'รุ่นรถยนต์',
      icon: IconCar,
    },

    {
      link: '/stock-history',
      label: 'ประวัติการเบิก - เติมอะไหล่',
      icon: IconHistory,
    },
  ];

  const pathname = usePathname();
  const LogOut = async () => {
    await authClient.signOut();
    showNotification({
      title: 'ออกจากระบบสำเร็จ',
      message: 'คุณได้ออกจากระบบแล้ว',
      color: 'green',
    });
    router.push('/login');
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error || !session) {
    router.push('/login');
  }

  return (
    <section>
      <AppShell
        header={{ height: 55 }}
        navbar={{
          width: 240,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="sm"
      >
        <AppShell.Header bg={'myblue'}>
          <Group h="100%" px="xs" justify="space-between" gap="xl">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="md"
                c={'white'}
                color="white"
              />{' '}
            </Group>

            <Image
              alt="Banner"
              width={'100%'}
              height={'80%'}
              maw={200}
              radius="md"
              src="/nav-icon.png"
            />
            <Text></Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <AppShell.Section grow>
            <Box>
              {data.map((item, index) => {
                const isActive =
                  pathname?.match(new RegExp(`^${item.link}(\\/.*)?$`)) !==
                  null;

                return (
                  <NavLink
                    href={item.link}
                    key={index}
                    active={isActive}
                    label={item.label}
                    leftSection={<item.icon size="2rem" stroke={2} />}
                    onClick={(event) => {
                      router.push(item.link);
                      close();
                      event?.preventDefault();
                    }}
                    color={'#4746ED'}
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
                label={session?.user?.email}
                leftSection={<IconUser size="2rem" stroke={2} />}
                color={'myblue'}
                c={'myblue'}
                fw={900}
                p={10}
              />
              <NavLink
                label={<strong>ออกจากระบบ</strong>}
                leftSection={<IconLogout size="2rem" stroke={2} />}
                onClick={() => LogOut()}
                color={'red'}
                c={'red'}
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
