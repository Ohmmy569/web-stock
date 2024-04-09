"use client"
import React from "react";
import cx from "clsx";
import { Card, Container, Box, Button, TextInput, createTheme , MantineProvider, Center} from "@mantine/core";
import classes from '@css/login.module.css';



export default function page() {
  


  return (
  
    <Container size="responsive" py={100} >
      
      <Card shadow="xs" padding="md" withBorder>
        <Box>
          <TextInput label="ชื่อผู้ใช้" placeholder="กรอกชื่อผู้ใช้งาน" />
          <TextInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            type="password"
          />
          
          <Button color="#070b91" fullWidth mt="md">
            Login
          </Button>
        </Box>
      </Card>
    </Container>

 
  );
}
