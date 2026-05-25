import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/components/core";
import ConditionalMainPadding from "@/components/core/ConditionalMainPadding";
import MobileBottomNav from "@/components/core/MobileBottomNav";
import Providers from "@/providers/providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: {
    default: "Buy Bulk Products Easily",
    template: "%s | 440",
  },
  description: "Import directly from merchants",
  icons: {
    icon: "/images/favicon.svg",
    shortcut: "/images/favicon.svg",
    apple: "/images/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-(--bg-page) antialiased`}
      >
        <Providers>
          <Navbar />
          <ConditionalMainPadding>{children}</ConditionalMainPadding>
          <MobileBottomNav />
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
