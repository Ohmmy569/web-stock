'use client';
import { Box, Button, Center, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';

import { LoginFormValues, loginSchema } from './schema';

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validate: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Box mt={20}>
        <TextInput
          label="ชื่อผู้ใช้"
          placeholder="กรอกชื่อผู้ใช้งาน"
          mb="xs"
          {...form.getInputProps('username')}
        />
        <PasswordInput
          label="รหัสผ่าน"
          placeholder="กรอกรหัสผ่าน"
          mb="md"
          {...form.getInputProps('password')}
        />
        <Center>
          <Button color="#070b91" fullWidth type="submit" loading={isLoading}>
            เข้าสู่ระบบ
          </Button>
        </Center>
      </Box>
    </form>
  );
}
