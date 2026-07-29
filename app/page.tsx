import { Header, DesktopLandingBoard, ProductsSection, SuppliersSection } from "@/components/home";
import { DealsAndTrending } from "@/components/product/DealsandTrending";
import { dailyDeals } from "../components/product/data";
import FirstVisitModal from "@/components/home/FirstVisitModal";
import RFQMobile from "@/components/home/RFQMobile";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <FirstVisitModal />
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      <DesktopLandingBoard dailyDeals={dailyDeals} />
      <div className="py-2 md:py-10 lg:pt-2 px-0 md:px-10 lg:px-20 mb-6 md:mb-8 lg:mb-0">
        <DealsAndTrending dailyDeals={dailyDeals} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <RFQMobile />
      </Suspense>

      {/* <ShopBy /> */}
      <ProductsSection />
      <SuppliersSection />
    </>
  );
}