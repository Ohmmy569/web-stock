import React from "react";
import {
  AppShell,
  Container,
  Button,
  Group,
  Center,
  Text,
} from "@mantine/core";

function Navbar() {
  return (
    <AppShell c={"myblue"} >
      <Container bg="#070b91" fluid py={5}>
        <Center>
        <Text size="lg" c={"myred"} bg={"myblue"} fw={700} style={{ textShadow: "1px 0 0 white , 0 1px 0 white , -1px 0 0 white , 0 -1px 0 white"   }}>{"Ap - Stock"}</Text>        </Center>
      </Container>
    </AppShell>
  );
}

export default Navbar;
