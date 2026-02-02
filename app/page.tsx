import { Button } from "@/components/ui";
import Image from "next/image";
import { ProductsSection, ShopBy, SuppliersSection } from "@/components/home";
import { Footer, Navbar } from "@/components/core";

export default function Home() {
  return (
    <>
      <header className="h-90 md:h-100 relative">
        <img src="/images/bg1.jpg" alt="" className="w-full h-full object-cover" />
        <div className="w-full h-full bg-black/50 absolute top-0 left-0 flex flex-col justify-center px-4 lg:px-20 text-white pt-20">
          <h1 className="text-3xl lg:text-5xl">
            Efficient <br /> <span className="text-(--primary)">Bulk Purchasing</span> <br /> Solutions
          </h1>
          <p className="my-2 lg:my-3 max-w-150 font-light">
            Connect with verified global manufacturers. Reduce costs by up to 40% with high-volume procurement and consolidated shipping
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
