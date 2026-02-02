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
  RiPercentLine,
  RiArrowRightLine,
  RiShieldCheckFill,
  RiCurrencyFill,
  RiLoader4Fill
} from 'react-icons/ri'
import { BsGraphDownArrow } from 'react-icons/bs';
import { useCart } from '@/hooks/use-cart';
import { getCrossSubdomainCookie } from '@/lib/utils';

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
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const cartItems = cart;

  // const cartItems = [
  //   {
  //     cartItemId: "cart-001",
  //     productId: 1,
  //     name: "Advanced Industrial Optical Sensor Module",
  //     image: "https://picsum.photos/seed/sensor-module/300/300",
  //     supplierId: "sup-001",
  //     price: 15000.00,
  //     originalPrice: 25000.00,
  //     discount: 40,
  //     currency: "NGN",
  //     quantity: 0,
  //     unit: "unit",
  //     variants: {
  //       size: "Standard",
  //       color: "Black"
  //     },
  //     minOrder: 0,
  //     subtotal: 675.00,
  //     inStock: true
  //   },
  //   {
  //     cartItemId: "cart-002",
  //     productId: 4,
  //     name: "Digital Multimeter High Accuracy for Maintenance Engineers",
  //     image: "https://picsum.photos/seed/digital-multimeter/300/300",
  //     supplierId: "sup-004",
  //     price: 38000.00,
  //     originalPrice: 50000.00,
  //     discount: 24,
  //     currency: "NGN",
  //     quantity: 2,
  //     unit: "unit",
  //     variants: {
  //       model: "DM-9205A"
  //     },
  //     minOrder: 0,
  //     subtotal: 77.00,
  //     inStock: true
  //   },
  //   {
  //     cartItemId: "cart-003",
  //     productId: 6,
  //     name: "Ultra-Bright LED Matrix Display for Machine Information Panels",
  //     image: "https://picsum.photos/seed/led-matrix-display/300/300",
  //     supplierId: "sup-005",
  //     price: 10000.00,
  //     originalPrice: 15000.00,
  //     discount: 33,
  //     currency: "NGN",
  //     quantity: 50,
  //     unit: "set",
  //     variants: {
  //       resolution: "64×32",
  //       color: "Red"
  //     },
  //     minOrder: 0,
  //     subtotal: 510.00,
  //     inStock: true
  //   },
  //   {
  //     cartItemId: "cart-004",
  //     productId: 12,
  //     name: "DIN Rail Terminal Block Connector",
  //     image: "https://picsum.photos/seed/terminal-block/300/300",
  //     supplierId: "sup-003",
  //     price: 30000.00,
  //     originalPrice: 45000.00,
  //     discount: 33,
  //     currency: "NGN",
  //     quantity: 1000,
  //     unit: "piece",
  //     variants: {
  //       pitch: "5.08mm"
  //     },
  //     minOrder: 0,
  //     subtotal: 850.00,
  //     inStock: false
  //   }
  // ];

  const handleQuantityChange = async (
    cartItemId: string,
    newSlots: number,
    oldSlots: number
  ) => {
    const validSlots = Math.max(0, newSlots);

    setLoadingItems(prev => ({ ...prev, [cartItemId]: true }));

    await new Promise(resolve => setTimeout(resolve, 500));

    updateQuantity(cartItemId, validSlots);

    setLoadingItems(prev => ({ ...prev, [cartItemId]: false }));

    if (validSlots > oldSlots) {
      toast.success("✓ Product added successfully");
    } else if (validSlots < oldSlots && validSlots > 0) {
      toast.info("Item quantity updated");
    } else if (validSlots === 0) {
      toast.error("Item removed from cart");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const quantity = item.slots;
      return sum + (item.price * quantity * item.quantity);
    }, 0);
  };

 const handleCheckOut = () => {
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
    <>
      <section className='pt-24 mb-10 md:mb-16'>
        <div className="px-4 md:px-10 lg:px-20">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-4xl">Shopping Cart</h1>
              <p className='text-(--primary)/80'>{cartItems.length} pool(s)</p>
            </div>
            <Button 
              className='bg-(--error)! hover:bg-(--error)/50!'
              disabled={Boolean(cartItems.length == 0)}
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>  
          <div className="flex flex-col lg:flex-row gap-4 my-4">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="rounded-xl bg-(--bg-surface) mb-4 p-4">
                {
                  cartItems.length < 1 ?
                  <div className="flex flex-col gap-2 justify-center items-center py-20">

                    <p>No items in cart</p>
                  </div> : 
                    cartItems.map(item => {
                      const slots = item.slots || 0;

                      const removeItem = (id: string) => {
                        removeFromCart(id);
                        toast.error(`Product removed`, {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                        });
                      }

                      return (
                        <Card key={item.cartItemId} className='py-2! px-3! mb-3 shadow-none! rounded-none! border-b border-x-0 border-t-0'>
                          <div className="flex flex-col md:flex-row justify-between gap-4">
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
                            <div className="flex flex-1 justify-between gap-1">
                              <div>
                                <p className='text-sm md:text-lg'>
                                  {item.name}
                                </p>
                                <div className="grid grid-cols-1 gap-2 mt-2 mb-1">
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
                                  {/* {item?.minOrder > 1 && (
                                    <p className="text-xs text-left text-gray-500 mt-1">
                                      Min. order: {item.minOrder} {item.unit}s
                                    </p>
                                  )} */}
                                </div>
                              </div>
                              <div className='text-end'>
                                <p className="text-xl font-bold">₦ {item.price.toLocaleString()}</p>
                                <div className="flex shrink-0 items-center gap-2 justify-end mb-1">
                                  <p className="text-sm text-gray-400 line-through">
                                    ₦{item.originalPrice.toLocaleString()}
                                  </p>
                                  <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                    -{item.discount}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col-reverse md:flex-row justify-between md:items-center mt-2">
                            <div className="flex gap-3 mt-3">
                              <button className='flex items-center cursor-pointer gap-1.5 text-sm font-normal text-orange-600 hover:text-orange-800 hover:bg-orange-100/80 backdrop-blur-sm transition-all px-3 py-1.5 rounded-md' onClick={() => removeItem(item.cartItemId)}>
                                <RiDeleteBinLine className="text-base" />
                                Remove
                              </button>
                            </div>
                            <div className="flex items-stretch">
                              <Button
                                className="rounded-r-none rounded-l-xl! py-2! px-4!"
                                disabled={slots <= 0 || loadingItems[item.cartItemId]}
                                onClick={() =>
                                  handleQuantityChange(item.cartItemId, slots - 1, slots)
                                }
                                primary
                              >
                                -
                              </Button>
                              {loadingItems[item.cartItemId] ? (
                                <div className="w-12 sm:w-20 h-9 flex items-center justify-center">
                                  <div className="w-4 h-4 border-3 border-gray-300 border-t-orange-600 rounded-full animate-spin"></div>
                                </div>
                              ) : (
                                <Input
                                  element="input"
                                  input_type="text"
                                  name="quantity"
                                  value={slots}
                                  handler={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    handleQuantityChange(item.cartItemId, val, slots);
                                  }}
                                  disabled={loadingItems[item.cartItemId]}
                                  genStyle="my-0!"
                                  styling="w-12 sm:w-20 rounded-none text-center focus:outline-none font-normal text-gray-900 bg-transparent text-sm disabled:opacity-50"
                                />
                              )}

                              <Button
                                className="rounded-l-none rounded-r-xl! py-2! px-4!"
                                disabled={loadingItems[item.cartItemId]}
                                onClick={() =>
                                  handleQuantityChange(item.cartItemId, slots + 1, slots)
                                }
                                primary
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })
                }
              </div>
              <Link href={'/products'}>
                <Button primary>
                  <RiArrowLeftLine />
                  Continue Shopping
                </Button>
              </Link>
            </div>
            <div className="w-full lg:w-96 lg:shrink-0 flex flex-col">
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
                  <p className="text-base font-medium text-gray-900">
                    Total
                  </p>
                  <p className="text-2xl font-medium text-gray-900">
                    ₦ {total.toLocaleString()}
                  </p>
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
                    <RiShieldCheckLine className='text-green-600 text-lg shrink-0 mt-0.5' />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Trade Assurance protects your orders
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <RiSecurePaymentLine className='text-blue-600 text-lg shrink-0 mt-0.5' />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Secure payment methods
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <RiRefund2Line className='text-green-600 text-lg shrink-0 mt-0.5' />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Free returns within 30 days
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-(--primary-soft)/30 border border-(--primary-soft) p-5 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-(--primary) flex items-center justify-center shrink-0">
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

        {isCheckoutLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
              <RiLoader4Fill size={48} className='text-(--primary) animate-spin' />
              <p className="text-gray-900 font-medium">Proceeding to checkout...</p>
            </div>
          </div>
        )}
      </section> 
    </>
  )
}

export default Cart