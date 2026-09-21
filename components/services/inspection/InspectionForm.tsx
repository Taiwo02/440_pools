"use client"
import { InspectionRequestType, OrderInspectionPayload } from '@/types/types';
import React, { FormEvent, useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { RiAddLine, RiArrowLeftLine, RiArrowRightLine, RiLoader5Line, RiPlaneLine, RiShipLine } from 'react-icons/ri';
import { Button, FileUpload, Input, OtpSlot } from '@/components/ui';
import RatesandAttachments from './RatesandAttachments';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getCrossSubdomainCookie } from '@/lib/utils';
import { OTPInput, SlotProps } from "input-otp";
import { useCreateInspectionRequest } from '@/api/services';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type Props = {}

const defaultValues: InspectionRequestType = {
  depth: "BASIC",
  supplier: {
    name: '',
    address: '',
    contact: '',
  },
  productDetails: {
    description: '',
    quantity: 1,
    unit: '',
    specifications: ''
  },
  pin: '',
  attachments: []
};

// const OtpSlot = (props: SlotProps) => {
//   return (
//     <div
//       className={`
//         relative w-12 h-14 flex items-center justify-center
//         text-xl border rounded-md
//         ${props.isActive ? "border-(--primary) ring-2 ring-(--primary)/30" : "border-gray-300"}
//       `}
//     >
//       {props.char !== null && (
//         <div className="w-3 h-3 rounded-full bg-(--primary)" />
//       )}
//       {props.hasFakeCaret && (
//         <div className="absolute w-px h-6 bg-(--primary) animate-pulse" />
//       )}
//     </div>
//   );
// };

const InspectionForm = (props: Props) => {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] =
    useState<InspectionRequestType>(defaultValues);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const { mutateAsync: createRequest, isPending, error } = useCreateInspectionRequest();

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

  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
  ) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "info") toast.info(message);
    else toast.warning(message);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // support numeric inputs (e.g. productDetails.quantity)
    const parsedValue =
      type === "number" ? (value === "" ? "" : Number(value)) : value;

    setFormValues((prevData) => {
      const keys = name.split(".");

      if (keys.length === 1) {
        return { ...prevData, [name]: parsedValue };
      }

      // nested path, e.g. "supplier.name" or "productDetails.quantity"
      const [parentKey, childKey] = keys as [
        keyof InspectionRequestType,
        string,
      ];

      return {
        ...prevData,
        [parentKey]: {
          ...(prevData[parentKey] as object),
          [childKey]: parsedValue,
        },
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formValues.pin.length !== OTP_LENGTH) {
      showToast("warning", "Please enter your full PIN");
      return;
    }

    const payload: InspectionRequestType = {
      ...formValues,
      productDetails: {
        ...formValues.productDetails,
        quantity: Number(formValues.productDetails.quantity) || 0,
      },
    };

    try {
      const res = await createRequest(payload);

      if(res.status == 200 || res.status == 201) {
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
  }

  const handleNext = () => {
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepLabels = [
    "Supplier Info",
    "Product Info",
    "Additional Info",
    "Verify"
  ];

  const step1Disabled =
    formValues.supplier.name == "" &&
    formValues.supplier.address == "" &&
    formValues.supplier.contact == "";

  const step2Disabled =
    formValues.productDetails.description == "" &&
    formValues.productDetails.quantity == 0 &&
    formValues.productDetails.specifications == "";

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
                  {idx < 3 && (
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
              if (e.key === "Enter" && step !== 4) {
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
                          name="supplier.address"
                          value={formValues.supplier.address}
                          handler={handleChange}
                          tag="Supplier Address"
                          placeholder="Enter supplier address"
                        />
                        <Input
                          element="input"
                          name="supplier.contact"
                          value={formValues.supplier.contact!}
                          handler={handleChange}
                          tag="Contact Information"
                          placeholder="Enter supplier contact info"
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
                ))}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <div className="space-y-4">
                    <div className="my-3">
                      <Input
                        element="textarea"
                        name="productDetails.description"
                        value={formValues.productDetails.description}
                        handler={handleChange}
                        tag="Product Description"
                        placeholder="Product Description"
                      />
                      <Input
                        element="input"
                        input_type='number'
                        name="productDetails.quantity"
                        value={formValues.productDetails.quantity}
                        handler={handleChange}
                        tag="Product Quantity"
                        placeholder="Enter quantity"
                      />
                      <Input
                        element="input"
                        name="productDetails.unit"
                        value={formValues.productDetails.unit}
                        handler={handleChange}
                        tag="Product Units"
                        placeholder="Enter unit"
                      />
                      <Input
                        element="textarea"
                        name="productDetails.specifications"
                        value={formValues.productDetails.specifications!}
                        handler={handleChange}
                        tag="Product Specifications"
                        placeholder="Product Specs"
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
                        disabled={step2Disabled}
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
                    <RatesandAttachments
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

              {step === 4 && (
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
}

export default InspectionForm