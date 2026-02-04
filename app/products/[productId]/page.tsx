"use client";

import { useLoginMutation } from "@/api/auth";
import { useGetSingleBale } from "@/api/bale";
import ProductImages from "@/components/product/ImageGallery";
import Countdown from "@/components/shared/Countdown";
import { Alert, Badge, Button, Input, Progress } from "@/components/ui";
import { Tabs } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { getCrossSubdomainCookie } from "@/lib/utils";
import { VariantAllocation } from "@/types/types";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiGroupFill,
  RiLoader5Line,
  RiRocket2Fill,
  RiShieldCheckFill,
  RiShip2Fill,
  RiStarFill,
  RiStarHalfFill,
  RiTimeFill,
} from "react-icons/ri";
import { toast } from "react-toastify";

type FormValues = {
  sizes: string[];
  colors: string[];
  slots: number;
};

type SizeAllocation = {
  sizeId: number
  sizeLabel: string
  quantity: number
}

type ColorAllocation = {
  colorId: number
  colorLabel: string
  colorImages: string[]
  quantity?: number
  sizes: Record<number, SizeAllocation>
}


type AllocationState = Record<number, ColorAllocation> // key = colorId

const ProductDetails = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    sizes: [],
    colors: [],
    slots: 1,
  });
  const [activeColorId, setActiveColorId] = useState<number | null>(null)
  const [allocations, setAllocations] = useState<AllocationState>({})

  const { productId } = useParams<{ productId: string }>();
  const { data: baleData, isPending, error } = useGetSingleBale(productId);
  const { } = useLoginMutation();
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!baleData) return

    if (formValues.colors.length === 0) {
      setActiveColorId(null)
    }
  }, [formValues.colors, baleData])

  useEffect(() => {
    if (!baleData) return
    if (formValues.colors.length > 0) return

    const firstColor = baleData.product.colors[0]
    if (!firstColor) return

    setFormValues(prev => ({
      ...prev,
      colors: [firstColor.color],
    }))

    setActiveColorId(firstColor.id)

    setAllocations(prev => ({
      ...prev,
      [firstColor.id]: {
        colorId: firstColor.id,
        colorLabel: firstColor.color,
        colorImages: firstColor.images,
        sizes: {},
        quantity: 0,
      },
    }))
  }, [baleData])

  const updateSizeQuantity = (
    colorId: number,
    sizeId: number,
    sizeLabel: string,
    quantity: number
  ) => {
    setAllocations(prev => ({
      ...prev,
      [colorId]: {
        ...prev[colorId],
        sizes: {
          ...prev[colorId].sizes,
          [sizeId]: {
            sizeId,
            sizeLabel,
            quantity
          }
        }
      }
    }))
  }

  const updateColorQuantity = (
    colorId: number,
    quantity: number
  ) => {
    setAllocations(prev => ({
      ...prev,
      [colorId]: {
        ...prev[colorId],
        quantity
      }
    }))
  }

  const increaseSizeQty = (
    colorId: number,
    sizeId: number,
    sizeLabel: string
  ) => {
    const currentQty =
      allocations[colorId]?.sizes?.[sizeId]?.quantity ?? 0

    updateSizeQuantity(colorId, sizeId, sizeLabel, currentQty + 1)
  }

  const decreaseSizeQty = (
    colorId: number,
    sizeId: number,
    sizeLabel: string
  ) => {
    const currentQty =
      allocations[colorId]?.sizes?.[sizeId]?.quantity ?? 0

    if (currentQty <= 0) return

    updateSizeQuantity(colorId, sizeId, sizeLabel, currentQty - 1)
  }

  const increaseColorQty = (colorId: number) => {
    const currentQty = allocations[colorId]?.quantity ?? 0
    updateColorQuantity(colorId, currentQty + 1)
  }

  const decreaseColorQty = (colorId: number) => {
    const currentQty = allocations[colorId]?.quantity ?? 0
    if (currentQty <= 0) return
    updateColorQuantity(colorId, currentQty - 1)
  }

  const getColorQuantity = (colorId: number) => {
    const allocation = allocations[colorId]
    if (!allocation) return 0

    if (hasSizes) {
      return Object.values(allocation.sizes ?? {}).reduce(
        (sum, s) => sum + (s.quantity ?? 0),
        0
      )
    }

    return allocation.quantity ?? 0
  }

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target

    const color = baleData?.product.colors.find(c => c.color === value)
    if (!color) return

    setFormValues(prev => ({
      ...prev,
      colors: checked ? [value] : []
    }))

    if (checked) {
      setActiveColorId(color.id)

      setAllocations(prev => ({
        ...prev,
        [color.id]: prev[color.id] ?? {
          colorId: color.id,
          colorLabel: color.color,
          colorImages: color.images,
          sizes: {},
          quantity: 0,
        }
      }))
    } else {
      setActiveColorId(null)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: Number(value) }));
  };

  const joinPool = () => {
    const token = getCrossSubdomainCookie("440_token");
    if (!token) {
      sessionStorage.setItem("showLoginToast", "true");
      router.push("/account");
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
      </div>
    );
  }

  if (error || !baleData) return <p>Error loading bale</p>;

  const productsPerSlot = baleData.quantity / baleData.slot;

  const sizesList = baleData.product.productSizes.map(s => ({
    id: s.id,
    value: s.size.label,
    label: s.size.label,
  }));

  const colorsList = baleData.product.colors.map(c => ({
    value: c.color,
    label: c.color,
    node: (
      <img
        src={c.images[0]}
        alt={c.color}
        className="w-10 h-10 rounded-l-lg object-cover"
      />
    ),
  }));

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 })
  }

  /* ---------------- VARIANT → ALLOCATION LOGIC ---------------- */
  const hasSizes = sizesList.length > 0

  const items = Object.values(allocations).flatMap(color => {
    // WITH SIZES
    if (hasSizes) {
      return Object.values(color.sizes)
        .filter(s => s.quantity > 0)
        .map(s => ({
          kind: "shoe",
          quantity: s.quantity,
          totalPrice: s.quantity * baleData.product.price,
          size: {
            id: s.sizeId,
            label: s.sizeLabel,
            type: "shoe",
            format: "usShoeSize",
          },
          color: {
            id: color.colorId,
            color: color.colorLabel,
            images: color.colorImages,
            productId: baleData.product.id,
            status: true,
          }
        }))
    }

    // NO SIZES
    if (!color.quantity || color.quantity <= 0) return []

    return [{
      kind: "bulk",
      quantity: color.quantity,
      totalPrice: color.quantity * baleData.product.price,
      color: {
        id: color.colorId,
        color: color.colorLabel,
        images: color.colorImages,
        productId: baleData.product.id,
        status: true,
      }
    }]
  })

  const selectedVariants = {
    sizes: formValues.sizes,
    colors: formValues.colors,
  };

  const totalAllocatedQuantity = Object.values(allocations).reduce(
    (sum, color) => {
      if (hasSizes) {
        return (
          sum +
          Object.values(color.sizes).reduce(
            (s, size) => s + size.quantity,
            0
          )
        )
      }

      return sum + (color.quantity ?? 0)
    },
    0
  )

  const maxAllowedQuantity =
    formValues.slots * (baleData.quantity / baleData.slot)

  const isAllocationExceeded =
    totalAllocatedQuantity > maxAllowedQuantity


  return (
    <>
      <section className="pt-36 md:pt-24 mb-16">
        <div className="px-2 md:px-10 lg:px-20 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* LEFT */}
            <div className="md:basis-2/3">
              <div className="bg-(--bg-surface) p-6 rounded-xl mb-8">
                <ProductImages imageList={baleData.product.images.slice(1)} />
              </div>
              <div className="hidden md:block p-4 md:p-6 rounded-2xl bg-(--bg-surface) w-full mb-8">
                <Tabs defaultValue="specs">
                  <Tabs.List className="border-b border-(--border-default)">
                    <Tabs.Trigger
                      value="specs"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Specs</span>
                      <span className="hidden md:block">Specifications</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="shipping"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Shipping</span>
                      <span className="md:block hidden">Shipping Information</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="reviews"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Reviews</span>
                      <span className="md:block hidden">Product Reviews</span>
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="specs" className="pt-4">
                    Product details go here
                  </Tabs.Content>
                  <Tabs.Content value="shipping" className="pt-4">
                    Shipping details go here
                  </Tabs.Content>
                  <Tabs.Content value="reviews" className="pt-4">
                    Reviews content goes here
                  </Tabs.Content>
                </Tabs>
              </div>
              <div className="p-4 rounded-lg bg-(--bg-surface) hidden md:flex flex-col md:flex-row justify-between gap-4 items-center w-full">
                <div className="flex items-center gap-4">
                  <Image src={baleData.product.supplier.image} alt="" width={0} height={0} className="w-20 aspect-square rounded-full" />
                  <div>
                    <h2 className="text-xl">{baleData.product.supplier.name}</h2>
                    {
                      baleData.product.supplier.status &&
                      <Badge primary className="font-semibold">Verified</Badge>
                    }
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button primary className="py-2! rounded-xl!">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="md:basis-1/3 bg-(--bg-surface) p-6 rounded-xl sticky top-20">
              <h1 className="text-3xl lg:text-4xl">{baleData.product.name}</h1>
              <div className="flex gap-2 md:gap-4 items-center flex-wrap mb-4">
                <div className="flex gap-1 items-center">
                  <RiStarFill className="text-(--primary)" size={12} />
                  <RiStarFill className="text-(--primary)" size={12} />
                  <RiStarFill className="text-(--primary)" size={12} />
                  <RiStarFill className="text-(--primary)" size={12} />
                  <RiStarHalfFill className="text-(--primary)" size={12} />
                  <span className="text-(--text-muted) font-semibold">4.6</span>
                </div>
                <span className="text-(--text-muted)">|</span>
                <p className="text-(--text-muted)">124 Reviews</p>
                <span className="text-(--text-muted)">|</span>
                <p className="text-(--text-muted) uppercase">SKU: {baleData.baleId}</p>
              </div>
              <div className="my-4">
                <div className="flex flex-wrap items-end gap-2">
                  <p className="text-lg md:text-4xl text-(--primary) font-bold">&#8358;{formatPrice(baleData.price)}</p>
                  <p className="text-(--text-muted) line-through">&#8358;{formatPrice(baleData.oldPrice)}</p>
                </div>
              </div>
              <div className="rounded-xl p-4 bg-(--primary-soft) border-2 border-(--primary) mb-4">
                <div className="flex md:items-end justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="hidden md:flex gap-2 items-center text-(--primary)">
                      <RiGroupFill />
                      <h2 className="text-xl uppercase"><span className="hidden md:block"></span> Pool Progress</h2>
                    </div>
                    <p className="text-(--text-muted)">
                      <span className="text-lg md:text-2xl text-(--text-primary) font-bold">{baleData.filledSlot} </span>
                      / {baleData.slot} slots
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="hidden md:flex gap-2 items-center text-(--text-muted)">
                      <RiTimeFill />
                      <p className="font-bold uppercase">Time Left</p>
                    </div>
                    <Countdown
                      endDate={baleData.endIn}
                    />
                  </div>
                </div>
                <Progress
                  totalQty={baleData.slot}
                  currentQty={baleData.filledSlot}
                  className='my-0!'
                  progClass="bg-(--bg-page)/70!"
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
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {
                      colorsList.map((color, index) => {
                        const isChecked = formValues.colors.includes(color.value)
                        const qty = getColorQuantity(
                          baleData.product.colors.find(c => c.color === color.value)?.id!
                        )

                        return (
                          <label
                            key={index}
                            className={`relative flex gap-2 items-center rounded-lg border p-2 cursor-pointer transition ${isChecked ? "border-(--primary) ring-1 ring-(--primary)"
                              : "border-(--border-default)" }`}
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

                            {color.node}
                            {color.label}
                          </label>
                        )
                      })
                    }
                  </div>
                </div>
              )}

              {activeColorId && (
                <>
                  <div className={`${hasSizes ? "h-80" : "h-auto" } my-4`}>
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
                              allocations[activeColorId].sizes[size.id]?.quantity ?? 0

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
                                    handler={() => {}}
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
                            {allocations[activeColorId].colorLabel}
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

              {/* Slots */}
              <div className="my-4 pt-4">
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

              {/* Mobile Tab List */}
              <div className="block md:hidden rounded-2xl bg-(--bg-surface) w-full mb-8">
                <Tabs defaultValue="specs">
                  <Tabs.List className="border-b border-(--border-default)">
                    <Tabs.Trigger
                      value="specs"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Specs</span>
                      <span className="hidden md:block">Specifications</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="shipping"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Shipping</span>
                      <span className="md:block hidden">Shipping Information</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="reviews"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Reviews</span>
                      <span className="md:block hidden">Product Reviews</span>
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="specs" className="pt-4">
                    Product details go here
                  </Tabs.Content>
                  <Tabs.Content value="shipping" className="pt-4">
                    Shipping details go here
                  </Tabs.Content>
                  <Tabs.Content value="reviews" className="pt-4">
                    Reviews content goes here
                  </Tabs.Content>
                </Tabs>
              </div>

              {/* Buttons for pool and cart */}
              <div className="mb-4 flex gap-4 items-center">
                <Button
                  primary
                  className="uppercase flex gap-2 items-center"
                  disabled={Boolean(formValues.slots == 0)}
                  onClick={joinPool}
                >
                  <RiRocket2Fill className="hidden md:block" />
                  Join Pool
                </Button>
                <Button
                  primary
                  className="uppercase ring-2 ring-(--primary) ring-inset text-(--primary)! bg-transparent"
                  disabled={Boolean(formValues.slots == 0)}
                  onClick={() => {
                    if (isAllocationExceeded) {
                      toast.error(
                        `You selected ${totalAllocatedQuantity} items, but only ${maxAllowedQuantity} are allowed for ${formValues.slots} slot(s).`
                      )
                      return
                    }

                    addToCart({
                      cartItemId: `cart-${baleData.baleId}`,
                      productId: baleData.productId,
                      baleId: baleData.baleId,
                      name: baleData.product.name,
                      image: baleData.product.images[2],
                      supplierId: `sup-${baleData.product.supplierId}`,
                      price: baleData.product.price,
                      originalPrice: baleData.product.oldPrice,
                      discount: 10,
                      currency: "NGN",
                      slots: formValues.slots,
                      totalSlots: baleData.slot,
                      totalShippingFee:
                        baleData.deliveryFee * formValues.slots,
                      quantity: productsPerSlot,
                      unit: "unit",
                      variants: selectedVariants,
                      items,
                      inStock: true,
                    });

                    toast.success("Product added to cart")
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALLOCATION DRAWER */}
      {/* {activeColorId && allocations[activeColorId] && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-90 transition-opacity ${isAllocationOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            onClick={() => setIsAllocationOpen(false)}
          />

          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-(--bg-surface)
            z-100 shadow-2xl transform transition-transform duration-300
            ${isAllocationOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-4 border-b border-(--border-default)">
              <h3 className="text-lg">
                Allocate Sizes — {allocations[activeColorId].colorLabel}
              </h3>
              <button
                onClick={() => setIsAllocationOpen(false)}
                className="text-xl font-bold"
              >
                ×
              </button>
            </div>

            
            <div className="p-4 flex flex-col h-full gap-3 overflow-y-auto">
              <div className="text-xs">
                <p>
                  Allocated:{" "}
                  <strong>{totalAllocatedQuantity}</strong> /{" "}
                  {maxAllowedQuantity}
                </p>

                {isAllocationExceeded && (
                  <p className="text-red-500 mt-1">
                    Allocation exceeds selected slots
                  </p>
                )}
              </div>
              
              {hasSizes && (
                <>
                  {sizesList.map(size => {
                    const qty =
                      allocations[activeColorId].sizes[size.id]?.quantity ?? 0

                    return (
                      <div
                        key={size.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{size.label}</span>

                        <Input
                          element="input"
                          input_type="number"
                          value={qty}
                          name="Quantity"
                          styling="w-24! p-2!"
                          handler={e =>
                            updateSizeQuantity(
                              activeColorId,
                              size.id,
                              size.label,
                              Number(e.target.value)
                            )
                          }
                          genStyle="my-0!"
                        />
                      </div>
                    )
                  })}
                </>
              )}

              
              {!hasSizes && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    Quantity — {allocations[activeColorId].colorLabel}
                  </span>

                  <Input
                    element="input"
                    input_type="number"
                    name="Allocation"
                    value={allocations[activeColorId].quantity ?? 0}
                    styling="w-24!"
                    handler={e =>
                      updateColorQuantity(
                        activeColorId,
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )} */}
    </>

  );
};

export default ProductDetails;
