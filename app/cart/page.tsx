"use client"

import { Badge, Button, Card, Input } from '@/components/ui'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsGraphDownArrow } from 'react-icons/bs'
import { RiArrowRightLine, RiCheckboxCircleFill, RiCurrencyFill, RiMessage2Line, RiShieldCheckFill } from 'react-icons/ri'

const Cart = () => {
  const image = "https://picsum.photos/seed/sensor-module/600/600"
  const [formValues, setFormValues] = useState({
    quantity: 0
  })
  
  const cartItems = [
    {
      cartItemId: "cart-001",
      productId: 1,
      name: "Advanced Industrial Optical Sensor Module",
      image: "https://picsum.photos/seed/sensor-module/300/300",
      supplierId: "sup-001",

      price: 1.35,
      currency: "USD",
      quantity: 500,
      unit: "unit",

      variants: {
        size: "Standard",
        color: "Black"
      },

      minOrder: 500,
      subtotal: 675.00,
      inStock: true
    },
    {
      cartItemId: "cart-002",
      productId: 4,
      name: "Digital Multimeter High Accuracy for Maintenance Engineers",
      image: "https://picsum.photos/seed/digital-multimeter/300/300",
      supplierId: "sup-004",

      price: 38.50,
      currency: "USD",
      quantity: 2,
      unit: "unit",

      variants: {
        model: "DM-9205A"
      },

      minOrder: 1,
      subtotal: 77.00,
      inStock: true
    },
    {
      cartItemId: "cart-003",
      productId: 6,
      name: "Ultra-Bright LED Matrix Display for Machine Information Panels",
      image: "https://picsum.photos/seed/led-matrix-display/300/300",
      supplierId: "sup-005",

      price: 10.20,
      currency: "USD",
      quantity: 50,
      unit: "set",

      variants: {
        resolution: "64×32",
        color: "Red"
      },

      minOrder: 50,
      subtotal: 510.00,
      inStock: true
    },
    {
      cartItemId: "cart-004",
      productId: 12,
      name: "DIN Rail Terminal Block Connector",
      image: "https://picsum.photos/seed/terminal-block/300/300",
      supplierId: "sup-003",

      price: 0.85,
      currency: "USD",
      quantity: 1000,
      unit: "piece",

      variants: {
        pitch: "5.08mm"
      },

      minOrder: 1000,
      subtotal: 850.00,
      inStock: false
    }
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormValues(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <section className='pt-24 mb-10 md:mb-16'>
      <div className="px-4 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
          <div>
            <h1 className="text-2xl md:text-4xl">Shopping Cart</h1>
            <p className='text-(--primary)/80'>3 item(s)</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button className='bg-red-800'>
              Delete Selected
            </Button>
            <Button primary>
              Select All Items
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 my-4">
          <div className="w-full lg:basis-3/4 flex flex-col gap-4">
            <div className="rounded-xl bg-(--bg-surface) mb-4 p-4">
              {
                cartItems.map(item => (
                  <Card key={item.cartItemId} className='py-2! px-3! mb-3 shadow-none! rounded-lg! flex justify-between'>
                    <div className="flex gap-2 items-center">
                      <Image src={item.image} alt='' width={0} height={0} className='w-15 aspect-square object-cover rounded' />
                      <div>
                        <p>
                          {item.name}
                        </p>
                        <div className="flex gap-3">
                          <Button className='py-2! px-3! text-xs! rounded-lg! bg-red-500!'>
                            Remove
                          </Button>
                          <Button className='py-2! px-3! text-xs! rounded-lg!'>
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-xl font-bold">${item.price}</p>
                      <div className="flex items-stretch">
                        <Button
                          className="rounded-r-none rounded-l-xl! py-2! px-4!"
                          disabled={Boolean(formValues.quantity == 0)}
                          onClick={() =>
                            setFormValues(prev => ({
                              ...prev,
                              quantity: prev.quantity == 0 ? 0 : prev.quantity - 1
                            }))
                          }
                          primary
                        >
                          -
                        </Button>
                        <Input
                          element="input"
                          input_type="text"
                          name="quantity"
                          value={formValues.quantity}
                          handler={handleChange}
                          genStyle="my-0!"
                          styling="rounded-none p-2! focus:outline-none! disabled w-20!"
                        />
                        <Button
                          className="rounded-l-none rounded-r-xl! py-2! px-4!"
                          onClick={() =>
                            setFormValues(prev => ({
                              ...prev,
                              quantity: prev.quantity + 1
                            }))
                          }
                          primary
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              }
            </div>
          </div>
          <div className="w-full lg:basis-1/4 flex flex-col">
            <div className="rounded-xl bg-(--bg-surface) p-6 mb-4">
              <h1 className="text-2xl mb-4">Order Summary</h1>
              <div className="pb-4 border-b border-(--border-muted)">
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Items Subtotal (3)</p>
                  <p className="font-bold">$6,612.50</p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Bulk Savings</p>
                  <p className="font-bold text-(--success)">-$225.50</p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Items Subtotal (3)</p>
                  <p className="font-bold">-$6,612.50</p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Items Subtotal (3)</p>
                  <p className="font-bold">$6,612.50</p>
                </div>
              </div>
              <div className="my-4 flex justify-between">
                <p className="font-bold">Total Payable</p>
                <div className='text-end'>
                  <p className="text-2xl font-bold text-(--primary)">$7,250.50</p>
                  <p className='text-xs text-(--primary)/70 uppercase'>Taxes and Shipping calculated at checkout</p>
                </div>   
              </div>
              <Button primary className='flex gap-2 items-center mb-4 mx-auto'>
                Proceed To Checkout
                <RiArrowRightLine />
              </Button>
              <div className="mb-2">
                <div className="flex gap-2 items-start mb-2">
                  <RiShieldCheckFill className='text-(--success)' />
                  <p className="text-xs text-(--primary)/60">Trade Assurance protects your orders.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <RiCurrencyFill className='text-(--primary)' />
                  <p className="text-xs text-(--primary)/60">Multiple payment methods supported</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-(--primary-soft) border border-(--primary) p-6 flex gap-4 items-start">
              <BsGraphDownArrow size={16} className='text-(--primary) block w-10' />
              <div>
                <p className="font-bold text-sm mb-2">Bulk Savings Tip</p>
                <p className='text-(--primary) text-sm'>Add 25% more "Precision Brass Pipe Fittings" to save an additional 3% ($9.37) on this item.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
