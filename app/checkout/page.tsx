"use client"

import { useGetUserProfile } from '@/api/auth'
import { useDeliveryMutation, useOrderMutation } from '@/api/order'
import { Button, Input } from '@/components/ui'
import { useCart } from '@/hooks/use-cart'
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

  const { data: user, isPending ,error } = useGetUserProfile();
  const { mutateAsync: postDelivery, isPending: isDeliveryLoading } = useDeliveryMutation();
  const { mutateAsync: postOrder, isPending: isOrderLoading } = useOrderMutation();
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

  // const cartItems = [
  //   {
  //     cartItemId: "cart-001",
  //     name: "Advanced Industrial Optical Sensor Module",
  //     image: "https://picsum.photos/seed/sensor-module/300/300",
  //     price: 15000.00,
  //     quantity: 2,
  //     variants: { size: "Standard", color: "Black" }
  //   },
  //   {
  //     cartItemId: "cart-002",
  //     name: "Digital Multimeter High Accuracy",
  //     image: "https://picsum.photos/seed/digital-multimeter/300/300",
  //     price: 38000.00,
  //     quantity: 1,
  //     variants: { model: "DM-9205A" }
  //   }
  // ]

  const cartItems = cart;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const cartSummary =
    typeof window === "undefined"
      ? null
      : JSON.parse(localStorage.getItem("cartSummary") || "{}");

  const subtotal = cartSummary?.subtotal ?? 0;
  const totalQty = cartSummary?.totalQty ?? 0;

  const shipping = 2500
  const tax = subtotal * 0.075
  const total = subtotal + shipping + tax

  useEffect(() => {
    console.log(subtotal.toLocaleString("en-US", { maximumFractionDigits: 0 }))
    console.log(JSON.stringify(cartItems))
  }, [cartItems]);

  useEffect(() => {
    console.log(user)
  }, [user]);

  const placeOrder = async () => {
    if(user && cartItems) {
      const deliveryData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
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
        merchantId: user.id
      }

      const res = await postDelivery(deliveryData);
      if(res.status == 200) {
        const deliveryId = res.data.data.id;

        const orderData = {
          totalAmount: subtotal,
          primaryAmount: 40000,
          totalShippingFee: shipping,
          deliveryAddressId: deliveryId,
          totalQuantity: 1,
          bales: cartItems.map(item => ({
            quantity: item.slots,
            price: item.price,
            totalPrice: item.slots * item.quantity * item.price,
            bale: {
              id: item.productId,
              quantity: item.quantity,
              filledSlot: item.slots,
              price: item.price,
              baleId: item.baleId,
              product: {
                images: [item.image],
                name: item.name
              },
              items: item.items
            }
          })),
          merchantId: user.id
        }

        const orderRes = await postOrder(orderData);
        if(orderRes.status == 200) {
          toast.success(`Order successfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          router.push('/account')
        } else {
          toast.error(`Order not created`, {
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

                <div className="rounded-md bg-white border border-gray-100 p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <RiBankCardLine className="text-green-600 text-lg" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3 mb-5">
                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
  ${formData.paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-orange-500 checked:border-orange-500 cursor-pointer transition-all"
                      />
                      <div className="ml-3 flex items-center gap-3 flex-1">
                        <RiBankCardLine className="text-gray-600 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Credit/Debit Card</p>
                          <p className="text-xs text-gray-500">Visa, Mastercard, Verve</p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
  ${formData.paymentMethod === 'transfer'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={formData.paymentMethod === 'transfer'}
                        onChange={handleInputChange}
                        className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-orange-500 checked:border-orange-500 cursor-pointer transition-all"
                      />
                      <div className="ml-3 flex items-center gap-3 flex-1">
                        <RiSecurePaymentLine className="text-gray-600 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
                          <p className="text-xs text-gray-500">Direct bank transfer</p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
  ${formData.paymentMethod === 'wallet'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-400'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="wallet"
                        checked={formData.paymentMethod === 'wallet'}
                        onChange={handleInputChange}
                        className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 bg-white checked:bg-orange-500 checked:border-orange-500 cursor-pointer transition-all"
                      />
                      <div className="ml-3 flex items-center gap-3 flex-1">
                        <RiSecurePaymentLine className="text-gray-600 text-xl" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Digital Wallet</p>
                          <p className="text-xs text-gray-500">Paystack, Flutterwave</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-normal text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-normal text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-normal text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-normal text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-5 sm:p-6 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Save my information</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Save my information for faster checkout next time
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="setDefault"
                      checked={formData.setDefault}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Set as default address</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Use this address as default for future orders
                      </p>
                    </div>
                  </label>
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
                        ₦ {shipping.toLocaleString()}
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
                    disabled={submitting}
                    className='w-full flex gap-2 items-center justify-center py-3 text-sm font-normal rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {submitting ? (
                      <>
                        <RiLoader4Line className="text-lg animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <RiCheckLine className="text-lg" />
                        Place Order
                      </>
                    )}
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