"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiAddLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiShoppingCart2Line,
  RiCloseLine,
  RiUser3Line,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
} from "react-icons/ri";
import ImageUploader from "./UploadImages";
import SummaryStep from "./SummaryStep";
import { NIGERIAN_STATES, uploadImage, uploadRfq } from "@/api/rfq";
import type { RfqProduct, RfqCustomerInfo } from "@/types/rfq";
import { Button } from "@/components/ui";
import { toast } from "react-toastify";

const initialProduct: RfqProduct = {
  name: "",
  description: "",
  quantity: "",
  images: [],
  previeImages: [],
};

const initialCustomer: RfqCustomerInfo = {
  name: "",
  phone: "",
  email: "",
  address: "Lagos",
};

type RequestQuoteFormProps = {
  handleRfqPopup: () => void;
};

export default function RequestQuoteForm({ handleRfqPopup }: RequestQuoteFormProps) {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<RfqProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<RfqProduct>(initialProduct);
  const [customerInfo, setCustomerInfo] = useState<RfqCustomerInfo>(initialCustomer);

  const showToast = (type: "success" | "error" | "warning" | "info", message: string) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "info") toast.info(message);
    else toast.warning(message);
  };

  const handleImageUpload = async (productList: RfqProduct[]) => {
    const updatedProducts: RfqProduct[] = [];
    for (const product of productList) {
      const uploadedImages = await Promise.all(
        product.images.map(async (img) => {
          if (img instanceof File && img.name) {
            const formData = new FormData();
            formData.append("file", img);
            const data = await uploadImage(formData);
            return data?.filename ?? img;
          }
          return img;
        })
      );
      updatedProducts.push({
        ...product,
        images: uploadedImages,
      });
    }
    setProducts(updatedProducts);
  };

  const handleAddOrUpdateProduct = () => {
    if (!currentProduct.name.trim()) {
      showToast("error", "Enter product name first");
      return;
    }
    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = { ...currentProduct };
      setProducts(updated);
      handleImageUpload(updated);
      setEditIndex(null);
      showToast("success", "Item updated successfully ✅");
    } else {
      const newProducts = [...products, { ...currentProduct }];
      setProducts(newProducts);
      handleImageUpload(newProducts);
      showToast("success", "Item added to cart ✅");
    }
    setCurrentProduct(initialProduct);
  };

  const handleEditProduct = (index: number) => {
    setCurrentProduct(products[index]);
    setEditIndex(index);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 1 && products.length === 0) {
      showToast("error", "Add at least one product first");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (
      !customerInfo.name.trim() ||
      !customerInfo.phone.trim() ||
      !customerInfo.email.trim() ||
      !customerInfo.address.trim()
    ) {
      showToast("error", "Please fill all required fields (Name, Email, Phone, and State)");
      return;
    }
    setIsLoading(true);
    try {
      await uploadRfq({ customer: customerInfo, products });
      setIsLoading(false);
      setStep(1);
      setCustomerInfo(initialCustomer);
      setCurrentProduct(initialProduct);
      setProducts([]);
      showToast("success", "Quotation Request Submitted Successfully ✅");
    } catch {
      setIsLoading(false);
      showToast("error", "Something went wrong, please try again");
    }
  };

  const stepLabels = ["Products", "Summary", "Customer Info"];

  return (
    <div className="text-black w-full max-w-4xl px-0 z-50 relative rounded-none md:rounded-2xl shadow-lg">
      <div className="relative flex flex-col order-2 md:order-1">
        <div className="w-full sm:max-w-4xl mx-auto bg-white shadow-lg rounded-none md:rounded-2xl p-4 sm:p-8 justify-self-center">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              Request for Quotation
              <span className="relative inline-flex">
                <RiShoppingCart2Line className="text-(--primary) text-xl" />
                <span className="absolute -top-2 -right-2 bg-(--primary) text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {products.length}
                </span>
              </span>
            </h2>
            <button
              type="button"
              onClick={handleRfqPopup}
              className="text-red-500 hover:text-red-600 transition z-50 p-1"
              aria-label="Close"
            >
              <RiCloseLine size={28} />
            </button>
          </div>

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 mb-6 pt-5">
            {stepLabels.map((label, idx) => {
              const n = idx + 1;
              const active = step >= n;
              return (
                <div key={label} className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-bold ${
                      active ? "bg-(--primary) text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {n}
                  </div>
                  <span
                    className={`ml-2 mr-3 text-sm sm:text-base hidden xs:inline sm:inline ${
                      active ? "text-(--primary)" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                  {idx < 2 && (
                    <div
                      className={`hidden sm:block w-12 h-0.5 ${
                        step > n ? "bg-(--primary)" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <div className="space-y-4">
                  <div className="max-h-[60vh] overflow-y-auto p-1 space-y-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={currentProduct.name}
                        onChange={(e) =>
                          setCurrentProduct((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Description"
                        value={currentProduct.description}
                        onChange={(e) =>
                          setCurrentProduct((p) => ({ ...p, description: e.target.value }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm min-h-25 resize-none focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={currentProduct.quantity}
                        onChange={(e) =>
                          setCurrentProduct((p) => ({ ...p, quantity: e.target.value }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                      />
                    </div>
                    <ImageUploader
                      showToast={showToast}
                      currentProduct={currentProduct}
                      setCurrentProduct={setCurrentProduct}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-between mt-4">
                    <Button
                      type="button"
                      primary
                      onClick={handleAddOrUpdateProduct}
                      className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <RiAddLine /> {editIndex !== null ? "Update Product" : "Add to Cart"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
                    >
                      Next <RiArrowRightLine />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <SummaryStep
                products={products}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onNext={handleNext}
                onBack={handleBack}
                onAddMore={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="max-h-[60vh] overflow-y-auto space-y-4">
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={customerInfo.name}
                          onChange={(e) =>
                            setCustomerInfo((c) => ({ ...c, name: e.target.value }))
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={customerInfo.phone}
                          onChange={(e) =>
                            setCustomerInfo((c) => ({ ...c, phone: e.target.value }))
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={customerInfo.email}
                          onChange={(e) =>
                            setCustomerInfo((c) => ({ ...c, email: e.target.value }))
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-normal text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <RiMapPinLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          value={customerInfo.address}
                          onChange={(e) =>
                            setCustomerInfo((c) => ({ ...c, address: e.target.value }))
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent bg-white"
                        >
                          {NIGERIAN_STATES.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.text}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-between mt-4">
                    <Button
                      type="button"
                      onClick={handleBack}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      <RiArrowLeftLine /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      primary
                      isLoading={isLoading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      {isLoading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
