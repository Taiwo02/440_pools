"use client";

import { useGetDeliveries } from "@/api/order";
import DeliveryForm from "@/components/checkout/DeliveryForm";
import MyModal from "@/components/core/modal";
import { Badge, Button } from "@/components/ui";
import {
  getStoredCheckoutDeliveryId,
  setStoredCheckoutDeliveryId,
} from "@/lib/checkout-delivery-storage";
import type { DeliveryPayload } from "@/types/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiLoader5Line,
  RiPencilLine,
} from "react-icons/ri";
import { toast } from "react-toastify";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directOrder = searchParams.get("direct_order");
  const checkoutHref =
    directOrder === "true" ? "/checkout?direct_order=true" : "/checkout";

  const { data: deliveries = [], isPending } = useGetDeliveries();
  const [pickId, setPickId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (deliveries.length === 0) return;

    const storedId = getStoredCheckoutDeliveryId();
    const fromStored =
      storedId != null
        ? deliveries.find((d: DeliveryPayload) => d.id === storedId)
        : undefined;
    const fallback =
      deliveries.find((d: DeliveryPayload) => d.setDefault) || deliveries[0];

    const initial = fromStored ?? fallback;
    if (initial?.id != null) {
      setPickId(initial.id);
    }
  }, [deliveries]);

  const handleSelectAddress = () => {
    if (pickId == null) {
      toast.error("Choose an address to continue.");
      return;
    }
    setStoredCheckoutDeliveryId(pickId);
    router.push(checkoutHref);
  };

  return (
    <>
      <section className="min-h-screen bg-gray-50 pb-16 pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:pt-4 md:pb-20 lg:pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 md:mb-8">
            <Link
              href={checkoutHref}
              aria-label="Back to checkout"
              className="relative z-10 inline-flex min-h-11 min-w-11 w-fit items-center justify-center rounded-full border-2 border-white bg-(--primary) p-2.5 text-sm font-normal text-white shadow-sm transition-colors hover:bg-white hover:text-(--primary)"
            >
              <RiArrowLeftLine className="text-lg" aria-hidden />
            </Link>
            <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
              Address book
            </h1>
            <p className="text-sm text-gray-500">
              Select where we should deliver this order, then continue checkout.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1">
              {isPending ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
                  <RiLoader5Line
                    size={40}
                    className="animate-spin text-(--primary)"
                  />
                </div>
              ) : deliveries.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
                  <p className="mb-4">You don&apos;t have any saved addresses yet.</p>
                  <Button primary type="button" onClick={() => setIsModalOpen(true)}>
                    <RiAddLine className="inline" /> Add address
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <RiCheckLine size={14} aria-hidden />
                      </span>
                      <h2 className="text-xs font-bold tracking-wide text-gray-900 sm:text-sm">
                        1. CUSTOMER ADDRESS
                      </h2>
                    </div>
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      {deliveries.length}{" "}
                      {deliveries.length === 1 ? "address" : "addresses"}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 px-2 py-2 sm:px-4">
                    {deliveries.map((delivery: DeliveryPayload) => {
                      const id = delivery.id;
                      const selected = id != null && pickId === id;

                      return (
                        <label
                          key={id ?? `${delivery.address}-${delivery.phone}`}
                          className={`flex cursor-pointer gap-3 rounded-lg p-3 transition sm:p-4 ${
                            selected
                              ? "bg-(--primary-soft)/40 ring-2 ring-(--primary)"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="checkout-address"
                            className="mt-1 h-4 w-4 accent-(--primary)"
                            checked={selected}
                            onChange={() => id != null && setPickId(id)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="font-semibold text-gray-900">
                                {delivery.firstName} {delivery.LastName}
                              </p>
                              <button
                                type="button"
                                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-(--primary) hover:underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  toast.info("Edit address is coming soon.");
                                }}
                              >
                                <RiPencilLine size={14} aria-hidden />
                                Edit
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {delivery.address}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {delivery.region}, {delivery.city}, {delivery.state}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              {delivery.countryCode} {delivery.phone}
                            </p>
                            {delivery.setDefault && (
                              <Badge variant="secondary" className="mt-2 font-semibold">
                                Default address
                              </Badge>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--primary) hover:underline"
                    >
                      <RiAddLine size={18} aria-hidden />
                      Add address
                    </button>
                  </div>

                  <div className="flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      className="ring-2 ring-(--primary) bg-transparent text-(--primary)! sm:min-w-[120px]"
                      onClick={() => router.push(checkoutHref)}
                    >
                      Cancel
                    </Button>
                    <Button
                      primary
                      type="button"
                      className="sm:min-w-[160px]"
                      disabled={pickId == null}
                      onClick={handleSelectAddress}
                    >
                      Select address
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 hidden rounded-lg border border-gray-200 bg-white lg:block">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 opacity-70">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <RiCheckLine size={14} aria-hidden />
                  </span>
                  <h2 className="text-xs font-bold tracking-wide text-gray-500 sm:text-sm">
                    2. DELIVERY DETAILS
                  </h2>
                </div>
                <p className="px-4 py-4 text-sm text-gray-500">
                  Delivery options can be configured here later. Your order will
                  ship to the address you select above.
                </p>
              </div>

              <div className="mt-4 hidden rounded-lg border border-gray-200 bg-white lg:block">
                <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 opacity-70">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <RiCheckLine size={14} aria-hidden />
                  </span>
                  <h2 className="text-xs font-bold tracking-wide text-gray-500 sm:text-sm">
                    3. PAYMENT METHOD
                  </h2>
                </div>
                <p className="px-4 py-4 text-sm text-gray-500">
                  Pay securely on the checkout page (Paystack). Buy now, pay
                  later options appear there when available.
                </p>
              </div>
            </div>

            <aside className="w-full shrink-0 lg:w-96">
              <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-3 text-lg font-medium text-gray-900">
                  Order summary
                </h2>
                <p className="text-xs leading-relaxed text-gray-500">
                  You can confirm payment after returning to checkout with your
                  chosen address.
                </p>
                <Button
                  primary
                  type="button"
                  className="mt-6 w-full"
                  onClick={() => router.push(checkoutHref)}
                >
                  Back to checkout
                </Button>
                <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
                  By proceeding, you agree to the applicable terms for checkout
                  and delivery.
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-8">
            <Link
              href="/cart"
              className="text-sm font-medium text-(--primary) hover:underline"
            >
              {"< Go back & continue shopping"}
            </Link>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <MyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <DeliveryForm setIsModalOpen={setIsModalOpen} />
        </MyModal>
      )}
    </>
  );
}
