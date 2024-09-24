import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Container } from "@mui/material";
import ClientLocalizationProvider from "./components/localization-provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Job Search Log",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <AppRouterCacheProvider>
            <Container maxWidth="lg" sx={{ padding: "20px 0" }}>
              <ClientLocalizationProvider>{children}</ClientLocalizationProvider>
            </Container>
            <ToastContainer />
          </AppRouterCacheProvider>
        </main>
      </body>
    </html>
  );
}
