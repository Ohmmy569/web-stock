import React from "react";
import {
  AppShell,
  Container,
  Button,
  Group,
  Center,
  Text,
} from "@mantine/core";

import classes from '@css/HeaderSimple.module.css';

const Navbar = () => {
  return (
  
    <header>
      <Container bg="#070b91" fluid py={5} mb={25}  style={{ boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)" }} >
        <Center>
        <div className={classes.stroke}>Ap - Stock</div>
        </Center>
      </Container>
      </header>
  );
}

export default Navbar;
