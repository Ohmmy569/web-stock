import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { TRPCProvider } from '@/trpc/client';
import { HydrateClient } from '@/trpc/server';
import { theme } from '@/utils/theme';

import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Apcar Stock',
  description: 'ระบบจัดการสต็อกอะไหล่รถยนต์',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCProvider>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications autoClose={3000} />
            <ModalsProvider>
              <HydrateClient>{children}</HydrateClient>
            </ModalsProvider>
          </MantineProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
