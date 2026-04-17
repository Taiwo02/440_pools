"use client";

import type { OrderList } from "@/types/checkout";
import { Badge, Button, Progress } from "@/components/ui";
import Countdown from "@/components/shared/Countdown";
import { getOrderStatusVariant } from "./orderStatusBadge";
import { format } from "date-fns";
import { useState } from "react";
import { useInitiatePayment, useConfirmPayment } from "@/api/order";
import { buildBaleFullInitiateBody } from "@/lib/initiate-payment-helpers";
import { openPaystackPopup } from "@/types/funcs";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import MyModal from "@/components/core/modal";
import SingleOrder from "./SingleOrder";

type Props = {
  order: OrderList;
};

export default function LockedPoolCard({ order }: Props) {
  const [paying, setPaying] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { mutateAsync: initiatePayment } = useInitiatePayment();
  const confirmPayment = useConfirmPayment();
  const queryClient = useQueryClient();

  const bale = order.bale;
  const slots = bale?.slots ?? 0;
  const filled = bale?.filledSlots ?? 0;
  const slotsLeft = Math.max(0, slots - filled);
  const poolClosed = bale?.status === "CLOSED" || bale?.status === "COMPLETED";
  const poolFilledUp = slots > 0 && filled >= slots;
  const endDate = bale?.endDate ?? null;

  const image = bale?.product?.images?.[0];
  const title = bale?.product?.name ?? "Pool";

  const dateLabel = (() => {
    try {
      return format(new Date(order.createdAt), "dd-MM-yy");
    } catch {
      return "";
    }
  })();

  const canCompletePayment =
    order.checkoutType === "BALE" &&
    order.status === "LOCKED" &&
    typeof order.checkoutId === "number" &&
    order.checkoutId > 0;

  const handleCompletePayment = async () => {
    if (!canCompletePayment) return;
    setPaying(true);
    try {
      const body = buildBaleFullInitiateBody(order.checkoutId);
      const res = await initiatePayment({
        body,
        idempotencyKey: crypto.randomUUID(),
      });
      if (res.status !== 200 && res.status !== 201) {
        toast.error("Could not start payment.");
        return;
      }
      const accessCode = res?.data?.data?.accessCode as string | undefined;
      if (!accessCode) {
        toast.error("Missing payment session.");
        return;
      }
      await openPaystackPopup(
        accessCode,
        async ({ reference }) => {
          await confirmPayment.mutateAsync(reference);
          toast.success("Payment successful");
          await queryClient.invalidateQueries({ queryKey: ["order"] });
        },
        () => toast.info("Payment cancelled")
      );
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Payment could not be started."
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-4 border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:gap-5">
        <button
          type="button"
          onClick={() => setDetailsOpen(true)}
          className="absolute right-3 top-3 text-sm font-semibold text-(--primary) hover:underline sm:top-4"
        >
          See details
        </button>

        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 pr-20 sm:pr-28">
          <p className="line-clamp-2 font-semibold text-gray-900 sm:text-lg">
            {title}
          </p>
          <p className="mt-1 text-sm text-gray-500">Order {order.id}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant={getOrderStatusVariant(order.status)}
              className="font-semibold uppercase"
            >
              {order.status.replaceAll("_", " ")}
            </Badge>
            {dateLabel ? (
              <span className="text-xs text-gray-500">On {dateLabel}</span>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-gray-600">Pool fill</span>
              <span className="font-semibold text-gray-900">
                {filled} / {slots} slots
              </span>
            </div>
            {slots > 0 ? (
              <Progress
                totalQty={slots}
                currentQty={filled}
                className="my-0!"
              />
            ) : null}

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm">
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Slots left
                </p>
                <p className="font-semibold text-gray-900">{slotsLeft}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Time left
                </p>
                {endDate ? (
                  <Countdown
                    endDate={endDate}
                    variant="inline"
                    className="text-sm"
                  />
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>

            <p className="text-sm font-medium text-gray-800">
              Pool:{" "}
              {poolClosed ? (
                <span className="text-(--primary)">Closed</span>
              ) : poolFilledUp ? (
                <span className="text-amber-600">Filled up</span>
              ) : (
                <span className="text-emerald-600">Open</span>
              )}
            </p>
          </div>

          {canCompletePayment ? (
            <Button
              type="button"
              primary
              isLoading={paying}
              disabled={paying}
              onClick={() => void handleCompletePayment()}
              className="mt-4 w-full max-w-xs sm:w-auto"
            >
              Complete payment
            </Button>
          ) : (
            <p className="mt-3 text-xs text-gray-500">
              Checkout reference missing — contact support if you still owe a
              lock payment.
            </p>
          )}
        </div>
      </div>

      <MyModal isModalOpen={detailsOpen} setIsModalOpen={setDetailsOpen}>
        {detailsOpen ? <SingleOrder orderId={order.id} /> : null}
      </MyModal>
    </>
  );
}
