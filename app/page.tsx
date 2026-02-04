import { Button } from "@/components/ui";
import Image from "next/image";
import { Header, ProductsSection, ShopBy, SuppliersSection } from "@/components/home";
import { Footer, Navbar } from "@/components/core";
import { DealsAndTrending } from "@/components/product/DealsandTrending";
import { dailyDeals, trendingItems } from "../components/product/data";

export default function Home() {
  return (
    <>
      <Header />
      <div className="py-20 px-4 md:px-10 lg:px-20">
        <DealsAndTrending
          dailyDeals={dailyDeals}
          trendingItems={trendingItems}
        />
      </div>
      
      <ShopBy />
      <ProductsSection />
      <SuppliersSection />
    </>
  );
}