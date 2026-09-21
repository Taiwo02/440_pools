"use client";
import { useCreateVerifyRequest } from "@/api/services";
import { useAuth } from "@/hooks/use-auth";
import { getCrossSubdomainCookie } from "@/lib/utils";
import { VerifySupplierRequest } from "@/types/types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiLoader5Line,
  RiPlaneLine,
  RiShipLine,
} from "react-icons/ri";
import { Button, FileUpload, Input, OtpSlot } from "@/components/ui";
import { isObjectComplete, showToast } from "@/types/funcs";
import Attachments from "./Attachments";
import { OTPInput, SlotProps } from "input-otp";

type Props = {};

const defaultValues: VerifySupplierRequest = {
  supplier: {
    name: "",
    productType: "",
    location: {
      city: "",
      address: "",
      country: "",
    },
    contact: {
      person: "",
      phone: "",
      wechat: "",
      email: "",
    },
  },
  pin: "",
  attachments: [],
};

function setIn<T extends object>(obj: T, path: string[], value: unknown): T {
  const [head, ...rest] = path;
  const current = (obj as Record<string, unknown>)[head];
  return {
    ...obj,
    [head]: rest.length ? setIn((current ?? {}) as object, rest, value) : value,
  };
}

const VerificationForm = (props: Props) => {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] =
    useState<VerifySupplierRequest>(defaultValues);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const {
    mutateAsync: createRequest,
    isPending,
    error,
  } = useCreateVerifyRequest();

  const { user } = useAuth();
  const router = useRouter();
  const token = getCrossSubdomainCookie("440_token");

  useEffect(() => {
    if (!user || !token) {
      setIsNotLoggedIn(true);
      router.replace("/account");
      localStorage.setItem("redirectToServicePopup", "Yes");
    }
  }, [user, token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // support numeric inputs (e.g. productDetails.quantity)
    const parsedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    // setFormValues((prevData) => {
    //   const keys = name.split(".");

    //   if (keys.length === 1) {
    //     return { ...prevData, [name]: parsedValue };
    //   }

    //   // nested path, e.g. "supplier.name" or "productDetails.quantity"
    //   const [parentKey, childKey] = keys as [
    //     keyof VerifySupplierRequest,
    //     string,
    //   ];

    //   return {
    //     ...prevData,
    //     [parentKey]: {
    //       ...(prevData[parentKey] as object),
    //       [childKey]: parsedValue,
    //     },
    //   };
    // });
    setFormValues((prev) => setIn(prev, name.split("."), parsedValue));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formValues.pin.length !== OTP_LENGTH) {
      showToast("warning", "Please enter your full PIN");
      return;
    }

    const payload: VerifySupplierRequest = {
      ...formValues,
    };

    try {
      const res = await createRequest(payload);

      if (res.status == 200 || res.status == 201) {
        showToast("success", "Inspection request sent successfully");
        setStep(1);
        setFormValues(defaultValues);
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

  const stepLabels = ["Supplier Info", "Attachments", "Verify"];

  const step1Disabled = !isObjectComplete(formValues.supplier);

  // const step2Disabled =
  //   formValues.productDetails.description == "" &&
  //   formValues.productDetails.quantity == 0 &&
  //   formValues.productDetails.specifications == "";

  const OTP_LENGTH = 4;

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
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter" && step !== 3) {
                e.preventDefault();
              }
            }}
          >
            <AnimatePresence mode="wait">
              {step === 1 &&
                (isNotLoggedIn ? (
                  <div className="py-16 flex justify-center items-center">
                    <RiLoader5Line
                      size={40}
                      className="text-(--primary) animate-spin"
                    />
                  </div>
                ) : (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                  >
                    <div className="space-y-4">
                      <div className="my-3">
                        <fieldset>
                          <legend className="font-bold text-(--primary)">
                            Basic Info
                          </legend>
                          <Input
                            element="input"
                            name="supplier.name"
                            value={formValues.supplier.name}
                            handler={handleChange}
                            tag="Supplier Name"
                            placeholder="Enter supplier name"
                          />
                          <Input
                            element="input"
                            name="supplier.productType"
                            value={formValues.supplier.productType}
                            handler={handleChange}
                            tag="Product Type"
                            placeholder="Enter product type"
                          />
                          <Input
                            element="input"
                            name="supplier.contact.person"
                            value={formValues.supplier.contact.person}
                            handler={handleChange}
                            tag="Owner"
                            placeholder="Enter owner info"
                          />
                          <Input
                            element="input"
                            input_type="tel"
                            name="supplier.contact.phone"
                            value={formValues.supplier.contact.phone}
                            handler={handleChange}
                            tag="Phone Number"
                            placeholder="Enter supplier phone number"
                          />
                          <Input
                            element="input"
                            name="supplier.contact.wechat"
                            value={formValues.supplier.contact.wechat}
                            handler={handleChange}
                            tag="WeChat"
                            placeholder="Enter supplier's wechat"
                          />
                          <Input
                            element="input"
                            input_type="email"
                            name="supplier.contact.email"
                            value={formValues.supplier.contact.email}
                            handler={handleChange}
                            tag="Email"
                            placeholder="Enter supplier's email"
                          />
                        </fieldset>
                        {/* Location info */}
                        <fieldset>
                          <legend className="font-bold text-(--primary)">
                            Location Info
                          </legend>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              element="input"
                              name="supplier.location.city"
                              value={formValues.supplier.location.city}
                              handler={handleChange}
                              tag="City"
                              placeholder="Enter city"
                            />
                            <Input
                              element="input"
                              name="supplier.location.country"
                              value={formValues.supplier.location.country}
                              handler={handleChange}
                              tag="Country"
                              placeholder="Enter country"
                            />
                          </div>
                          <Input
                            element="input"
                            name="supplier.location.address"
                            value={formValues.supplier.location.address}
                            handler={handleChange}
                            tag="Address"
                            placeholder="Enter address"
                          />
                        </fieldset>
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
                ))}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <div className="space-y-4">
                    <Attachments
                      formValues={formValues}
                      setFormValues={setFormValues}
                      handleChange={handleChange}
                    />
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
                        // disabled={step2Disabled}
                      >
                        Next <RiArrowRightLine />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <div className="space-y-4">
                    <div className="my-3">
                      <p className="font-bold text-center mb-3">
                        Enter your wallet PIN
                      </p>
                      <OTPInput
                        name="pin"
                        value={formValues.pin}
                        onChange={(newValue) =>
                          setFormValues((prev) => ({ ...prev, pin: newValue }))
                        }
                        maxLength={OTP_LENGTH}
                        containerClassName="flex gap-2 justify-center"
                        render={({ slots }) => (
                          <div className="flex gap-2">
                            {slots.map((slot, idx) => (
                              <OtpSlot key={idx} {...slot} />
                            ))}
                          </div>
                        )}
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
                        type="submit"
                        primary
                        // onClick={() => handleNext()}
                        className="w-auto flex items-center justify-center gap-2"
                        disabled={isPending}
                      >
                        Submit Request
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
