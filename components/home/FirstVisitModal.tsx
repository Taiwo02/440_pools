"use client";

import { useGetBales } from "@/api/bale";
import { Bale, BaleFilters } from "@/types/types";
import { useEffect, useState } from "react";
import { Button, Progress, StarRating } from "../ui";
import { RiBuilding2Line, RiCloseLine, RiLoader5Line } from "react-icons/ri";
import ProductThumbPlaceholder from "../product/ProductThumbPlaceholder";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import UserBubbles from "../product/UserBubble";

export default function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(false);

  const [filters] = useState<BaleFilters>({
    categories: [],
    marketLocation: [],
    isSpecial: true,
  });

  const { data: allBales = [], isPending: balesPending } = useGetBales(filters);

  const gridBales: Bale[] = allBales.slice(0, 8);

  useEffect(() => {
    // const lastSeen = localStorage.getItem("hasVisited");

    // if (!lastSeen || Date.now() - Number(lastSeen) > 86400000) {
    //   setIsOpen(true);
    //   localStorage.setItem("hasVisited", Date.now().toString());
    // }
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  // ✅ safe early return AFTER hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-9999">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-2 py-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <RiCloseLine size={20} />
        </button>
      </div>
      <div className="bg-(--bg-surface) p-6 rounded-xl w-[90%] max-w-3xl">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div
            className={`w-full md:w-1/2 flex items-center ${balesPending ? "h-100" : "h-auto"}`}
          >
            <div className="p-2 text-start">
              <h2 className="text-xl font-bold mb-1 md:mb-4">
                Limited-Time Welcome Offer
              </h2>
              <p className="text-sm md:mb-6">
                Get 15% OFF your first order. Available for a short time only.
                Don’t miss out.
              </p>
              <Link href="/products/?isSpecial=true" className="block">
                <Button primary className="py-3! rounded-xl! hidden md:block">
                  Claim Offer
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            {balesPending ? (
              <div className="flex justify-center items-center h-52 w-full">
                <RiLoader5Line
                  className="animate-spin text-(--primary)"
                  size={40}
                />
              </div>
            ) : (
              <div className="w-full">
                <Swiper
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination, Autoplay]}
                  className="mySwiper"
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                >
                  {gridBales.map((item) => (
                    <SwiperSlide key={item.id}>
                      <ProductThumbPlaceholder
                        images={item.product.images}
                        productName={item.product.name}
                        className="rounded-t-xl!"
                        previewMaxChars={14}
                        imgClassName="h-40! md:h-60! w-full! object-cover! rounded-t-xl!"
                      />
                      <div className="p-2 md:p-3">
                        <p className="text-xs md:text-sm font-bold truncate">
                          {item.product.name}
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2 min-w-0">
                          <p className="flex items-center gap-1 text-xs text-(--text-muted) min-w-0 flex-1">
                            <RiBuilding2Line
                              className="shrink-0"
                              size={14}
                              aria-hidden
                            />
                            <span className="truncate">
                              {(
                                item.product as { supplier?: { name?: string } }
                              )?.supplier?.name ?? "Group Pool"}
                            </span>
                          </p>
                          <StarRating
                            rating={
                              (item.product as { rating?: number }).rating ?? 4
                            }
                            size={12}
                            className="shrink-0 mt-0"
                          />
                        </div>

                        <div className="mt-1">
                          <div className="flex justify-between items-center">
                            <p className="font-bold text-(--primary) text-xs md:text-sm">
                              {item.filledSlot}/{item.slot} Slots filled
                            </p>
                            <UserBubbles count={item.filledSlot} />
                          </div>
                          <div className="w-full h-2 rounded-full bg-(--primary-soft)">
                            <div
                              className="h-full rounded-full bg-(--primary) transition-all duration-300"
                              style={{
                                width: `${item.slot > 0 ? Math.round((item.filledSlot / item.slot) * 100) : 0}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <p className="text-(--text-primary) font-bold text-sm md:text-base leading-tight tabular-nums">
                            {(item.product as { currency?: string }).currency ??
                              "₦"}
                            {item.price.toLocaleString()}
                            <span className="text-[10px] md:text-xs font-normal text-(--text-muted) ml-1">
                              per unit
                            </span>
                          </p>
                          {item.oldPrice != null &&
                            item.oldPrice > item.price &&
                            item.oldPrice > 0 && (
                              <span className="inline-block max-w-full truncate rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                                Save:{" "}
                                {(item.product as { currency?: string })
                                  .currency ?? "₦"}
                                {(item.oldPrice - item.price).toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Button
                  primary
                  className="py-3! rounded-xl! block md:hidden mt-4"
                >
                  Claim Offer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
