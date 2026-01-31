"use client"

import Image from "next/image";
import { useState } from "react";

export default function ProductImages({ imageList }: { imageList: string[] }) {
  const [mainImage, setMainImage] = useState(imageList?.[0]);

  if (!imageList || imageList.length === 0) return null;

  return (
    <div className="p-4 md:p-6 rounded-xl md:mb-8 bg-[--bg-surface]">
      {/* Main image */}
      <div className="mb-4">
        <Image
          src={mainImage}
          alt="Product image"
          width={0}
          height={0}
          className="w-full aspect-square rounded-xl object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {imageList.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer border-4 rounded-xl overflow-hidden ${mainImage === image ? "border-(--primary)" : "border-transparent"
              }`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              width={0}
              height={0}
              className="w-full aspect-square object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
