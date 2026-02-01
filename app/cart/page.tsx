"use client"
import { Badge, Button, Card, Input } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify';
import React, { useState } from 'react'
import { useRouter } from "next/navigation";

import {
  RiArrowLeftLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
  RiSecurePaymentLine,
  RiRefund2Line,
  RiPercentLine
} from 'react-icons/ri'

const Cart = () => {

  const router = useRouter();
  const [formValues, setFormValues] = useState<Record<string, number>>({
  'cart-001': 0,
  'cart-002': 0,
  'cart-003': 0,
  'cart-004': 0,
})

// const [formValues, setFormValues] = useState<Record<string, number>>(() => {
//   const initialValues: Record<string, number> = {};
//   cartItems.forEach(item => {
//     initialValues[item.cartItemId] = item.quantity;
//   });
//   return initialValues;
// });

const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({})
const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const cartItems = [
    {
      cartItemId: "cart-001",
      productId: 1,
      name: "Advanced Industrial Optical Sensor Module",
      image: "https://picsum.photos/seed/sensor-module/300/300",
      supplierId: "sup-001",
      price: 15000.00,
      originalPrice: 25000.00,
      discount: 40,
      currency: "NGN",
      quantity: 0,
      unit: "unit",
      variants: {
        size: "Standard",
        color: "Black"
      },
      minOrder: 0,
      subtotal: 675.00,
      inStock: true
    },
    {
      cartItemId: "cart-002",
      productId: 4,
      name: "Digital Multimeter High Accuracy for Maintenance Engineers",
      image: "https://picsum.photos/seed/digital-multimeter/300/300",
      supplierId: "sup-004",
      price: 38000.00,
      originalPrice: 50000.00,
      discount: 24,
      currency: "NGN",
      quantity: 2,
      unit: "unit",
      variants: {
        model: "DM-9205A"
      },
      minOrder: 0,
      subtotal: 77.00,
      inStock: true
    },
    {
      cartItemId: "cart-003",
      productId: 6,
      name: "Ultra-Bright LED Matrix Display for Machine Information Panels",
      image: "https://picsum.photos/seed/led-matrix-display/300/300",
      supplierId: "sup-005",
      price: 10000.00,
      originalPrice: 15000.00,
      discount: 33,
      currency: "NGN",
      quantity: 50,
      unit: "set",
      variants: {
        resolution: "64×32",
        color: "Red"
      },
      minOrder: 0,
      subtotal: 510.00,
      inStock: true
    },
    {
      cartItemId: "cart-004",
      productId: 12,
      name: "DIN Rail Terminal Block Connector",
      image: "https://picsum.photos/seed/terminal-block/300/300",
      supplierId: "sup-003",
      price: 30000.00,
      originalPrice: 45000.00,
      discount: 33,
      currency: "NGN",
      quantity: 1000,
      unit: "piece",
      variants: {
        pitch: "5.08mm"
      },
      minOrder: 0,
      subtotal: 850.00,
      inStock: false
    }
  ];

 const handleQuantityChange = async (cartItemId: string, newQuantity: number, itemName: string) => {
  const oldQuantity = formValues[cartItemId] || 0;
  const validQuantity = Math.max(0, newQuantity);
  
  setLoadingItems(prev => ({
    ...prev,
    [cartItemId]: true
  }));

  await new Promise(resolve => setTimeout(resolve, 1000));

  setFormValues(prev => ({
    ...prev,
    [cartItemId]: validQuantity
  }));

   setLoadingItems(prev => ({
    ...prev,
    [cartItemId]: false
  }));

  if (validQuantity > oldQuantity) {
    toast.success(`✓ Product added successfully`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  } else if (validQuantity < oldQuantity && validQuantity > 0) {
    toast.info(`Item quantity has been updated`, {
      position: "top-right",
      autoClose: 2000,
    });
  } else if (validQuantity === 0) {
    toast.error(`Item quality removed from cart`, {
      position: "top-right",
      autoClose: 2000,
    });
  }
};

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const quantity = formValues[item.cartItemId] || 0;
      return sum + (item.price * quantity);
    }, 0);
  };

 const handleCheckOut = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    localStorage.setItem('redirectAfterLogin', '/checkout');
    
    toast({
      title: "Authentication Required",
      description: "Please login to continue with checkout",
      variant: "warning",
      duration: 3000,
    });
    
    router.push('/login');
  } else {
    setIsCheckoutLoading(true);

    setTimeout(()=>{
      router.push('/checkout');
    },1000)
  }
};
  
  const subtotal = calculateTotal();
  const bulkSavings = subtotal > 0 ? 225.50 : 0;
  const shipping = subtotal > 0 ? 45.00 : 0;
  const total = subtotal - bulkSavings + shipping;

  return (
    <section className='min-h-screen pt-20 pb-16 md:pt-24 md:pb-20 bg-gray-50'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between sm:items-end">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-2xl font-medium text-gray-900">
                Cart ({cartItems.length})
              </h1>
              <p className='text-sm sm:text-base text-gray-500'>
                {cartItems.length} Pool{cartItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-3">
         <div className="w-full lg:flex-1">
          <div className="rounded bg-[#FFFFFF] px-2 shadow-sm divide-y divide-gray-200">
            {cartItems.map(item => {
              const quantity = formValues[item.cartItemId] || 0;
              const itemTotal = item.price * quantity;

              return (
                <div
                  key={item.cartItemId}
                  className='p-4 sm:p-5 hover:bg-gray-50 transition duration-200'
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <div className="flex-shrink-0">
                <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                  className='object-cover'
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-medium px-2.5 py-1 bg-red-600 rounded">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-3">
                <button className='flex items-center cursor-pointer gap-1.5 text-sm font-normal text-orange-600 hover:text-orange-800 hover:bg-orange-100/80 backdrop-blur-sm transition-all px-3 py-1.5 rounded-md'>
                  <RiDeleteBinLine className="text-base" />
                  Remove
                </button>
              </div>
            </div>

            <div className="flex justify-between w-full">
              <div>
                <p className="text-sm sm:text-base tracking-normal text-gray-900 mb-2 leading-normal">
                  {item.name}
                </p>

                <div className="grid grid-cols-1 gap-2 mb-1">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item.variants).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-normal bg-gray-100 text-gray-600"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                  {item.minOrder > 1 && (
                    <p className="text-xs text-left text-gray-500 mt-1">
                      Min. order: {item.minOrder} {item.unit}s
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <div className="text-right">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">
                      ₦ {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <p className="text-sm text-gray-400 line-through">
                        ₦ {item.originalPrice.toLocaleString()}
                      </p>
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        -{item.discount}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between shadow-md border border-gray-100 rounded-sm mt-10 overflow-hidden bg-white">
                      <>
                        <button
                          className="w-9 h-9 cursor-pointer bg-(--primary) hover:text-(--primary) hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-normal text-[#FFFFFF] text-lg"
                          disabled={quantity <= 0 || loadingItems[item.cartItemId]}
                          onClick={() => handleQuantityChange(item.cartItemId, quantity - 1, item.name)}
                        >
                          −
                        </button>
                        <div>
                        {loadingItems[item.cartItemId] ? (
                          <div className="w-full h-9 flex items-center justify-center">
                          <div className="w-4 h-4 border-3 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
                        </div>
                        ) : (
                          <input
                          type="text"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            handleQuantityChange(item.cartItemId, val, item.name);
                          }}
                          disabled={loadingItems[item.cartItemId]}
                          className="w-12 sm:w-14 text-center h-9 focus:outline-none font-normal text-gray-900 bg-transparent text-sm disabled:opacity-50"
                          />
                        )}
                        </div>
                        <button
                          className="w-9 h-9 hover:bg-gray-50 cursor-pointer bg-(--primary) hover:text-(--primary) transition-colors font-normal text-[#FFFFFF] text-lg disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={loadingItems[item.cartItemId]}
                          onClick={() => handleQuantityChange(item.cartItemId, quantity + 1, item.name)}
                        >
                          +
                        </button>
                      </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>

        <div className="mt-5">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-normal gap-2 border-2 hover:border-[#FFFFFF] bg-(--primary) text-[#FFFFFF] shadow rounded-md px-3 py-3 transition-colors"
          >
            <RiArrowLeftLine/> Continue Shopping
          </Link>
        </div>
      </div>


          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="rounded bg-[#FFFFFF] border border-gray-100 p-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-5 uppercase text-sm tracking-wide">
                  Cart Summary
                </h2>

                <div className="space-y-3 pb-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-normal text-gray-600">
                      Subtotal
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      ₦ {subtotal.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-normal text-gray-600">
                      Bulk Savings
                    </p>
                    <p className="text-base font-medium text-orange-600">
                      −₦ {bulkSavings.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm font-normal text-gray-600">
                      Shipping
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      ₦ {shipping.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="py-5">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">
                      Total
                    </p>
                    <p className="text-2xl font-medium text-gray-900">
                      ₦ {total.toLocaleString()}
                    </p>
                  </div>
                </div>

                  <Button
                  onClick={handleCheckOut}
                  primary
                  disabled={subtotal === 0 || isCheckoutLoading}
                  className='w-full flex gap-2 items-center justify-center py-3 text-sm font-normal rounded-sm shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Checkout (₦ {total.toLocaleString()})
                </Button>
                <div className="mt-5 space-y-3 pt-5 border-t border-gray-200">
                  <div className="flex gap-3 items-start">
                    <RiShieldCheckLine className='text-green-600 text-lg flex-shrink-0 mt-0.5' />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Trade Assurance protects your orders
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <RiSecurePaymentLine className='text-blue-600 text-lg flex-shrink-0 mt-0.5' />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Secure payment methods
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <RiRefund2Line className='text-green-600 text-lg flex-shrink-0 mt-0.5' />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Free returns within 30 days
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-orange-50 border border-orange-200 p-5 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <RiPercentLine className='text-white text-sm' />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-1.5">
                    Bulk Savings Tip
                  </p>
                  <p className='text-gray-700 text-xs leading-relaxed'>
                    Add 25% more "Precision Brass Pipe Fittings" to save an additional 3% (₦9.37) on this item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCheckoutLoading && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
          <p className="text-gray-900 font-medium">Proceeding to checkout...</p>
        </div>
      </div>
    )}
    </section>
  )
}

export default Cart