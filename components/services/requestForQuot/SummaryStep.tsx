"use client";

import { motion } from "framer-motion";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import type { RfqProduct } from "@/types/rfq";

type SummaryStepProps = {
  products: RfqProduct[];
  onEditProduct: (index: number) => void;
  onDeleteProduct: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  onAddMore: () => void;
};

export default function SummaryStep({
  products,
  onEditProduct,
  onDeleteProduct,
  onNext,
  onBack,
  onAddMore,
}: SummaryStepProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="flex flex-col min-h-[50vh] sm:min-h-[60vh]"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        Review Your Products
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products added yet.</p>
        ) : (
          products.map((p, index) => (
            <div
              key={`${p.name}-${index}`}
              className="relative rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-start bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEditProduct(index)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition transform hover:scale-105"
                  title="Edit"
                  aria-label="Edit product"
                >
                  <RiEditLine className="text-lg sm:text-xl" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteProduct(index)}
                  className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition transform hover:scale-105"
                  title="Delete"
                  aria-label="Delete product"
                >
                  <RiDeleteBinLine className="text-lg sm:text-xl" />
                </button>
              </div>

              <div className="shrink-0 flex gap-2">
                {p.previeImages[0] ? (
                  <img
                    src={p.previeImages[0]}
                    alt={p.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-(--primary)">{p.name}</h3>
                <p className="text-gray-700 text-sm mt-1 line-clamp-2">{p.description}</p>
                <p className="text-sm text-gray-500 mt-2">Qty: {p.quantity}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {p.previeImages.map((img, i) => (
                    <img
                      key={`${img}-${i}`}
                      src={img}
                      alt={`${p.name} ${i + 1}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 mt-4 flex flex-col sm:flex-row justify-between gap-3 px-0">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
        >
          <RiArrowLeftLine /> Back
        </button>
        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            type="button"
            onClick={onAddMore}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-(--primary)/10 text-(--primary) px-4 py-2.5 rounded-lg hover:bg-(--primary)/20 transition text-sm font-medium"
          >
            Add More
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-(--primary) text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition text-sm font-medium"
          >
            Next <RiArrowRightLine />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
