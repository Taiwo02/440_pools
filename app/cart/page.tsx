"use client"
import { Button, Card } from "@/components/ui";
import Link from 'next/link'
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

import {
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
  RiSecurePaymentLine,
  RiRefund2Line,
  RiPercentLine,
  RiLoader4Fill,
  RiShoppingCart2Line,
  RiStarFill,
  RiLoader5Fill,
} from "react-icons/ri";
import RecentlyViewed from "@/components/cart/RecentlyViewed";
import { getCrossSubdomainCookie } from '@/lib/utils';
import { useBuy } from '@/hooks/use-buy';
import { useGetCart } from "@/api/cart";

const Cart = () => {
  const router = useRouter();

  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({})
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { buyCart, removeFromBuyCart, clearBuyCart, hasSynced } = useBuy();
  const { data: cartData, isPending: isCartPending, error: cartError } = useGetCart();

  const cartItems = buyCart;
  console.log(cartItems);

  const isEmpty = cartItems.length < 1;
  const showLoading = isCartPending && !hasSynced;

  const handleCheckOut = async () => {
    const accessToken = getCrossSubdomainCookie('440_token');

    if (!accessToken) {
      localStorage.setItem('redirectAfterLogin', '/checkout');

      toast.warning(`Authentication required`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      router.push('/account');
    } else {
      setIsCheckoutLoading(true);

      setTimeout(() => {
        router.push('/checkout?direct_order=true');
      }, 1000)
    }
  };
  
  const subtotal = cartData?.data?.subtotal || 0;
  // const totalSaved = calculateTotalSaved();
  const bulkSavings = subtotal > 0 ? 225.50 : 0;
  const shipping = cartData?.data?.totalShippingFee || 0;
  const total = subtotal - bulkSavings + shipping;

  return (
    <>
      <section className="pt-16 md:pt-24 mb-10 md:mb-16">
        <div className="px-4 md:px-10 lg:px-20">
          <div className="flex justify-between items-end pt-10 md:pt-0">
            <div>
              <h1 className="text-2xl md:text-4xl">Shopping Cart</h1>
              {cartItems.length > 0 && (
                <p className="text-(--primary)/80">
                  {cartItems.length} product(s)
                </p>
              )}
            </div>
            {cartItems.length > 0 && (
              <Button
                className="bg-(--error)! hover:bg-(--error)/50!"
                onClick={clearBuyCart}
              >
                <RiDeleteBinLine />
                Clear Cart
              </Button>
            )}
          </div>
          <div
            className={`my-4 flex flex-col gap-6 ${
              isEmpty ? "" : "lg:flex-row lg:items-start lg:gap-6"
            }`}
          >
            <div
              className={`flex flex-col gap-4 ${
                isEmpty ? "w-full" : "w-full lg:flex-1"
              }`}
            >
              <div className={isEmpty ? "" : "mb-4"}>
                {
                  isCartPending ? (
                    <div className="mx-auto w-full max-w-lg">
                      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm md:px-10 md:py-14 h-60 flex flex-col items-center justify-center">
                        <RiLoader5Fill size={100} className="text-(--primary) animate-spin mb-4" />
                        <p className="text-gray-900 font-medium mt-2 text-lg">Loading cart...</p>
                      </div>
                    </div>
                  ) :
                  isEmpty ? (
                    <div className="mx-auto w-full max-w-lg">
                      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm md:px-10 md:py-14">
                        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 md:h-24 md:w-24">
                          <RiShoppingCart2Line
                            className="text-4xl text-(--primary) md:text-[2.75rem]"
                            aria-hidden
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                            <RiStarFill
                              className="text-base text-amber-500"
                              aria-hidden
                            />
                          </span>
                        </div>
                        <h2 className="mt-6 text-xl font-bold text-gray-900 md:text-2xl">
                          Your cart is empty!
                        </h2>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 md:text-base">
                          Browse our categories and discover our best deals!
                        </p>
                        <Link href="/products" className="mt-8 inline-block">
                          <Button
                            primary
                            className="min-w-50 rounded-md px-8 py-3 font-semibold"
                          >
                            Start Shopping
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    cartItems.map((item) => {
                      if (!item?.product) return null;

                      const removeItem = async (id: string) => {
                        removeFromBuyCart(Number(id));
                      };

                      return (
                        <Card
                          key={item.id}
                          className="p-4! shadow-none! mb-3 border-b border-x-0 border-t-0"
                        >
                          <div className="flex justify-between gap-4">
                            <div className="relative w-24 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="object-cover w-full aspect-square rounded-lg"
                              />
                            </div>
                            <div className="flex flex-col md:flex-row flex-1 justify-between gap-1">
                              <div className="md:w-[90%]">
                                <p className="text-sm md:text-lg line-clamp-2">
                                  {item.product.name}
                                </p>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600">
                                  Quantity: {item.quantity}
                                </span>
                              </div>
                              <div className="md:text-end ">
                                <p className="text-xl font-bold">
                                  ₦ {String(item.unit_price).toLocaleString()}
                                </p>
                                {/* <div className="flex shrink-0 items-center gap-2 md:justify-end mb-1">
                                  <p className="text-sm text-gray-400 line-through">
                                    ₦{item.originalPrice.toLocaleString()}
                                  </p>
                                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                    -{item.discount}%
                                  </span>
                                </div> */}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col-reverse md:flex-row justify-between md:items-center mt-2">
                            <div className="flex gap-3 mt-3">
                              <button
                                className="flex items-center cursor-pointer gap-1.5 text-sm font-normal text-orange-600 hover:text-orange-800 hover:bg-orange-100/80 backdrop-blur-sm transition-all px-3 py-1.5 rounded-md"
                                onClick={() => removeItem(String(item.id))}
                              >
                                <RiDeleteBinLine className="text-base" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )
                }
              </div>
              {!isEmpty && (
                <Link href="/products">
                  <Button primary>
                    <RiArrowLeftLine />
                    Continue Shopping
                  </Button>
                </Link>
              )}
            </div>
            {!isEmpty && (
              <div className="flex w-full flex-col lg:w-96 lg:shrink-0">
                <div className="rounded-xl bg-(--bg-surface) p-6 mb-4">
                  <h1 className="text-2xl mb-4">Cart Summary</h1>
                  <div className="pb-4 border-b border-(--border-muted)">
                    <div className="flex items-center justify-between my-4">
                      <p className="text-sm font-normal text-gray-600">
                        Subtotal
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        ₦ {subtotal.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between my-4">
                      <p className="text-sm font-semibold text-emerald-700">
                        Saved
                      </p>
                      <p className="text-base font-semibold text-emerald-700 tabular-nums">
                        {/* ₦ {totalSaved.toLocaleString()} */}
                      </p>
                    </div>

                    <div className="flex items-center justify-between my-4">
                      <p className="text-sm font-normal text-gray-600">
                        Bulk Savings
                      </p>
                      <p className="text-base font-medium text-orange-600">
                        −₦ {bulkSavings.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between my-4">
                      <p className="text-sm font-normal text-gray-600">
                        Shipping
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        ₦ {shipping.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between my-6">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-2xl font-medium text-gray-900">
                      ₦ {total.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleCheckOut}
                    primary
                    disabled={subtotal === 0 || isCheckoutLoading}
                    className="w-full flex gap-2 items-center justify-center py-3 text-sm font-normal rounded-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Checkout (₦ {total.toLocaleString()})
                  </Button>
                  <div className="mt-5 space-y-3 pt-5 border-t border-gray-200">
                    <div className="flex gap-3 items-start">
                      <RiShieldCheckLine className="text-green-600 text-lg shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Trade Assurance protects your orders
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <RiSecurePaymentLine className="text-blue-600 text-lg shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Secure payment methods
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <RiRefund2Line className="text-green-600 text-lg shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Free returns within 30 days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-(--primary-soft)/30 border border-(--primary-soft) p-5 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-(--primary) flex items-center justify-center shrink-0">
                    <RiPercentLine className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 mb-1.5">
                      Bulk Savings Tip
                    </p>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      Add 25% more "Precision Brass Pipe Fittings" to save an
                      additional 3% (₦9.37) on this item.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <RecentlyViewed />
        </div>

        {isCheckoutLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
              <RiLoader4Fill
                size={48}
                className="text-(--primary) animate-spin"
              />
              <p className="text-gray-900 font-medium">
                Proceeding to checkout...
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Cart