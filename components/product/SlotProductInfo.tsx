"use client"

import { SingleBale } from "@/types/baletype"
import { RiGroupFill } from "react-icons/ri"
import UserBubbles from "./UserBubble"
import { Alert, Button, Input, Progress } from "../ui"
import { AllocationState, FormValues } from "@/types/types"

type Props = {
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
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement, Element>) => void
}

const SlotProductInfo = (
  { 
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
    handleChange
  }: Props) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{baleData.product.name}</h1>
      <div className="my-4">
        <div className="flex flex-wrap items-end gap-2">
          <p className="text-3xl md:text-4xl text-(--primary) font-bold">&#8358;{formatPrice(baleData.price)}</p>
          <p className="text-(--text-muted) line-through">&#8358;{formatPrice(baleData.oldPrice)}</p>
        </div>
      </div>
      <div className="mb-4">
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

      {colorsList.length > 0 && (
        <div className="mb-4">
          <div className="text-xs mb-2">
          </div>
          <p className="uppercase text-sm font-semibold text-(--text-muted)">
            Colors
          </p>
          {/* Color selection (unchanged UI, just wired) */}
          <div className={`grid grid-cols-2 gap-2 mt-1 ${colorsList.length > 8 ? "h-80" : "h-auto"} overflow-auto`}>
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
                    {color.label}
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
            <div className="p-4 flex flex-col h-full gap-3 overflow-y-auto mb-3">
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

      <div className="pt-8 my-4">
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
    </div>
  )
}

export default SlotProductInfo