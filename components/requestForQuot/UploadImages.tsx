"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { RfqProduct } from "@/types/rfq";

const MAX_IMAGES = 3;

type UploadImagesProps = {
  currentProduct: RfqProduct;
  setCurrentProduct: React.Dispatch<React.SetStateAction<RfqProduct>>;
  showToast: (type: "success" | "error" | "info" | "warning", message: string) => void;
};

export default function UploadImages({
  currentProduct,
  setCurrentProduct,
  showToast,
}: UploadImagesProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remainingSlots = MAX_IMAGES - currentProduct.images.length;
    if (files.length > remainingSlots) {
      showToast(
        "warning",
        `You can only upload ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""}.`
      );
    }
    const validFiles = files.slice(0, remainingSlots);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setCurrentProduct((p) => ({
      ...p,
      images: [...p.images, ...validFiles],
      previeImages: [...p.previeImages, ...newPreviews],
    }));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const remainingSlots = MAX_IMAGES - currentProduct.images.length;
    if (files.length > remainingSlots) {
      showToast(
        "warning",
        `You can only upload ${remainingSlots} more image${remainingSlots > 1 ? "s" : ""}.`
      );
    }
    const validFiles = files.slice(0, remainingSlots);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setCurrentProduct((p) => ({
      ...p,
      images: [...p.images, ...validFiles],
      previeImages: [...p.previeImages, ...newPreviews],
    }));
  };

  const removeImage = (index: number) => {
    setCurrentProduct((p) => ({
      ...p,
      images: p.images.filter((_, i) => i !== index),
      previeImages: p.previeImages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-normal text-gray-700 mb-2">
        Upload Product Images
      </label>
      {currentProduct.images.length < MAX_IMAGES && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onClick={() => document.getElementById("imageUpload")?.click()}
          onKeyDown={(e) => e.key === "Enter" && document.getElementById("imageUpload")?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-(--primary) bg-(--primary)/5"
              : "border-gray-300 bg-gray-50/50 hover:border-(--primary) hover:bg-(--primary)/5"
          }`}
        >
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center text-gray-600 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-(--primary) mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16l3.586-3.586a2 2 0 012.828 0L12 16m0 0l3.586-3.586a2 2 0 012.828 0L21 16m-9-5V4m0 7v7"
              />
            </svg>
            <p className="text-sm">
              <span className="font-semibold text-(--primary)">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
          </div>
        </motion.div>
      )}
      {currentProduct.previeImages.length > 0 && (
        <motion.div
          layout
          className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
        >
          {currentProduct.previeImages.map((img, i) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <img
                src={img}
                alt={`Preview ${i + 1}`}
                className="w-full h-24 sm:h-28 object-cover rounded-lg shadow-sm border border-gray-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove image"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
