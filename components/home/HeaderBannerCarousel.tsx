"use client";

import { Button } from "../ui";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { RiFlashlightFill } from "react-icons/ri";
import "swiper/css";
import "swiper/css/pagination";

const BANNER_IMAGE = "/images/bg1.jpg";

/** Duplicate slides for now until CMS / API banners exist */
const SLIDE_COUNT = 3;

type Props = {
  onRequestQuote: () => void;
};

export default function HeaderBannerCarousel({ onRequestQuote }: Props) {
  return (
    <div
      className="
        relative w-full min-h-0 pb-7 md:h-full md:pb-0
        [&_.swiper]:md:h-full
        [&_.swiper-wrapper]:md:h-full
        [&_.swiper-slide]:md:!h-full
        [&_.swiper-pagination]:!bottom-0
        [&_.swiper-pagination]:md:!bottom-4
        [&_.swiper-pagination-bullet]:!mx-0.5
        [&_.swiper-pagination-bullet]:!h-1.5
        [&_.swiper-pagination-bullet]:!w-1.5
        [&_.swiper-pagination-bullet]:!rounded-full
        [&_.swiper-pagination-bullet]:!bg-(--text-muted)/30
        [&_.swiper-pagination-bullet]:!opacity-100
        [&_.swiper-pagination-bullet-active]:!w-5
        [&_.swiper-pagination-bullet-active]:!rounded-full
        [&_.swiper-pagination-bullet-active]:!bg-(--primary)
        md:[&_.swiper-pagination-bullet]:!bg-white/45
        md:[&_.swiper-pagination-bullet-active]:!bg-white
      "
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={SLIDE_COUNT >= 2}
        speed={450}
        grabCursor
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: "auto",
            spaceBetween: 10,
            centeredSlides: false,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: false,
          },
        }}
        className="w-full md:h-full !overflow-visible md:!overflow-hidden"
      >
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <SwiperSlide
            key={index}
            className="!h-auto !w-[min(82vw,17.5rem)] shrink-0 md:!h-full md:!w-full"
          >
            <div
              className="
                relative h-[8.75rem] overflow-hidden rounded-xl border border-(--border-default)
                bg-(--bg-surface) shadow-sm
                md:h-full md:min-h-0 md:rounded-xl md:border-0 md:shadow-none md:shadow-md
              "
            >
              <img
                src={BANNER_IMAGE}
                alt=""
                className="absolute inset-0 h-full w-full object-cover md:rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 md:bg-gradient-to-br md:from-transparent md:via-black/45 md:to-black/60 md:rounded-xl" />

              <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 md:hidden">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-(--primary) text-white shadow-sm">
                  <RiFlashlightFill className="text-sm" aria-hidden />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-white drop-shadow-sm">
                  Pool deals
                </span>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-3 pb-3 text-white md:justify-center md:p-4 md:px-4 lg:px-20 md:pb-0">
                <h1 className="hidden leading-tight md:block md:text-3xl lg:text-5xl">
                  Join <br />{" "}
                  <span className="text-(--primary)">Africa&apos;s Only</span>{" "}
                  <br /> Demand Pool
                </h1>
                <h2 className="text-sm font-bold leading-snug drop-shadow-sm md:hidden">
                  <span className="text-(--primary)">Join</span> Africa&apos;s demand pool
                </h2>
                <p className="mt-1 line-clamp-2 text-[11px] font-light leading-snug text-white/95 md:mt-1.5 md:mb-1.5 md:line-clamp-none md:text-sm lg:text-base lg:my-3 md:max-w-150">
                  <span className="md:hidden">
                    Factory-direct prices without high MOQs. Verified suppliers.
                  </span>
                  <span className="hidden md:inline">
                    Get direct from factory prices without meeting the minimum order
                    requirements. Source from globally verified suppliers.
                  </span>
                </p>
                <Button
                  type="button"
                  primary
                  className="relative z-[1] mt-2 w-full py-2! px-3! text-[11px]! shadow-lg md:mt-0 md:w-fit md:py-3! md:px-6! md:text-base!"
                  onClick={onRequestQuote}
                >
                  <span className="md:hidden">Request quote</span>
                  <span className="hidden md:inline">Request For Quotation</span>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
