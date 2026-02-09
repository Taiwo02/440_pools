"use client"

import { useState } from "react";

export default function ProductImages({ imageList, countdown }: { imageList: string[], countdown?: React.ReactNode }) {
  const [mainImage, setMainImage] = useState(imageList?.[0]);

  if (!imageList || imageList.length === 0) return null;

  return (
    <>
      <div className="rounded-xl md:mb-8 bg-(--bg-surface) flex flex-col-reverse md:flex-row gap-4 items-stretch w-full">
        {/* Thumbnails */}
        <div 
          className="
            flex gap-2 w-[70vw] md:w-20 md:gap-4
            md:flex-col md:basis-1/6
            md:overflow-y-auto md:overflow-x-hidden md:h-120
            no-scrollbar overflow-x-auto overflow-y-hidden
          "
        >
          {imageList.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border-4 rounded-xl overflow-hidden w-20 h-20 md:w-20 md:h-auto shrink-0 ${mainImage === image ? "border-(--primary)" : "border-transparent"
                }`}
              onClick={() => setMainImage(image)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-80 md:w-full aspect-square object-cover"
              />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="w-full! md:basis-5/10">
          <div className="relative w-fit mx-auto">
            <img
              src={mainImage}
              alt="Product image"
              width={0}
              height={0}
              className="w-full h-120 rounded-xl object-contain"
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
