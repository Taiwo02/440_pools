import { Button } from "@/components/ui";
import Image from "next/image";
import { ProductsSection, ShopBy, SuppliersSection } from "@/components/home";
import { Footer, Navbar } from "@/components/core";

export default function Home() {
  return (
    <>
      <header className="h-90 md:h-100 relative">
        <img src="/images/bg1.jpg" alt="" className="hidden w-full h-full object-cover" />
        <div className="hidden w-full h-full bg-black/50 absolute top-0 left-0 md:flex flex-col justify-center px-4 lg:px-20 text-white pt-20">
          <h1 className="text-3xl lg:text-5xl">
            Join <br /> <span className="text-(--primary)">Africa's Only</span> <br /> Demand Pool
          </h1>
          <p className="my-2 lg:my-3 max-w-150 font-light">
            Get direct from factory prices without meeting the minimum order requirements. Source from globally verified suppliers.
          </p>
          <div className="flex items-center gap-4">
            <Button primary>
              Start Sourcing
            </Button>
            <Button>
              Post RFQ
            </Button>
          </div>
        </div>
      </header>
      <ShopBy />
      <ProductsSection />
      <SuppliersSection />
    </>
  );
}