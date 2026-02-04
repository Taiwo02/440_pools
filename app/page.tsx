import { Button } from "@/components/ui";
import Image from "next/image";
import { Header, ProductsSection, ShopBy, SuppliersSection } from "@/components/home";
import { Footer, Navbar } from "@/components/core";

export default function Home() {
  return (
    <>
      <Header />
      <ShopBy />
      <ProductsSection />
      <SuppliersSection />
    </>
  );
}