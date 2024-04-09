"use client"
import React from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { Card, Container, Box, Button, TextInput, createTheme , MantineProvider, Center, rem, PasswordInput ,Text} from "@mantine/core";




export default function page() {
  const schema = z.object({
    username: z.string().nonempty({ message: 'กรุณากรอกชื่อผู้ใช้งาน' }),
    password: z.string().nonempty({ message: 'กรุณากรอกรหัสผ่าน'
    }),
  });
  
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(schema),
    
  });




  return (
  
    <Container size="responsive" py={100} >
      <Center>
      <Card bg="#F8F9FA" shadow="xs" padding="lg" withBorder w={500} >
        <form 
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            console.log(data);
            form.reset();
          })();
        }}
        >
        <Box>
          <Text fw={700} fz={30} ta="center" mb="md">Login</Text>
          <TextInput label="ชื่อผู้ใช้" placeholder="กรอกชื่อผู้ใช้งาน" mb={"xs"} 
          {...form.getInputProps('username')}
          />
          <PasswordInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            type="password"
            mb={"xs"} 
            {...form.getInputProps('password')}
            
          />
          <Center><Button color="#070b91" fullWidth  mt="md" type="submit">
            Log In
          </Button></Center>
          
        </Box>
        </form>
      </Card></Center>
    </Container>

 
  );
}
