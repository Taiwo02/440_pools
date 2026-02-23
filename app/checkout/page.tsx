"use client"

import { useGetUserProfile } from '@/api/auth'
import { useConfirmPayment, useCreateBaleSlot, useDeliveryMutation, useInitiateSlotPayment, useOrderMutation } from '@/api/order'
import { Button, Input } from '@/components/ui'
import { useCart } from '@/hooks/use-cart'
import { openPaystackPopup } from '@/types/funcs'
import { BaleSlot, CartItem, Initiate, SizeItem } from '@/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

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
  RiLoader4Line
} from 'react-icons/ri'
import { toast } from 'react-toastify'

interface ProfileData {
  account_name: string
  address: string
  phone: string
  email: string
}

const Checkout = () => {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // const { data: user, isPending ,error } = useGetUserProfile();
  const { mutateAsync: postDelivery, isPending: isDeliveryLoading } = useDeliveryMutation();
  const { mutateAsync: postOrder, isPending: isOrderLoading } = useOrderMutation();
  const { mutateAsync: createSlot, isPending: isSlotPending } = useCreateBaleSlot();
  const { mutateAsync: initiatePayment, isPending: isInitiatePending } = useInitiateSlotPayment();
  const confirmPayment = useConfirmPayment();
  const { cart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+234',
    additionalPhone: '',
    additionalCountryCode: '+234',
    address: '',
    additionalInfo: '',
    city: '',
    state: '',
    region: '',
    zipCode: '',
    country: 'Nigeria',

    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',

    saveInfo: false,
    setDefault: false,
    sameAsBilling: true
  })

  const [user, setUser] = useState<{ id: number | string; email?: string; phone?: string; address?: string } | null>(null)

  const cartItems: CartItem[] = cart;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const merchantString = localStorage.getItem('merchant');
      setUser(merchantString ? JSON.parse(merchantString) : null);
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const quantity = item.slots;
      return sum + (item.price * quantity * item.quantity);
    }, 0);
  };

  const totalQty = () => {
    return cartItems.reduce((sum, item) => {
      const quantity = item.slots;
      return sum + (quantity * item.quantity);
    }, 0);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  };

  const subtotal = calculateTotal();

  const shipping = () =>
    cartItems.reduce((sum, item) => sum + item.totalShippingFee, 0);
  
  const tax = subtotal * 0.075
  const shippingFee = shipping();
  const total = subtotal + shippingFee + tax

  useEffect(() => {
    console.log(subtotal.toLocaleString("en-US", { maximumFractionDigits: 0 }))
    console.log(JSON.stringify(cartItems))
  }, [cartItems]);

  const placeOrder = async () => {
    if(user && cartItems) {
      const deliveryData = {
        firstName: formData.firstName,
        LastName: formData.lastName,
        countryCode: formData.countryCode,
        phone: formData.phone,
        additionalCountryCode: formData.additionalCountryCode,
        additionalPhone: formData.additionalPhone,
        address: formData.address,
        additionalInfo: formData.additionalInfo,
        region: formData.region,
        city: formData.city,
        state: formData.state,
        setDefault: false,
        merchantId: Number(user.id)
      }

      const res = await postDelivery(deliveryData);
      if (res.status === 200 || res.status === 201) {
        const deliveryId = res.data.data.id;

        const slotData: BaleSlot = {
          deliveryAddressId: deliveryId ?? null,
          bales: cartItems.map((item: any) => {
            const groupedByColor = item.items.reduce((acc: any, current: any) => {
              const colorId = current.color.id;

              if (!acc[colorId]) {
                acc[colorId] = {
                  colorId,
                  productId: item.productId,
                  productSizes: []
                };
              }

              acc[colorId].productSizes.push({
                sizeId: current.size.id,
                quantity: current.quantity
              });

              return acc;
            }, {} as Record<number, {
              colorId: number;
              productId: number;
              productSizes: SizeItem[];
            }>);

            return {
              baleId: item.baleId,
              slotQuantity: item.slots,
              items: Object.values(groupedByColor)
            };
          })
        };

        const createRes = await createSlot(slotData);
        if (createRes.status === 200 || createRes.status === 201) {
          console.log(createRes.data)
          const checkoutId = createRes?.data?.data?.id;

          const initiateData: Initiate = {
            checkoutId,
            type: "lock"
          }

          const initiateRes = await initiatePayment(initiateData);

          if(initiateRes.status === 200 || initiateRes.status === 201) {
            console.log(initiateRes.data);

            const accessCode = initiateRes?.data?.data?.accessCode;

            await openPaystackPopup(
              accessCode,
              async ({ reference }) => {
                await confirmPayment.mutateAsync(reference);
                toast.success("Payment successful");
              },
              () => {
                toast.error("Payment cancelled");
              }
            );
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
        
      } else {
        toast.error(`Something went wrong`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }

  const isPlacingOrder =
    isDeliveryLoading ||
    isSlotPending ||
    isInitiatePending ||
    confirmPayment.isPending;

  return (
    <>
      <section className='min-h-screen pt-20 pb-16 md:pt-24 md:pb-20 bg-gray-50'>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8">
            <Link
              href="/cart"
              className="inline-flex justify-center shadow-sm border-2 border-[#FFFFFF] items-center bg-(--primary) hover:text-(--primary) hover:bg-[#FFFFFF] rounded-full gap-2 p-2 text-sm font-normal text-[#FFFFFF] hover:text-(--primary) transition-colors mb-4"
            >
              <RiArrowLeftLine />
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-medium text-gray-900">
              Checkout
            </h1>
            <p className='text-sm sm:text-base text-gray-500 mt-1'>
              Complete your order
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-4">
            <div className="w-full lg:flex-1">
              <div className="space-y-6">

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
                            name="lastName"
                            value={formData.lastName}
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
                            value={user?.email}
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
                              value={user?.phone}
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
                          value={user?.address}
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
              </div>
            </div>

            <div className="w-full lg:w-96 lg:shrink-0">
              <div className="sticky top-24 space-y-4">

                <div className="rounded-lg bg-white border border-gray-200 p-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-5">
                    {cartItems.map(item => (
                      <div key={item.cartItemId} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 leading-tight line-clamp-1 mb-1">
                            {item.name}
                          </p>
                          <div className="flex flex-col gap-2">
                            {Object.entries(item.variants).map(([key, value]) => (
                              <span key={key} className="text-xs text-gray-500">
                                {key}: {Array.isArray(value) ? value.join(", ") : value}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ₦ {(item.price * item.quantity * item.slots).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pb-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-gray-600">
                        Subtotal
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ₦ {subtotal.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-gray-600">
                        Shipping
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

                  <Button
                    primary
                    onClick={placeOrder}
                    isLoading={isPlacingOrder}
                    className="w-full flex gap-2 items-center justify-center py-3 text-sm font-normal rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Button>

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
        </div>
      </section>
    </>
    
  )
}

export default Checkout