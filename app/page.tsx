import { Header, DesktopLandingBoard, ProductsSection, SuppliersSection } from "@/components/home";
import { DealsAndTrending } from "@/components/product/DealsandTrending";
import { dailyDeals } from "../components/product/data";

export default function Home() {
  return (
    <>
      <Header />
      <DesktopLandingBoard dailyDeals={dailyDeals} />
      <div className="py-2 md:py-10 lg:pt-2 px-0 md:px-10 lg:px-20 mb-6 md:mb-8 lg:mb-0">
        <DealsAndTrending
          dailyDeals={dailyDeals}
        />
      </div>
      
      {/* <ShopBy /> */}
      <ProductsSection />
      <SuppliersSection />
    </>
  );
}