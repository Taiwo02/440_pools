"use client"

import { useState } from "react";

export default function ProductImages({ imageList, countdown }: { imageList: string[], countdown?: React.ReactNode }) {
  const [mainImage, setMainImage] = useState(imageList?.[0]);

  if (!imageList || imageList.length === 0) return null;

  return (
    <>
      <div className="rounded-xl md:mb-8 bg-(--bg-surface) flex flex-col-reverse md:flex-row gap-2 md:gap-3 items-start w-full">
        {/* Thumbnails */}
        <div
          className="
            flex gap-2 w-full max-w-full
            md:w-20 md:shrink-0 md:flex-col md:gap-3
            md:h-120 md:overflow-y-auto md:overflow-x-hidden
            no-scrollbar overflow-x-auto overflow-y-hidden
          "
        >
          {imageList.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border-2 md:border-[3px] rounded-lg overflow-hidden w-16 h-16 sm:w-20 sm:h-20 md:w-full md:aspect-square shrink-0 ${
                mainImage === image
                  ? "border-(--primary)"
                  : "border-transparent"
              }`}
              onClick={() => setMainImage(image)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main image — fixed height on mobile so every product uses the same frame */}
        <div className="min-w-0 w-full flex-1 pt-4 md:pt-0">
          <div className="relative w-full h-80 sm:h-96 md:h-auto overflow-hidden rounded-xl">
            <img
              src={mainImage}
              alt="Product image"
              width={0}
              height={0}
              className="h-full w-full object-cover md:h-140 md:max-h-none md:w-full"
            />
            {countdown}
          </div>
        </div>
      </div>

      {/* <div className="flex gap-4 w-full max-w-full overflow-x-auto">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="w-40 h-40 bg-red-200 shrink-0"
          />
        ))}
      </div> */}
    </>
  );
}
