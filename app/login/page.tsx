'use client';
import { useState } from 'react';

import { Card, Center, Container, Image, rem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

import { authClient } from '@/utils/auth/auth-client';

import { LoginForm } from './form/login-form';
import { LoginFormValues } from './form/schema';

export default function Page() {
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const matches = useMediaQuery('(min-width: 56.25em)');

  const [isLoading, setIsLoading] = useState(false);

  const handlesubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const res = await authClient.signIn.email({
        email: data.username,
        password: data.password,
        callbackURL: '/part',
      });

      if (res.error) {
        showNotification({
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          color: 'red',
          icon: xIcon,
          withBorder: true,
        });
      } else {
        showNotification({
          title: 'เข้าสู่ระบบสำเร็จ',
          message: 'เข้าสู่ระบบสำเร็จ',
          color: 'green',
          icon: checkIcon,
          withBorder: true,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      showNotification({
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        message: 'เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ',
        color: 'yellow',
        icon: xIcon,
        withBorder: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="responsive" py={70}>
      <Center>
        <Card shadow="xs" padding="lg" withBorder w={500}>
          {matches ? (
            <Image
              alt="Banner"
              w="100%"
              h={260}
              radius="md"
              src="/banner.png"
              m={0}
            />
          ) : (
            <Image
              alt="Banner"
              w="100%"
              h={200}
              radius="md"
              src="/banner.png"
              m={0}
            />
          )}
          <LoginForm onSubmit={handlesubmit} isLoading={isLoading} />
        </Card>
      </Center>
    </Container>
  );
}
