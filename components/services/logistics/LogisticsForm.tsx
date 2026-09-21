"use client";

import { LogisticsFormPayload } from "@/types/types";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiPlaneLine,
  RiShipLine,
} from "react-icons/ri";
import { Button, FileUpload, Input } from "@/components/ui";
import { useCreateLogisticsRequest } from "@/api/services";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { showToast } from "@/types/funcs";
import { AxiosError } from "axios";

type Props = {};

const defaultValues: LogisticsFormPayload = {
  images: [],
  description: "",
  currentAddress: "",
  destination: "",
  phone: "",
  email: "",
  fullName: "",
  shippingMode: "SEA",
  shippingOption: "",
};

const radioOptions = [
  {
    label: "Air",
    value: "air",
    node: <RiPlaneLine size={32} />,
  },
  {
    label: "Sea",
    value: "sea",
    node: <RiShipLine size={32} />,
  },
];

const selectOptions = [
  {
    label: "Consolidate",
    value: "consolidate",
  },
  {
    label: "Instant Send",
    value: "instant-send",
  },
];

const warehouses = [
  {
    label: "Lagos",
    value: "Lagos",
  },
  {
    label: "Port Harcourt",
    value: "Port Harcourt",
  },
  {
    label: "Abuja",
    value: "Abuja",
  },
];

const LogisticsForm = (props: Props) => {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] =
    useState<LogisticsFormPayload>(defaultValues);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);

  const {
    mutateAsync: createLogistics,
    isPending: isLogisticsPending,
    error: logisticError,
  } = useCreateLogisticsRequest();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formValues,
    };

    try {
      const res = await createLogistics(payload);

      if (res.status == 200 || res.status == 201) {
        setStep(1);
        showToast("success", "Request sent successfully");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      showToast(
        "error",
        err.response?.data?.message ??
          err.message ??
          "Something went wrong, please try again",
      );
    }
  };

  const handleNext = () => {
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const step1Disabled =
    formValues.shippingOption == "" ||
    formValues.currentAddress == "";

  const stepLabels = ["Shipping Info", "Product Info", "Customer Info"];

  return (
    <div className="w-full px-0 z-50 relative mt-3">
      <div className="relative flex flex-col order-2 md:order-1">
        <div className="w-full sm:max-w-4xl mx-auto justify-self-center">
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 mb-6 pt-5">
            {stepLabels.map((label, idx) => {
              const n = idx + 1;
              const active = step >= n;
              return (
                <div key={label} className="flex items-center relative">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? "bg-(--primary) text-white"
                        : "bg-gray-200 text-gray-600"
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
                  <div className="my-3">
                    <Input
                      element="input"
                      input_type="radio"
                      name="shippingMode"
                      value={formValues.shippingMode}
                      handler={handleChange}
                      tag="Shipping Mode"
                      radioOptions={radioOptions}
                    />
                    <Input
                      element="select"
                      name="shippingOption"
                      value={formValues.shippingOption}
                      handler={handleChange}
                      tag="Shipping Option"
                      selectOptions={selectOptions}
                      placeholder="Select shipping option"
                    />
                    <Input
                      element="textarea"
                      name="currentAddress"
                      value={formValues.currentAddress}
                      handler={handleChange}
                      tag="Route Information"
                      placeholder="Enter complete current address including street, building number and landmark"
                    />
                  </div>
                  <div className="flex flex-row gap-3 justify-end mt-4">
                    <Button
                      type="button"
                      primary
                      onClick={() => {}}
                      disabled={step == 1}
                      className="w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
                    >
                      <RiArrowLeftLine /> Previous
                    </Button>
                    <Button
                      type="button"
                      primary
                      onClick={() => handleNext()}
                      className="w-auto flex items-center justify-center gap-2"
                      disabled={step1Disabled}
                    >
                      Next <RiArrowRightLine />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <div className="space-y-4">
                  <div className="my-3">
                    <Input
                      element="textarea"
                      name="description"
                      value={formValues.description}
                      handler={handleChange}
                      tag="Product Description"
                      placeholder="Enter product description"
                    />
                    <FileUpload
                      label="Product Images"
                      name="image"
                      fileType="image"
                      maxSizeMB={3}
                      initialUrls={formValues.images}
                      onFilesChange={(uploaded) => {
                        setFormValues((prev) => ({
                          ...prev,
                          images: uploaded.map((u) => u.url),
                        }));
                      }}
                    />
                    <Input
                      element="select"
                      name="destination"
                      value={formValues.destination}
                      handler={handleChange}
                      tag="Select Destination Warehouse"
                      selectOptions={warehouses}
                      placeholder="Select warehouse"
                    />
                  </div>
                  <div className="flex flex-row gap-3 justify-end mt-4">
                    <Button
                      type="button"
                      primary
                      onClick={() => handleBack()}
                      className="w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
                    >
                      <RiArrowLeftLine /> Previous
                    </Button>
                    <Button
                      type="button"
                      primary
                      onClick={() => handleNext()}
                      className="w-auto flex items-center justify-center gap-2"
                      disabled={step1Disabled}
                    >
                      Next <RiArrowRightLine />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <div className="space-y-4">
                  <div className="my-3">
                    <Input
                      element="input"
                      name="fullName"
                      value={formValues.fullName}
                      handler={handleChange}
                      tag="Full Name"
                      placeholder="Enter full name"
                    />
                    <Input
                      element="input"
                      input_type="email"
                      name="email"
                      value={formValues.email}
                      handler={handleChange}
                      tag="Email Address"
                      placeholder="Enter email address"
                    />
                    <Input
                      element="input"
                      input_type="tel"
                      name="phone"
                      value={formValues.phone}
                      handler={handleChange}
                      tag="Phone Number"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex flex-row gap-3 justify-end mt-4">
                    <Button
                      type="button"
                      primary
                      onClick={() => handleBack()}
                      className="w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700"
                    >
                      <RiArrowLeftLine /> Previous
                    </Button>
                    <Button
                      type="button"
                      primary
                      onClick={() => handleSubmit()}
                      className="w-auto flex items-center justify-center gap-2"
                      disabled={isLogisticsPending}
                    >
                      Submit Request
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
};

export default LogisticsForm;
