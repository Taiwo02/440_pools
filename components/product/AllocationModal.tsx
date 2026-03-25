"use client"

import React, { useEffect } from 'react'
import { RiBankCardFill, RiCloseLine, RiGroup2Fill, RiGroupFill, RiShoppingBagLine, RiShoppingCart2Line } from 'react-icons/ri';
// @ts-ignore
import Modal from "react-modal";
import { Alert, Button, Input, Progress } from '../ui';
import { SingleBale } from '@/types/baletype';
import { AllocationState, FormValues } from '@/types/types';
import UserBubbles from './UserBubble';

type Props = {
  isModalOpen: boolean,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  baleData: SingleBale,
    formatPrice: (price: number) => string,
    productsPerSlot: number,
    colorsList: {
      value: string,
      label: string,
      node: React.ReactNode | null
    }[],
    formValues: FormValues,
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>,
    getColorQuantity: (colorId: number) => number,
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement, Element>) => void
    activeColorId: number | null,
    hasSizes: boolean,
    sizesList: {
      id: number,
      value: string,
      label: string
    }[],
    isAllocationExceeded: boolean,
    allocations: AllocationState,
    setAllocations: React.Dispatch<React.SetStateAction<AllocationState>>,
    decreaseSizeQty: (colorId: number, sizeId: number, sizeLabel: string) => void,
    increaseSizeQty: (colorId: number, sizeId: number, sizeLabel: string) => void,
    decreaseColorQty: (colorId: number) => void,
    increaseColorQty: (colorId: number) => void,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement, Element>) => void,
    buyDirectly: boolean,
    joinPool: () => void,
    handleBuyNow: () => void
    handleAddToCart: () => void
}

const AllocationModal = (
  { 
    isModalOpen, 
    setIsModalOpen,
    baleData,
    formatPrice,
    productsPerSlot = 0,
    colorsList,
    formValues,
    setFormValues,
    getColorQuantity,
    handleCheckboxChange,
    activeColorId,
    hasSizes,
    sizesList,
    isAllocationExceeded,
    allocations,
    setAllocations,
    decreaseSizeQty,
    increaseSizeQty,
    decreaseColorQty,
    increaseColorQty,
    handleChange,
    buyDirectly,
    joinPool,
    handleAddToCart,
    handleBuyNow
  }: Props) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Example Modal"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 100
        },
        content: {
          width: window.innerWidth > 768 ? '40%' : '100%',
          top: window.innerWidth > 768 ? 0 : '10%',
          left: window.innerWidth > 768 ? '60%' : '0%',
          height: window.innerWidth > 768 ? '100%' : '90%',
          backgroundColor: 'var(--bg-page)',
          borderRadius: '10px 0 0 10px',
          border: 'none',
        },
      }}
    >
      <div className="flex justify-between items-center pb-3 border-b border-(--border-default)">
        <h1 className="text-lg font-semibold">Select variations and quantity</h1>
        <button onClick={() => setIsModalOpen(false)} className='block ml-auto'>
          <RiCloseLine size={20} />
        </button>
      </div>
      <div className="overflow-auto h-[calc(100vh-150px)] no-scrollbar">
        <div className="my-4">
          <h2 className="text-lg">
            Prices
          </h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="text-3xl text-(--primary) font-bold">&#8358;{formatPrice(baleData.price + 10)}</p>
              <span className='relative -top-2 text-xs text-(--text-muted)'>Pooled Price per Unit</span>
            </div>
            <div>
              <p className="text-3xl text-(--primary) font-bold">&#8358;{formatPrice(baleData.oldPrice)}</p>
              <span className='relative -top-2 text-xs text-(--text-muted)'>Direct Buy Price per Unit</span>
            </div>
          </div>
        </div>

        {
          buyDirectly ?
            <div className="pt-4 my-4 border-t border-(--border-default)">
              <p className="uppercase text-sm font-semibold text-(--text-muted)">
                Minimum Order Quantity (MOQ)
              </p>
              <div className="flex items-stretch mt-1">
                <Button
                  className="rounded-r-none rounded-l-xl! py-2!"
                  disabled={formValues.directQty === 1}
                  onClick={() =>
                    setFormValues(p => ({ ...p, directQty: p.directQty - 1 }))
                  }
                  primary
                >
                  -
                </Button>
                <Input
                  element="input"
                  input_type="text"
                  name="quantity"
                  value={formValues.directQty}
                  handler={handleChange}
                  genStyle="my-0!"
                  styling="rounded-none p-2! focus:outline-none! disabled w-30! text-center"
                />
                <Button
                  className="rounded-l-none rounded-r-xl! py-2!"
                  onClick={() =>
                    setFormValues(p => ({ ...p, directQty: p.directQty + 1 }))
                  }
                  primary
                >
                  +
                </Button>
              </div>
            </div> :
            <>
              <div className="mb-4 bg-(--bg-surface) p-4 rounded-lg">
                <div className="flex md:items-end justify-between">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2 items-center text-(--primary)">
                      <RiGroupFill />
                      <h2 className="text-lg uppercase"><span className="hidden md:block"></span> Pool Progress</h2>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-(--text-muted)">
                        <span className="text-lg md:text-2xl text-(--text-primary) font-bold">{baleData.filledSlot} </span>
                        / {baleData.slot} slots reserved
                      </p>
                      <UserBubbles count={baleData.filledSlot} />
                    </div>
                  </div>
                </div>
                <Progress
                  totalQty={baleData.slot}
                  currentQty={baleData.filledSlot}
                  className='my-0!'
                />
                <Alert type="success" className="mt-3 py-2! px-4! w-fit! text-sm!">
                  * 1 slot = {productsPerSlot} products
                </Alert>
              </div>
              <div className="pt-4 my-4 border-t border-(--border-default)">
                <p className="uppercase text-sm font-semibold text-(--text-muted)">
                  Slots
                </p>
                <div className="flex items-stretch">
                  <Button
                    className="rounded-r-none rounded-l-xl! py-2!"
                    disabled={formValues.slots === 1}
                    onClick={() =>
                      setFormValues(p => ({ ...p, slots: p.slots - 1 }))
                    }
                    primary
                  >
                    -
                  </Button>
                  <Input
                    element="input"
                    input_type="text"
                    name="quantity"
                    value={formValues.slots}
                    handler={handleChange}
                    genStyle="my-0!"
                    styling="rounded-none p-2! focus:outline-none! disabled w-30! text-center"
                  />
                  <Button
                    className="rounded-l-none rounded-r-xl! py-2!"
                    onClick={() =>
                      setFormValues(p => ({ ...p, slots: p.slots + 1 }))
                    }
                    primary
                  >
                    +
                  </Button>
                </div>
              </div>
            </>
          
        }

        <div className="border-t border-(--border-default) py-4">
          {colorsList.length > 0 && (
            <div className="mb-4">
              <div className="text-xs mb-2">
              </div>
              <p className="uppercase text-sm font-semibold text-(--text-muted)">
                Colors
              </p>
              {/* Color selection (unchanged UI, just wired) */}
              <div className={`flex flex-wrap items-stretch gap-2 mt-1 px-1`}>
                {
                  colorsList.map((color, index) => {
                    const isChecked = formValues.colors.includes(color.value)

                    const colorObj = baleData.product.colors.find(
                      c => c.color === color.value
                    );

                    if (!colorObj) return null;

                    const qty = getColorQuantity(colorObj.id);

                    return (
                      <label
                        key={index}
                        className={`relative flex gap-2 items-center rounded-lg border p-2 cursor-pointer transition ${isChecked ? "border-(--primary) ring-1 ring-(--primary)"
                          : "border-(--border-default)"}`}
                      >
                        <input
                          type="checkbox"
                          name="colors"
                          value={color.value}
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          className="hidden"
                        />

                        {qty > 0 && (
                          <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-(--primary) text-white text-xs flex items-center justify-center">
                            {qty}
                          </span>
                        )}

                        {color.node != null && color.node}
                        {color.node == null && color.label}
                      </label>
                    )
                  })
                }
              </div>
            </div>
          )}

          {activeColorId !== null && (
            <>
              <div className={`${hasSizes && sizesList.length > 5 ? "h-80" : "h-auto"} my-4`}>
                <div className="flex justify-between">
                  <p className="uppercase text-sm font-semibold text-(--text-muted)">{hasSizes ? 'Sizes' : 'Quantity'}</p>
                  {isAllocationExceeded && (
                    <p className="text-red-500 text-xs capitalize font-normal">
                      Allocation exceeds selected slots
                    </p>
                  )}
                </div>
                <div className="p-4 flex flex-col h-full gap-3 overflow-y-auto mb-3 no-scrollbar">
                  {hasSizes && (
                    <>
                      {sizesList.map(size => {
                        const qty =
                          allocations[activeColorId]?.sizes?.[size.id]?.quantity ?? 0

                        return (
                          <div key={size.id} className="flex justify-between items-center">
                            <span className="text-sm">{size.label}</span>

                            <div className="flex items-stretch">
                              <Button
                                className="rounded-r-none rounded-l-xl! py-2! px-4! bg-(--primary)"
                                disabled={qty === 0}
                                onClick={() =>
                                  decreaseSizeQty(activeColorId, size.id, size.label)
                                }
                                primary
                              >
                                −
                              </Button>

                              <Input
                                element="input"
                                input_type="text"
                                value={qty}
                                name="qty"
                                handler={() => { }}
                                disabled
                                genStyle="my-0!"
                                styling="rounded-none p-2! w-10! text-center!"
                              />

                              <Button
                                className="rounded-l-none rounded-r-xl! py-2! px-4! bg-(--primary)"
                                onClick={() =>
                                  increaseSizeQty(activeColorId, size.id, size.label)
                                }
                                primary
                              >
                                +
                              </Button>
                            </div>
                          </div>

                        )
                      })}
                    </>
                  )}

                  {!hasSizes && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm capitalize">
                        {allocations[activeColorId!]?.colorLabel}
                      </span>

                      <div className="flex items-stretch">
                        <Button
                          className="rounded-r-none rounded-l-xl! py-2! px-4! bg-(--primary)"
                          disabled={(allocations[activeColorId].quantity ?? 0) === 0}
                          onClick={() => decreaseColorQty(activeColorId)}
                          primary
                        >
                          −
                        </Button>

                        <Input
                          element="input"
                          input_type="text"
                          value={allocations[activeColorId].quantity ?? 0}
                          name="qty"
                          disabled
                          handler={() => { }}
                          genStyle="my-0!"
                          styling="rounded-none p-2! w-10! text-center!"
                        />

                        <Button
                          className="rounded-l-none rounded-r-xl! py-2! px-4! bg-(--primary)"
                          onClick={() => increaseColorQty(activeColorId)}
                          primary
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-full p-4 border-t border-(--border-default) absolute left-0 bottom-0 bg-(--bg-page)">
        {
          buyDirectly ?
            <div className="flex gap-2">
              <Button
                primary
                isFullWidth
                className={`uppercase  gap-2 items-center`}
                disabled={false}
                onClick={handleBuyNow}
              >
                <RiBankCardFill className="hidden md:block" />
                Buy
              </Button>
              <Button
                primary
                isFullWidth
                className={`uppercase ring-2 ring-(--primary) ring-inset text-(--primary)! bg-transparent`}
                disabled={false}
                onClick={handleAddToCart}
              >
                <RiShoppingCart2Line className="hidden md:block" />
                Add to Cart
              </Button>
            </div> : 
            <Button
              primary
              isFullWidth
              disabled={false}
              onClick={joinPool}
            >
              <RiGroup2Fill className="hidden md:block" />
              Join Pool
            </Button>
        }
      </div>
    </Modal>
  )
}

export default AllocationModal;