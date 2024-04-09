//layout.tsx

import '@mantine/core/styles.css';
import React from 'react';

import { MantineProvider, ColorSchemeScript, createTheme, Container } from '@mantine/core';
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import Navbar from "@components/Navbar"



import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";


export const metadata = {
  title: 'AP-Stock',
};




const theme = createTheme({
  primaryColor: "blue",
  primaryShade: 7,
  defaultRadius: "md",
  fontFamily: "Jost, sans-serif",
  headings: {
    fontFamily: "Jost, sans-serif",
  },
  colors: {
    'myblue': ['#070b91', '#070b91', '#070b91', '#070b91', '#070b91', '#070b91', '#070b91', '#070b91', '#070b91', '#070b91'],
    'myred': ['#de0020', '#de0020' ,
    '#de0020',
    '#de0020',
    '#de0020',
    '#de0020',
    '#de0020',
    '#de0020',
    '#de0020',
    '#de0020'],
   
 
  },
  
});

export default function RootLayout({ children }: { children: any }) {

  

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
      <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            <ModalsProvider>
            <Navbar/>
              {children}</ModalsProvider>
          </MantineProvider>
      </body>
    </html>
  );
}
