"use client"

import { useGetUserProfile } from '@/api/auth'
import { useConfirmPayment, useCreateBaleSlot, useDeliveryMutation, useDirectOrder, useGetDeliveries, useInitiatePayment, useOrderMutation } from '@/api/order'
import { useGetWalletBalance } from '@/api/wallet'
import WalletPinModal from '@/components/shared/WalletPinModal'
import DeliveryForm from '@/components/checkout/DeliveryForm'
import * as Slider from "@radix-ui/react-slider";
import MyModal from '@/components/core/modal'
import { Badge, Button, Input } from '@/components/ui'
import { useBuy } from '@/hooks/use-buy'
import { useCart } from '@/hooks/use-cart'
import { openPaystackPopup } from '@/types/funcs'
import { BaleSlot, CartItem, DeliveryPayload, Initiate, SizeItem } from '@/types/types'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect, useMemo } from 'react'

import {
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiSecurePaymentLine,
  RiTruckLine,
  RiMapPinLine,
  RiPhoneLine,
  RiMailLine,
  RiUser3Line,
  RiBankCardLine,
  RiCheckLine,
  RiLoader4Line,
  RiLoader5Line,
  RiCloseLine,
  RiQuestionLine,
  RiRefund2Line,
  RiWallet3Line,
  RiErrorWarningLine,
} from 'react-icons/ri'
import { toast } from 'react-toastify'
import { DirectOrderPayload } from '@/types/checkout';
import { getStoredCheckoutDeliveryId } from '@/lib/checkout-delivery-storage';
import {
  buildBaleLockInitiateBody,
  buildDirectUpfrontInitiateBody,
  parseCheckoutIntentCheckoutId,
  parseDirectOrderOrderId,
} from '@/lib/initiate-payment-helpers';

type ShipmentGroupEntry = [number, CartItem[]];

function CheckoutShipmentCards({
  cartItems,
  shipmentGroups,
}: {
  cartItems: CartItem[];
  shipmentGroups: ShipmentGroupEntry[];
}) {
  if (cartItems.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
        Your cart is empty. Add items before checkout.
      </p>
    );
  }

  const lineUnits = (item: CartItem) =>
    Math.max(1, item.quantity) * Math.max(1, item.slots || 1);

  const n = shipmentGroups.length;

  return (
    <>
      <div
        className={`grid gap-4 ${
          shipmentGroups.length > 1 ? "lg:grid-cols-2" : ""
        }`}
      >
        {shipmentGroups.map(([supplierId, items], idx) => (
          <div key={`${supplierId}-${idx}`} className="min-w-0">
            <div className="mb-2 flex items-start justify-between gap-2 px-0.5">
              <span className="text-sm font-bold text-gray-900">
                Shipment {idx + 1}/{n}
              </span>
              <span className="max-w-[58%] text-right text-xs leading-snug text-gray-500 lg:max-w-[50%]">
                Fulfilled by{" "}
                <span className="font-semibold text-gray-700">
                  {supplierId
                    ? `Partner seller #${supplierId}`
                    : "440 Global Shopping"}
                </span>
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-start gap-2 border-b border-gray-100 px-4 py-3">
                <RiTruckLine
                  className="mt-0.5 shrink-0 text-lg text-(--primary)"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">Door delivery</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Delivery is scheduled after payment confirmation. You will
                    receive updates on dispatch and tracking.
                  </p>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 px-4 py-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded bg-gray-600/95 px-1 py-0.5 text-center text-[10px] font-bold leading-none text-white">
                        ×{lineUnits(item)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
                        {item.name}
                      </p>
                      <p className="mt-1.5 text-sm font-bold tabular-nums text-gray-900">
                        ₦{" "}
                        {(item.price * item.quantity * item.slots).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 pt-3 text-center">
        <Link
          href="/cart"
          className="text-sm font-semibold text-(--primary) hover:underline"
        >
          Modify cart
        </Link>
      </div>
    </>
  );
}

const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [upfrontPercent, setUpfrontPercent] = useState(50);
  const [usePaySmallSmall, setUsePaySmallSmall] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  // Wallet payment state
  type PaymentMethod = "WALLET" | "CARD";
  type PendingFlow = "BALE" | "DIRECT_FULL" | "DIRECT_PSS" | null;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("WALLET");
  const [pinOpen, setPinOpen] = useState(false);
  const [insufficientOpen, setInsufficientOpen] = useState(false);
  const [pendingFlow, setPendingFlow] = useState<PendingFlow>(null);
  const [pendingPercent, setPendingPercent] = useState(50);

  const { data: user, isPending: isUserPending, error } = useGetUserProfile();
  const { data: walletData, isPending: isWalletPending } = useGetWalletBalance(user?.id);
  const { mutateAsync: postDelivery, isPending: isDeliveryLoading } = useDeliveryMutation();

  // Slot Payment
  const { mutateAsync: createSlot, isPending: isSlotPending } = useCreateBaleSlot();
  const { mutateAsync: initiatePayment, isPending: isInitiatePending } = useInitiatePayment();

  const { mutateAsync: orderDirect, isPending: isDirectPending } = useDirectOrder();

  const confirmPayment = useConfirmPayment();

  const { data: deliveries = [], isPending: isDeliveriesLoading } = useGetDeliveries();
  
  const { cart, clearCart } = useCart();
  const { buyCart, clearBuyCart } = useBuy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const directOrder = searchParams.get("direct_order");
  const addressChangeHref =
    directOrder === "true"
      ? "/checkout/address?direct_order=true"
      : "/checkout/address";

  useEffect(() => {
    if (deliveries.length === 0) return;

    const storedId = getStoredCheckoutDeliveryId();
    const fromStorage =
      storedId != null
        ? deliveries.find((d: DeliveryPayload) => d.id === storedId)
        : undefined;

    const fallback =
      deliveries.find((d: DeliveryPayload) => d.setDefault) || deliveries[0];

    setSelectedDelivery(fromStorage ?? fallback);
  }, [deliveries]);

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryPayload>({
    id: 0,
    firstName: "",
    LastName: "",
    countryCode: "",
    phone: "",
    additionalCountryCode: "",
    additionalPhone: "",
    address: "",
    additionalInfo: "",
    region: "",
    city: "",
    state: "",
    setDefault: false
  });

  const [formData, setFormData] = useState({
    firstName: '',
    LastName: '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    countryCode: '+234',
    additionalPhone: '',
    additionalCountryCode: '+234',
    address: '',
    additionalInfo: '',
    city: '',
    state: '',
    region: '',
  });

  let cartItems: CartItem[];

  if (directOrder === "true") {
    cartItems = buyCart;
  } else {
    cartItems = cart;
  }

  /** One “shipment” per supplier (mobile Jumia-style cards) */
  const shipmentGroups = useMemo(() => {
    const map = new Map<number, CartItem[]>();
    for (const item of cartItems) {
      const sid = Number(item.supplierId) || 0;
      const list = map.get(sid) ?? [];
      list.push(item);
      map.set(sid, list);
    }
    return Array.from(map.entries()) as ShipmentGroupEntry[];
  }, [cartItems]);

  const deliveryDateRangeLabel = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() + 3);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    return `Delivery between ${fmt(start)} and ${fmt(end)}.`;
  }, []);

  const min = 50;
  const max = 80;
  const step = 10;

  const marks = Array.from(
    { length: (max - min) / step + 1 },
    (_, i) => min + i * step
  );

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  };

  const subtotal = calculateTotal();
  const upfrontAmount = Math.round((upfrontPercent / 100) * subtotal);

  const shipping = () =>
    cartItems.reduce((sum, item) => sum + item.totalShippingFee, 0);
  
  const tax = subtotal * 0.075
  const shippingFee = shipping();
  const total = subtotal + shippingFee + tax

  useEffect(() => {
    console.log(subtotal.toLocaleString("en-US", { maximumFractionDigits: 0 }))
    console.log(JSON.stringify(cartItems))
  }, [cartItems]);

  const placeOrder = async (walletPin?: string) => {
    if (!user || !cartItems) return;
    let deliveryId: number | null = null;

    try {
      // Use selected address
      if ( deliveries.length > 0) {
        if (!selectedDelivery?.id) {
          toast.error("Please select a delivery address");
          return;
        }

        deliveryId = selectedDelivery.id;
      }

      if(deliveries.length === 0) {
        const deliveryData = {
          firstName: formData.firstName,
          LastName: formData.LastName,
          countryCode: formData.countryCode,
          phone: formData.phone,
          additionalCountryCode: formData.additionalCountryCode,
          additionalPhone: formData.additionalPhone,
          address: formData.address,
          additionalInfo: formData.additionalInfo,
          region: formData.region,
          city: formData.city,
          state: formData.state,
          setDefault: true,
          merchantId: user.id
        }

        const res = await postDelivery(deliveryData);
        if (res.status !== 200 && res.status !== 201) {
          toast.error("Failed to create delivery address");
          return;
        }

        deliveryId = res.data.data.id;
      }

      if (!deliveryId) {
        toast.error("No delivery address available");
        return;
      }

      const slotData: BaleSlot = {
        deliveryAddressId: deliveryId,
        bales: cartItems.map((item: any) => {
          // No variants (no sizes/colors)
          if (!item.items || item.items.length === 0) {
            return {
              baleId: item.baleId,
              slotQuantity: item.slots,
              items: [
                {
                  productId: item.productId,
                  quantity: item.quantity
                }
              ]
            };
          }

          // Has sizes/colors
          const groupedByColor = item.items.reduce(
            (
              acc: Record<
                number,
                {
                  colorId: number;
                  productId: number;
                  productSizes: SizeItem[];
                  quantity?: number;
                }
              >,
              current: any
            ) => {
              const colorId = current.color?.id;

              if (!acc[colorId]) {
                acc[colorId] = {
                  colorId,
                  productId: item.productId,
                  productSizes: [],
                  quantity: 0
                };
              }

              acc[colorId].productSizes.push({
                sizeId: current.size?.id,
                quantity: current.quantity
              });

              // Optional: keep total quantity per color
              acc[colorId].quantity! += current.quantity;

              return acc;
            },
            {}
          );

          return {
            baleId: item.baleId,
            slotQuantity: item.slots,
            items: Object.values(groupedByColor)
          };
        })
      };

      const createRes = await createSlot(slotData);
      if (createRes.status === 200 || createRes.status === 201) {
        const checkoutId = parseCheckoutIntentCheckoutId(createRes.data);

        if (checkoutId == null) {
          toast.error("Checkout was created but no checkout id was returned.");
          return;
        }

        const initiateData = buildBaleLockInitiateBody(checkoutId, paymentMethod, walletPin);

        const data = {
          body: initiateData,
          idempotencyKey: crypto.randomUUID()
        }

        const initiateRes = await initiatePayment(data);

        if (initiateRes.status === 200 || initiateRes.status === 201) {
          if (paymentMethod === "WALLET") {
            toast.success("Payment successful");
            clearCart();
            router.push('/account/orders/ongoing');
          } else {
            const accessCode = initiateRes?.data?.data?.accessCode;
            if (!accessCode) {
              toast.error("Payment could not be started: missing access code.");
              return;
            }
            await openPaystackPopup(
              accessCode,
              async ({ reference }) => {
                await confirmPayment.mutateAsync(reference);
                toast.success("Payment successful");
                clearCart();
                router.push('/account/orders/ongoing');
              },
              () => {
                toast.error("Payment cancelled");
              }
            );
          }
        } else {
          toast.error(`Failed to initiate payment`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        toast.error(`Something went wrong with creating slot`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message ??
        err.message ??
        "Something went wrong, please try again", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const makePayment = async (selectedPercent = upfrontPercent, walletPin?: string) => {
    if (!user || !cartItems) return;
    let deliveryId: number | null = null;

    setIsPaymentOpen(false);

    try {
      // Use selected address
      if (deliveries.length > 0) {
        if (!selectedDelivery?.id) {
          toast.error("Please select a delivery address");
          return;
        }

        deliveryId = selectedDelivery.id;
      }

      if (deliveries.length === 0) {
        const deliveryData = {
          firstName: formData.firstName,
          LastName: formData.LastName,
          countryCode: formData.countryCode,
          phone: formData.phone,
          additionalCountryCode: formData.additionalCountryCode,
          additionalPhone: formData.additionalPhone,
          address: formData.address,
          additionalInfo: formData.additionalInfo,
          region: formData.region,
          city: formData.city,
          state: formData.state,
          setDefault: true,
          merchantId: user.id
        }

        const res = await postDelivery(deliveryData);
        if (res.status !== 200 && res.status !== 201) {
          toast.error("Failed to create delivery address");
          return;
        }

        deliveryId = res.data.data.id;
      }

      if (!deliveryId) {
        toast.error("No delivery address available");
        return;
      }

      const payloadItems = cartItems.flatMap(cartItem => {
        if (cartItem.items?.length > 0) {
          return cartItem.items.map((item: any) => ({
            productId: cartItem.productId,
            colorId: item.color?.id ?? null,
            sizeId: item.size?.id ?? null,
            quantity: Number(item.quantity),
          }));
        }

        return [{
          productId: cartItem.productId,
          colorId: null,
          sizeId: null,
          quantity: Number(cartItem.quantity),
        }];
      });

      const directOrderPay: DirectOrderPayload = {
        items: payloadItems, // pass the array directly
        paymentOption: selectedPercent < 100 ? "split" : "full",
        upfrontPercent: selectedPercent,
        deliveryAddressId: deliveryId,
      };

      const directRes = await orderDirect(directOrderPay);

      if (directRes.status === 200 || directRes.status === 201) {
        const orderId = parseDirectOrderOrderId(directRes.data);

        if (orderId == null) {
          toast.error("Order was created but no order id was returned.");
          return;
        }

        const initiatePayload = buildDirectUpfrontInitiateBody(orderId, paymentMethod, walletPin);

        const data = {
          body: initiatePayload,
          idempotencyKey: crypto.randomUUID()
        }

        const initiateRes = await initiatePayment(data);

        if (initiateRes.status === 200 || initiateRes.status === 201) {
          if (paymentMethod === "WALLET") {
            toast.success("Payment successful");
            clearBuyCart();
            router.push('/account/orders/ongoing');
          } else {
            const accessCode = initiateRes?.data?.data?.accessCode;
            if (!accessCode) {
              toast.error("Payment could not be started: missing access code.");
              return;
            }
            await openPaystackPopup(
              accessCode,
              async ({ reference }) => {
                await confirmPayment.mutateAsync(reference);
                toast.success("Payment successful");
                clearBuyCart();
                router.push('/account/orders/ongoing');
              },
              () => {
                toast.error("Payment cancelled");
              }
            );
          }
        } else {
          toast.error(`Failed to initiate payment`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        toast.error(`Failed to initiate order`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err.response?.data?.message ??
        err.message ??
        "Something went wrong, please try again", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const isPlacingOrder =
    isDeliveryLoading ||
    isSlotPending ||
    isInitiatePending ||
    confirmPayment.isPending;

  const isPlacingDirectOrder = 
    isDeliveryLoading ||
    isDirectPending ||
    isInitiatePending ||
    confirmPayment.isPending;

  const walletBalance = walletData?.wallet_balance ?? 0;

  /** Called after PIN is confirmed — dispatches the right payment function */
  const handlePinConfirm = (pin: string) => {
    setPinOpen(false);
    if (pendingFlow === "BALE") void placeOrder(pin);
    else if (pendingFlow === "DIRECT_FULL") void makePayment(100, pin);
    else if (pendingFlow === "DIRECT_PSS") void makePayment(pendingPercent, pin);
  };

  /** Switch to card and retry the appropriate flow immediately */
  const handlePayWithCard = () => {
    setInsufficientOpen(false);
    setPaymentMethod("CARD");
    if (directOrder !== "true") {
      void placeOrder();
    } else if (usePaySmallSmall) {
      setIsPaymentOpen(true);
    } else {
      void makePayment(100);
    }
  };

  const handleConfirmOrder = () => {
    if (directOrder !== "true") {
      // BALE flow
      if (paymentMethod === "WALLET") {
        if (walletBalance < total) { setInsufficientOpen(true); return; }
        setPendingFlow("BALE");
        setPinOpen(true);
      } else {
        void placeOrder();
      }
      return;
    }

    if (usePaySmallSmall) {
      // PSS — show slider first; balance check happens inside slider modal
      setIsPaymentOpen(true);
      return;
    }

    // DIRECT full
    if (paymentMethod === "WALLET") {
      if (walletBalance < total) { setInsufficientOpen(true); return; }
      setPendingFlow("DIRECT_FULL");
      setPinOpen(true);
    } else {
      void makePayment(100);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-gray-50 pb-28 pt-[max(0.75rem,env(safe-area-inset-top,0px))] max-lg:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:pt-4 lg:pb-20 lg:pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8">
            <div className="lg:hidden">
              <Link
                href="/cart"
                aria-label="Back to cart"
                className="relative z-10 mb-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-white bg-(--primary) p-2.5 text-[#FFFFFF] shadow-sm transition-colors hover:bg-white hover:text-(--primary)"
              >
                <RiArrowLeftLine className="text-lg" aria-hidden />
              </Link>
              <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
                Place your order
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                By proceeding, you are automatically accepting the{" "}
                <Link
                  href="/products"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>

            <div className="mb-2 hidden items-center justify-between gap-4 border-b border-gray-200 pb-5 lg:flex">
              <Link href="/" className="shrink-0">
                <img
                  src="/images/440_Logo.png"
                  alt="440 Global Shopping"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <p className="flex-1 text-center text-base font-semibold text-gray-900">
                Place your order
              </p>
              <div className="flex max-w-[11rem] shrink-0 flex-col items-end gap-1.5 text-right text-[11px] leading-tight text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <RiQuestionLine className="shrink-0 text-(--primary)" />
                  Need help? Contact us
                </span>
                <span className="inline-flex items-center gap-1">
                  <RiRefund2Line className="shrink-0 text-(--primary)" />
                  Easy returns
                </span>
                <span className="inline-flex items-center gap-1">
                  <RiShieldCheckLine className="shrink-0 text-green-600" />
                  Secure payments
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-8">
            <div className="order-2 w-full min-w-0 lg:order-1 lg:max-w-[calc(100%-26rem)] lg:flex-1">
              {
                deliveries.length <= 0 ? 
                  <div className="space-y-6">
                    {
                      isDeliveriesLoading ?
                      <div className="rounded-lg bg-white border border-gray-200 flex justify-center items-center w-full h-100 mb-5">
                        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
                      </div> : 
                        <div className="rounded-md bg-white border border-gray-100 p-5 sm:p-6">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <RiTruckLine className="text-blue-600 text-lg" />
                            </div>
                            <h2 className="text-lg font-medium text-gray-900">
                              Shipping Information
                            </h2>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  First Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="John"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  Last Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input
                                    type="text"
                                    name="LastName"
                                    value={formData.LastName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Doe"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="john.doe@example.com"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex gap-2">
                                  <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleInputChange}
                                    className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  >
                                    <option value="+234">+234</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                  </select>
                                  <div className="relative flex-1">
                                    <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                      type="tel"
                                      name="phone"
                                      value={formData.phone}
                                      onChange={handleInputChange}
                                      required
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      placeholder="8102637956"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  Additional Phone (Optional)
                                </label>
                                <div className="relative flex gap-2">
                                  <select
                                    name="additionalCountryCode"
                                    value={formData.additionalCountryCode}
                                    onChange={handleInputChange}
                                    className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  >
                                    <option value="+234">+234</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                  </select>
                                  <div className="relative flex-1">
                                    <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                      type="tel"
                                      name="additionalPhone"
                                      value={formData.additionalPhone}
                                      onChange={handleInputChange}
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                      placeholder="9063786452"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-normal text-gray-700 mb-2">
                                Street Address <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <RiMapPinLine className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  name="address"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="123 Main Street, Apartment 4B"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-normal text-gray-700 mb-2">
                                Additional Information (Optional)
                              </label>
                              <input
                                type="text"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                placeholder="Landmark, special instructions, etc."
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  City <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Lagos"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  State <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Lagos"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-normal text-gray-700 mb-2">
                                  Region <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="region"
                                  value={formData.region}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Gbagada"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                    }
                    
                  </div> :
                  <>
                    {/* Desktop: Jumia-style steps */}
                    <div className="hidden flex-col gap-4 lg:flex">
                      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <RiCheckLine size={14} aria-hidden />
                            </span>
                            <h2 className="text-xs font-bold tracking-wide text-gray-900 sm:text-sm">
                              1. CUSTOMER ADDRESS
                            </h2>
                          </div>
                          <Link
                            href={addressChangeHref}
                            className="shrink-0 text-sm font-semibold text-blue-600 hover:underline"
                          >
                            Change &gt;
                          </Link>
                        </div>
                        <div className="px-4 py-4 text-sm text-gray-700">
                          {isDeliveriesLoading || !selectedDelivery?.id ? (
                            <div className="flex justify-center py-6">
                              <RiLoader5Line
                                size={32}
                                className="animate-spin text-(--primary)"
                              />
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-900">
                                {selectedDelivery.firstName}{" "}
                                {selectedDelivery.LastName}
                              </p>
                              <p className="mt-2 leading-relaxed text-gray-600">
                                {selectedDelivery.address} | {selectedDelivery.city}{" "}
                                — {selectedDelivery.region} |{" "}
                                {selectedDelivery.countryCode}{" "}
                                {selectedDelivery.phone}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {selectedDelivery.setDefault && (
                                  <Badge variant="secondary" className="font-bold">
                                    Default address
                                  </Badge>
                                )}
                                {/* <Button
                                  type="button"
                                  className="px-4 py-2 text-xs"
                                  primary
                                  onClick={() => setIsModalOpen(true)}
                                >
                                  Add new address
                                </Button> */}
                              </div>
                            </>
                          )}
                        </div>
                      </section>

                      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <RiCheckLine size={14} aria-hidden />
                            </span>
                            <h2 className="text-xs font-bold tracking-wide text-gray-900 sm:text-sm">
                              2. DELIVERY DETAILS
                            </h2>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-semibold text-blue-600 hover:underline"
                            onClick={() =>
                              toast.info("Delivery options will be available soon.")
                            }
                          >
                            Change &gt;
                          </button>
                        </div>
                        <div className="border-b border-gray-100 px-4 py-4 text-sm text-gray-700">
                          <p className="text-base font-bold text-gray-900">
                            Door Delivery
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {deliveryDateRangeLabel}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                            <span className="font-medium">
                              Pick up from a station to save on delivery fees.
                            </span>
                            <button
                              type="button"
                              className="shrink-0 font-semibold text-blue-600 hover:underline"
                              onClick={() =>
                                toast.info("Pickup stations coming soon.")
                              }
                            >
                              Change &gt;
                            </button>
                          </div>
                        </div>
                        <CheckoutShipmentCards
                          cartItems={cartItems}
                          shipmentGroups={shipmentGroups}
                        />
                      </section>

                      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <RiCheckLine size={14} aria-hidden />
                          </span>
                          <h2 className="text-xs font-bold tracking-wide text-gray-900 sm:text-sm">
                            3. PAYMENT METHOD
                          </h2>
                        </div>
                        <div className="space-y-2.5 px-4 py-4">
                          {/* Wallet option */}
                          <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${paymentMethod === "WALLET" ? "border-(--primary) bg-(--primary-soft)/10 ring-1 ring-(--primary)" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="payment-method-desktop" value="WALLET" checked={paymentMethod === "WALLET"} onChange={() => setPaymentMethod("WALLET")} className="sr-only" />
                            <RiWallet3Line className="shrink-0 text-xl text-blue-600" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900">440 Wallet</p>
                              <p className="mt-0.5 text-xs text-gray-500">
                                Balance:{" "}
                                {isWalletPending ? (
                                  <span className="text-gray-400">Loading…</span>
                                ) : walletData?.wallet_balance != null ? (
                                  <span className={`font-medium ${walletData.wallet_balance < total ? "text-red-600" : "text-green-600"}`}>
                                    ₦ {walletData.wallet_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </p>
                            </div>
                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${paymentMethod === "WALLET" ? "border-(--primary)" : "border-gray-300"}`}>
                              {paymentMethod === "WALLET" && <span className="h-2 w-2 rounded-full bg-(--primary)" />}
                            </span>
                          </label>
                          {/* Card option */}
                          <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${paymentMethod === "CARD" ? "border-(--primary) bg-(--primary-soft)/10 ring-1 ring-(--primary)" : "border-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name="payment-method-desktop" value="CARD" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")} className="sr-only" />
                            <RiBankCardLine className="shrink-0 text-xl text-gray-600" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900">Pay with Card</p>
                              <p className="mt-0.5 text-xs text-gray-500">Paystack — Visa, Mastercard, Verve</p>
                            </div>
                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${paymentMethod === "CARD" ? "border-(--primary)" : "border-gray-300"}`}>
                              {paymentMethod === "CARD" && <span className="h-2 w-2 rounded-full bg-(--primary)" />}
                            </span>
                          </label>
                        </div>
                      </section>
                    </div>

                    <div className="flex flex-col gap-4 lg:hidden">
                    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <RiCheckLine size={14} aria-hidden />
                        </span>
                        <h2 className="text-xs font-bold tracking-wide text-gray-900">
                          PAYMENT METHOD
                        </h2>
                      </div>
                      <div className="space-y-2.5 px-4 py-4">
                        {/* Wallet option */}
                        <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${paymentMethod === "WALLET" ? "border-(--primary) bg-(--primary-soft)/10 ring-1 ring-(--primary)" : "border-gray-200 hover:border-gray-300"}`}>
                          <input type="radio" name="payment-method-mobile" value="WALLET" checked={paymentMethod === "WALLET"} onChange={() => setPaymentMethod("WALLET")} className="sr-only" />
                          <RiWallet3Line className="shrink-0 text-xl text-blue-600" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">440 Wallet</p>
                            <p className="mt-0.5 text-xs text-gray-500">
                              Balance:{" "}
                              {isWalletPending ? (
                                <span className="text-gray-400">Loading…</span>
                              ) : walletData?.wallet_balance != null ? (
                                <span className={`font-medium ${walletData.wallet_balance < total ? "text-red-600" : "text-green-600"}`}>
                                  ₦ {walletData.wallet_balance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </p>
                          </div>
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${paymentMethod === "WALLET" ? "border-(--primary)" : "border-gray-300"}`}>
                            {paymentMethod === "WALLET" && <span className="h-2 w-2 rounded-full bg-(--primary)" />}
                          </span>
                        </label>
                        {/* Card option */}
                        <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${paymentMethod === "CARD" ? "border-(--primary) bg-(--primary-soft)/10 ring-1 ring-(--primary)" : "border-gray-200 hover:border-gray-300"}`}>
                          <input type="radio" name="payment-method-mobile" value="CARD" checked={paymentMethod === "CARD"} onChange={() => setPaymentMethod("CARD")} className="sr-only" />
                          <RiBankCardLine className="shrink-0 text-xl text-gray-600" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">Pay with Card</p>
                            <p className="mt-0.5 text-xs text-gray-500">Paystack — Visa, Mastercard, Verve</p>
                          </div>
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${paymentMethod === "CARD" ? "border-(--primary)" : "border-gray-300"}`}>
                            {paymentMethod === "CARD" && <span className="h-2 w-2 rounded-full bg-(--primary)" />}
                          </span>
                        </label>
                      </div>
                    </section>

                    {/* Mobile: single address card + change */}
                    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                          Customer address
                        </h3>
                        <Link
                          href={addressChangeHref}
                          className="text-sm font-semibold text-(--primary) hover:underline"
                        >
                          Change
                        </Link>
                      </div>
                      <div className="px-4 py-4 text-sm text-gray-700">
                        {isDeliveriesLoading || !selectedDelivery?.id ? (
                          <div className="flex justify-center py-6">
                            <RiLoader5Line
                              size={32}
                              className="animate-spin text-(--primary)"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="font-semibold text-gray-900">
                              {selectedDelivery.firstName}{" "}
                              {selectedDelivery.LastName}
                            </p>
                            <p className="mt-2 leading-relaxed text-gray-600">
                              {selectedDelivery.address} | {selectedDelivery.city}{" "}
                              — {selectedDelivery.region} |{" "}
                              {selectedDelivery.countryCode}{" "}
                              {selectedDelivery.phone}
                            </p>
                            {selectedDelivery.setDefault && (
                              <Badge
                                variant="secondary"
                                className="mt-2 font-bold"
                              >
                                Default address
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      {/* <div className="border-t border-gray-100 px-4 py-3">
                        <Button
                          primary
                          type="button"
                          className="w-full sm:w-auto"
                          onClick={() => setIsModalOpen(true)}
                        >
                          Add new address
                        </Button>
                      </div> */}
                    </div>

                    <div className="space-y-4">
                      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <RiCheckLine size={14} aria-hidden />
                            </span>
                            <h2 className="text-xs font-bold tracking-wide text-gray-900">
                              2. DELIVERY DETAILS
                            </h2>
                          </div>
                          <button
                            type="button"
                            className="text-sm font-semibold text-(--primary) hover:underline"
                            onClick={() =>
                              toast.info("Delivery options will be available soon.")
                            }
                          >
                            Change &gt;
                          </button>
                        </div>
                        <div className="border-b border-gray-100 px-4 py-4 text-sm text-gray-700">
                          <p className="text-base font-bold text-gray-900">
                            Door Delivery
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {deliveryDateRangeLabel}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                            <span className="font-medium">
                              Pick up from a station to save on delivery fees.
                            </span>
                            <button
                              type="button"
                              className="shrink-0 font-semibold text-blue-600 hover:underline"
                              onClick={() =>
                                toast.info("Pickup stations coming soon.")
                              }
                            >
                              Change &gt;
                            </button>
                          </div>
                        </div>
                        <CheckoutShipmentCards
                          cartItems={cartItems}
                          shipmentGroups={shipmentGroups}
                        />
                      </section>
                    </div>
                    </div>
                  </>
              }
              
            </div>

            <div className="order-1 flex w-full flex-col lg:order-2 lg:w-96 lg:shrink-0">
              <div className="h-fit space-y-4 lg:sticky lg:top-24">

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
                  <div className="-mx-5 -mt-5 mb-4 border-b border-gray-200 bg-[#F2F2F2] px-4 py-2.5 sm:-mx-6 sm:-mt-6 lg:hidden">
                    <p className="text-[11px] font-bold tracking-wide text-gray-700">
                      ORDER SUMMARY
                    </p>
                  </div>
                  <h2 className="mb-4 hidden text-lg font-medium text-gray-900 lg:block">
                    Order summary
                  </h2>

                  <div className="space-y-3 border-b border-gray-200 pb-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-gray-600">
                        Item&apos;s total ({cartItems.length})
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ₦ {subtotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-gray-600">
                        Delivery fees
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ₦ {shippingFee.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-gray-600">
                        Tax (7.5%)
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ₦ {tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="py-5">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-gray-900">
                        Total
                      </p>
                      <p className="text-2xl font-medium text-gray-900">
                        ₦ {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {directOrder === "true" && (
                    <div className="mb-4 lg:mb-2 lg:mt-3">
                      <label
                        className={`flex cursor-pointer items-center gap-2.5 rounded-lg border bg-white px-3 py-2.5 transition lg:gap-3 lg:px-4 lg:py-3 ${
                          usePaySmallSmall
                            ? "border-(--primary) shadow-sm ring-1 ring-(--primary) lg:bg-(--primary-soft)/50"
                            : "border-gray-300 hover:border-gray-400 lg:border-amber-200 lg:bg-amber-50/50 lg:hover:border-amber-300"
                        }`}
                      >
                        <RiBankCardLine
                          className="shrink-0 text-lg text-(--primary)/80 lg:text-xl"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 lg:font-semibold">
                            Buy now, pay later
                          </p>
                          <p className="text-xs text-gray-500 lg:text-sm lg:text-gray-600">
                            Pay Small Small — from 50% today
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={usePaySmallSmall}
                          onChange={(e) =>
                            setUsePaySmallSmall(e.target.checked)
                          }
                          className="h-4 w-4 shrink-0 accent-(--primary) lg:h-[1.125rem] lg:w-[1.125rem]"
                          aria-label="Buy now, pay later"
                        />
                      </label>
                    </div>
                  )}
                  <Button
                    primary
                    onClick={handleConfirmOrder}
                    isLoading={directOrder ? isPlacingDirectOrder : isPlacingOrder}
                    className="hidden w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-normal transition-colors disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                  >
                    {isPlacingOrder || isPlacingDirectOrder
                      ? "Confirming…"
                      : "Confirm order"}
                  </Button>
                  <p className="mt-3 hidden text-center text-[11px] leading-relaxed text-gray-500 lg:block">
                    By proceeding, you are accepting the applicable terms for
                    checkout and delivery.
                  </p>

                  <div className="mt-5 space-y-3 pt-5 border-t border-gray-200">
                    <div className="flex gap-3 items-start">
                      <RiShieldCheckLine className='text-green-600 text-lg shrink-0 mt-0.5' />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Secure checkout with SSL encryption
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <RiSecurePaymentLine className='text-blue-600 text-lg shrink-0 mt-0.5' />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your payment information is safe
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden">
        <Button
          primary
          onClick={handleConfirmOrder}
          isLoading={directOrder ? isPlacingDirectOrder : isPlacingOrder}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPlacingOrder || isPlacingDirectOrder
            ? "Confirming…"
            : "Confirm order"}
        </Button>
      </div>

      {
        isModalOpen &&
        <MyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <DeliveryForm setIsModalOpen={setIsModalOpen} />
        </MyModal>
      }

      {/* Wallet PIN Modal */}
      <WalletPinModal
        open={pinOpen}
        amount={`₦ ${(
          pendingFlow === "DIRECT_PSS"
            ? Math.round((pendingPercent / 100) * subtotal)
            : total
        ).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        isLoading={isPlacingOrder || isPlacingDirectOrder}
        onConfirm={handlePinConfirm}
        onClose={() => setPinOpen(false)}
      />

      {/* Insufficient Wallet Balance Modal */}
      {insufficientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <RiErrorWarningLine className="shrink-0 text-xl text-amber-500" />
                <h3 className="text-base font-bold text-gray-900">Insufficient balance</h3>
              </div>
              <button
                type="button"
                onClick={() => setInsufficientOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
              >
                <RiCloseLine className="text-xl" />
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                Your 440 wallet balance{" "}
                <span className="font-semibold text-gray-900">
                  (₦ {walletBalance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </span>{" "}
                is not enough to cover this payment. You can top up your wallet or pay with card instead.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setInsufficientOpen(false);
                    toast.info("Wallet top-up coming soon.");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-(--primary) py-3 text-sm font-semibold text-(--primary) hover:bg-(--primary-soft)/20 transition"
                >
                  <RiWallet3Line className="text-lg" />
                  Top up wallet
                </button>
                <button
                  type="button"
                  onClick={handlePayWithCard}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-(--primary) py-3 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  <RiBankCardLine className="text-lg" />
                  Pay with card instead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {
        isPaymentOpen &&
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-(--bg-surface) rounded-xl p-6 w-[90%] max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Continue with your purchase
              </h3>
              <button
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => setIsPaymentOpen(false)}
              >
                <RiCloseLine size={24} />
              </button>
            </div>
            {
              upfrontPercent < 100 ?
                <p className="mt-2 text-sm">
                   Pay <span className='font-bold text-(--primary)'>₦{upfrontAmount.toLocaleString()}</span> now and pay the remaining within the next 2 months
                </p> :
                <p className="mt-2 text-sm">
                  You are paying <span className='font-bold text-(--primary)'>₦{upfrontAmount.toLocaleString()}</span> in full without any other payments
                </p>
            }
            

            <div className="w-full max-w-md mt-4 mb-8">
              <Slider.Root
                className="relative flex items-center w-full"
                min={min}
                max={max}
                step={step}
                value={[upfrontPercent]}
                onValueChange={(v) => setUpfrontPercent(v[0])}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-(--primary) h-full rounded-full" />
                </Slider.Track>

                <Slider.Thumb className="block w-4 h-4 bg-(--primary) rounded-full" />
              </Slider.Root>

              {/* Marker labels */}
              <div className="relative w-[95%] left-[2.5%] mt-1">
                {marks.map((mark) => {
                  const percent = ((mark - min) / (max - min)) * 100;

                  return (
                    <span
                      key={mark}
                      style={{
                        position: "absolute",
                        left: `${percent}%`,
                        transform: "translateX(-50%)",
                      }}
                      className="text-[10px] text-(--text-muted)"
                    >
                      ₦{Math.round((mark / 100) * subtotal).toLocaleString()}
                    </span>
                  );
                })}
              </div>
            </div>

            <Button
              primary
              className="flex-1 ml-auto"
              onClick={() => {
                if (paymentMethod === "WALLET") {
                  const needed = upfrontAmount;
                  if (walletBalance < needed) {
                    setIsPaymentOpen(false);
                    setInsufficientOpen(true);
                  } else {
                    setIsPaymentOpen(false);
                    setPendingFlow("DIRECT_PSS");
                    setPendingPercent(upfrontPercent);
                    setPinOpen(true);
                  }
                } else {
                  void makePayment();
                }
              }}
            >
              Confirm order
            </Button>
          </div>
        </div>
      }
    </>
    
  )
}

export default Checkout