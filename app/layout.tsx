import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Footer, Navbar } from "@/components/core";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-(--bg-page) antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 min-h-0">
              {children}
            </div>
            <MobileBottomNav />
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
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
    </>
  );
}
