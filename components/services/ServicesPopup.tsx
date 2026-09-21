"use client";

import React, { useState } from "react";
import {
  RiArrowLeftSLine,
  RiCloseLine,
  RiFileList3Fill,
  RiFileList3Line,
  RiSurveyLine,
  RiTruckLine,
  RiVerifiedBadgeLine,
} from "react-icons/ri";
import ServiceCard from "./ServiceCard";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui";
import { RequestQuoteForm } from "./requestForQuot";
import LogisticsForm from "./logistics/LogisticsForm";
import InspectionForm from "./inspection/InspectionForm";
import VerificationForm from "./verification/VerificationForm";

type Props = {
  handleRfqPopup: () => void;
};

const ServicesPopup = ({ handleRfqPopup }: Props) => {
  const [activeService, setActiveService] = useState<
    "" | "rfq" | "logistics" | "inspect" | "verify"
  >("");
  const [stage, setStage] = useState(1);

  const handleNext = () => {
    setStage((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStage((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    {
      icon: <RiFileList3Line size={40} />,
      label: "Request For Quotation",
      value: "rfq" as const,
      onClick: () => setActiveService("rfq"),
    },
    {
      icon: <RiTruckLine size={40} />,
      label: "Logistics",
      value: "logistics" as const,
      onClick: () => setActiveService("logistics"),
    },
    {
      icon: <RiVerifiedBadgeLine size={40} />,
      label: "Supplier Verification",
      value: "verify" as const,
      onClick: () => setActiveService("verify"),
    },
    {
      icon: <RiSurveyLine size={40} />,
      label: "Inspection",
      value: "inspect" as const,
      onClick: () => setActiveService("inspect"),
    },
  ];

  return (
    <div className="text-black w-full max-w-4xl px-0 z-50 relative rounded-none md:rounded-2xl shadow-lg">
      <div className="relative flex flex-col order-2 md:order-1">
        <div className="w-full sm:max-w-4xl mx-auto bg-white shadow-lg rounded-none md:rounded-2xl p-4 sm:p-8 justify-self-center">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex gap-4 items-center">
              {activeService !== "" && stage > 1 && (
                <RiArrowLeftSLine onClick={handleBack} size={32} className="cursor-pointer text-(--primary)" />
              )}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                {stage == 1 && "Services"}
                {activeService == "rfq" && stage > 1 && "Request For Quotation"}
                {activeService == "logistics" &&
                  stage > 1 &&
                  "Logistics Shipping"}
                {activeService == "inspect" && stage > 1 && "Order Inspection"}
                {activeService == "verify" && stage > 1 && "Verify Supplier"}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleRfqPopup}
              className="text-red-500 hover:text-red-600 transition z-50 p-1"
              aria-label="Close"
            >
              <RiCloseLine size={28} />
            </button>
          </div>
          <AnimatePresence mode="wait">
            {stage == 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="py-12 flex flex-col items-center justify-center"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 text-center">
                  Which service are you trying out today?
                </h2>
                <div className="w-4/5 md:w-5/7 mx-auto grid grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <ServiceCard
                      key={index}
                      icon={service.icon}
                      label={service.label}
                      active={activeService === service.value}
                      onClick={service.onClick}
                    />
                  ))}
                </div>
                <Button
                  primary
                  className="mt-6"
                  disabled={activeService == ""}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </motion.div>
            )}

            {stage == 2 && activeService == "rfq" && (
              <RequestQuoteForm
                handleRfqPopup={handleRfqPopup}
              />
            )}

            {stage == 2 && activeService == "logistics" && (
              <LogisticsForm />
            )}

            {stage == 2 && activeService == "inspect" && (
              <InspectionForm />
            )}

            {stage == 2 && activeService == "verify" && (
              <VerificationForm />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ServicesPopup;
