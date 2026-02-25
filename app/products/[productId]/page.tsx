"use client";

import { useLoginMutation } from "@/api/auth";
import { useGetBales, useGetSingleBale } from "@/api/bale";
import ProductImages from "@/components/product/ImageGallery";
import UserBubbles from "@/components/product/UserBubble";
import Countdown from "@/components/shared/Countdown";
import { Alert, Badge, Button, Card, Input, Progress } from "@/components/ui";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { getCrossSubdomainCookie } from "@/lib/utils";
import { Login } from "@/types/types";
import { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  RiGroupFill,
  RiLoader5Line,
  RiRocket2Fill
} from "react-icons/ri";
import { toast } from "react-toastify";
import Recommended from "@/components/product/Recommended";

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

  // Login form state
  const [loginValues, setLoginValues] = useState<Login>({
    phone: '',
    password: ''
  });

  // Login endpoint
  const { mutateAsync: loginUser, isPending: isLoginLoading } = useLoginMutation();

  // Authentication
  const { authenticate } = useAuth();

  // For color selection
  const [activeColorId, setActiveColorId] = useState<number | null>(null)
  const [allocations, setAllocations] = useState<AllocationState>({})

  // For login modal display
  const [notLoggedIn, setNotLoggedIn] = useState(false)

  // Hooks
  const { productId } = useParams<{ productId: string }>();
  const { data: baleData, isLoading, error } = useGetSingleBale(productId);
  const { data: allBales = [], isPending: isBalesPending, error: baleError } = useGetBales();
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    console.log("baleData changed:", baleData);
  }, [baleData]);

  useEffect(() => {
    if (!baleData) return
    console.log(baleData)

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
  }, [baleData]);

  const hasColors = baleData!?.product?.colors.length > 0
  const DEFAULT_COLOR_ID = 0

  useEffect(() => {
    if (!baleData) return;

    if (!hasColors) {
      setActiveColorId(DEFAULT_COLOR_ID);

      setAllocations(prev => ({
        ...prev,
        [DEFAULT_COLOR_ID]: prev[DEFAULT_COLOR_ID] ?? {
          colorId: DEFAULT_COLOR_ID,
          colorLabel: "Default",
          colorImages: baleData.product.images ?? [],
          sizes: {},
          quantity: 0,
        }
      }));
    }
  }, [baleData, hasColors]);

  if (error || !baleData) return <p>Error loading bale</p>;

  const productsPerSlot =
    baleData.slot > 0
      ? Math.floor(baleData.quantity / baleData.slot)
      : 0;

  const sizesList = baleData.product.productSizes.map(s => ({
    id: s.size.id,
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

  const hasSizes = sizesList.length > 0

  const updateSizeQuantity = (
    colorId: number,
    sizeId: number,
    sizeLabel: string,
    quantity: number
  ) => {
    setAllocations(prev => {
      const existingColor = prev[colorId] ?? {
        colorId,
        colorLabel: baleData?.product.colors.find(c => c.id === colorId)?.color ?? "",
        colorImages: baleData?.product.colors.find(c => c.id === colorId)?.images ?? [],
        sizes: {},
        quantity: 0,
      }

      return {
        ...prev,
        [colorId]: {
          ...existingColor,
          sizes: {
            ...existingColor.sizes,
            [sizeId]: {
              sizeId,
              sizeLabel,
              quantity
            }
          }
        }
      }
    })
  }

  const updateColorQuantity = (
    colorId: number,
    quantity: number
  ) => {
    setAllocations(prev => {
      const existingColor = prev[colorId] ?? {
        colorId,
        colorLabel: baleData?.product.colors.find(c => c.id === colorId)?.color ?? "",
        colorImages: baleData?.product.colors.find(c => c.id === colorId)?.images ?? [],
        sizes: {},
        quantity: 0,
      }

      return {
        ...prev,
        [colorId]: {
          ...existingColor,
          quantity
        }
      }
    })
  }

  const increaseSizeQty = (
    colorId: number,
    sizeId: number,
    sizeLabel: string
  ) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentTotal = totalAllocatedQuantity;
    if (currentTotal >= maxAllowedQuantity) return;

    const currentQty =
      allocations[resolvedColorId]?.sizes?.[sizeId]?.quantity ?? 0;

    updateSizeQuantity(resolvedColorId, sizeId, sizeLabel, currentQty + 1);
  };

  const decreaseSizeQty = (
    colorId: number,
    sizeId: number,
    sizeLabel: string
  ) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentQty =
      allocations[resolvedColorId]?.sizes?.[sizeId]?.quantity ?? 0;

    if (currentQty <= 0) return;

    updateSizeQuantity(resolvedColorId, sizeId, sizeLabel, currentQty - 1);
  };

  const increaseColorQty = (colorId: number) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentTotal = totalAllocatedQuantity;
    if (currentTotal >= maxAllowedQuantity) return;

    const currentQty = allocations[resolvedColorId]?.quantity ?? 0;

    updateColorQuantity(resolvedColorId, currentQty + 1);
  };

  const decreaseColorQty = (colorId: number) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const currentQty = allocations[resolvedColorId]?.quantity ?? 0;

    if (currentQty <= 0) return;

    updateColorQuantity(resolvedColorId, currentQty - 1);
  };

  const getColorQuantity = (colorId: number) => {
    const resolvedColorId = hasColors ? colorId : DEFAULT_COLOR_ID;

    const allocation = allocations[resolvedColorId];
    if (!allocation) return 0;

    if (hasSizes) {
      return Object.values(allocation.sizes ?? {}).reduce(
        (sum, s) => sum + (s.quantity ?? 0),
        0
      );
    }

    return allocation.quantity ?? 0;
  };

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
    if (isAllocationExceeded) {
      toast.error(
        `You selected ${totalAllocatedQuantity} items, but only ${maxAllowedQuantity} are allowed for ${formValues.slots} slot(s).`
      )
      return
    }

    if (totalAllocatedQuantity !== maxAllowedQuantity) {
      toast.error(`You must allocate exactly ${maxAllowedQuantity} items.`)
      return
    }

    const token = getCrossSubdomainCookie("440_token");
    if (!token) {
      setNotLoggedIn(true);
    } else {
      if(baleData) {
        addToCart({
          cartItemId: `cart-${baleData.baleId}`,
          productId: baleData.productId,
          baleId: baleData.id,
          name: baleData.product.name,
          image: baleData.product.images[2],
          supplierId: baleData.product.supplierId,
          price: baleData.product.price,
          originalPrice: baleData.product.oldPrice,
          discount: 10,
          currency: "NGN",
          slots: formValues.slots,
          totalSlots: baleData.slot,
          totalShippingFee:
            baleData.deliveryFee * formValues.slots,
          quantity: totalAllocatedQuantity,
          unit: "unit",
          variants: selectedVariants,
          createdAt: baleData.createdAt,
          updatedAt: baleData.updatedAt,
          description: baleData.product.description,
          status: Boolean(baleData.status == "OPEN"),
          endIn: baleData.endIn,
          items,
          inStock: true,
        });

        router.push('/checkout');
      }
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 })
  }

  const cleanedAllocations = Object.fromEntries(
    Object.entries(allocations).filter(([_, color]) => {
      if (hasSizes) {
        return Object.values(color.sizes).some(s => s.quantity > 0)
      }
      return (color.quantity ?? 0) > 0
    })
  )

  const items = Object.values(cleanedAllocations).flatMap(color => {

    const hasValidColor = color.colorId && color.colorId !== 0;

    // WITH SIZES
    if (hasSizes) {
      return Object.values(color.sizes)
        .filter(s => s.quantity > 0)
        .map(s => ({
          size: {
            id: s.sizeId,
            label: s.sizeLabel,
            type: baleData.product?.productSizes?.[0]?.size?.type,
            formart: baleData.product?.productSizes?.[0]?.size?.formart,
          },
          ...(hasValidColor && {
            color: {
              id: color.colorId,
              color: color.colorLabel,
              images: color.colorImages,
              productId: baleData.product.id,
              status: true,
            }
          }),

          quantity: s.quantity,
          totalPrice: s.quantity * baleData.product.price,
        }));
    }

    // NO SIZES
    if (!color.quantity || color.quantity <= 0) return [];

    return [{
      ...(hasValidColor && {
        color: {
          id: color.colorId,
          color: color.colorLabel,
          images: color.colorImages,
          productId: baleData.product.id,
          status: true,
        }
      }),

      quantity: color.quantity,
      totalPrice: color.quantity * baleData.product.price,
    }];
  });

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
    formValues.slots * productsPerSlot

  const isAllocationExceeded =
    totalAllocatedQuantity > maxAllowedQuantity

  // Handle login input state
  const handleLoginChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setLoginValues(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Login form submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { phone, password } = loginValues;

    try {
      const data: Login = {
        phone,
        password
      }
      const res = await loginUser(data);
      if (res.status === 200) {
        toast.success(`Login successfully`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const token = res.data?.token;
        const user = res.data;
        authenticate({ user, token });

        if (baleData) {
          if (totalAllocatedQuantity !== maxAllowedQuantity) {
            toast.error(`You must allocate exactly ${maxAllowedQuantity} items.`)
            return
          }
          addToCart({
            cartItemId: `cart-${baleData.baleId}`,
            productId: baleData.productId,
            baleId: baleData.id,
            name: baleData.product.name,
            image: baleData.product.images[2],
            supplierId: baleData.product.supplierId,
            price: baleData.product.price,
            originalPrice: baleData.product.oldPrice,
            discount: 10,
            currency: "NGN",
            slots: formValues.slots,
            totalSlots: baleData.slot,
            totalShippingFee:
              baleData.deliveryFee * formValues.slots,
            quantity: totalAllocatedQuantity,
            unit: "unit",
            variants: selectedVariants,
            createdAt: baleData.createdAt,
            updatedAt: baleData.updatedAt,
            description: baleData.product.description,
            status: Boolean(baleData.status == "OPEN"),
            endIn: baleData.endIn,
            items,
            inStock: true,
          });
        }
         
        router.push('/checkout');
      } else {
        toast.success(`Something went wrong`, {
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
      toast.success(
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

  const filteredBales = allBales?.filter(bale => bale.id != Number(productId));

  if (isBalesPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
      </div>
    );
  }

  if (baleError) {
    return (
      <div className="flex justify-center items-center w-full my-24">
        <p className="text-xl">Product not found</p>
      </div>
    )
  }

  return (
    <>
      <section className="pt-36 md:pt-24 mb-16">
        <div className="px-2 md:px-10 lg:px-32 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start gap-4">
            
            {/* LEFT */}
            <div className="md:basis-2/3">
              <div className="bg-(--bg-surface) p-6 rounded-xl mb-8">
                <ProductImages imageList={baleData.product.images} countdown={<Countdown endDate={baleData.endIn} />} />
              </div>
              <div className="hidden md:block p-4 md:p-6 rounded-2xl bg-(--bg-surface) w-full mb-8">
                <Tabs defaultValue="reviews">
                  <Tabs.List className="border-b border-(--border-default)">
                    <Tabs.Trigger
                      value="reviews"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Reviews</span>
                      <span className="md:block hidden">Product Reviews</span>
                    </Tabs.Trigger>
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
                  </Tabs.List>

                  <Tabs.Content value="reviews" className="pt-4">
                    Reviews content goes here
                  </Tabs.Content>
                  <Tabs.Content value="specs" className="pt-4">
                    Product details go here
                  </Tabs.Content>
                  <Tabs.Content value="shipping" className="pt-4">
                    Shipping details go here
                  </Tabs.Content>
                </Tabs>
              </div>
              {
                baleData?.product?.supplier &&
                <div className="p-4 rounded-lg bg-(--bg-surface) flex flex-col md:flex-row justify-between gap-4 items-center w-full mb-4">
                  <div className="flex items-center gap-4">
                    <img src={baleData?.product?.supplier?.image} alt="" className="w-16 aspect-square rounded-full" />
                    <div>
                      <h2 className="text-xl">{baleData?.product?.supplier?.name}</h2>
                      {
                        baleData?.product?.supplier?.status &&
                        <Badge variant="primary" className="font-semibold">Verified</Badge>
                      }
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button primary className="py-2! rounded-xl!">
                      View Profile
                    </Button>
                  </div>
                </div>
              }
            </div>

            {/* RIGHT */}
            <div className="md:basis-1/3 bg-(--bg-surface) p-6 rounded-xl md:sticky top-20 border border-(--border-default)">
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
                  <div className="grid grid-cols-2 gap-2 mt-1">
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

              {activeColorId !== null && (
                <>
                  <div className={`${hasSizes && sizesList.length > 5 ? "h-80" : "h-auto" } my-4`}>
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
                <Tabs defaultValue="reviews">
                  <Tabs.List className="border-b border-(--border-default)">
                    <Tabs.Trigger
                      value="reviews"
                      className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
                    >
                      <span className="block md:hidden">Reviews</span>
                      <span className="md:block hidden">Product Reviews</span>
                    </Tabs.Trigger>
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
                  </Tabs.List>

                  <Tabs.Content value="reviews" className="pt-4">
                    Reviews content goes here
                  </Tabs.Content>
                  <Tabs.Content value="specs" className="pt-4">
                    Product details go here
                  </Tabs.Content>
                  <Tabs.Content value="shipping" className="pt-4">
                    Shipping details go here
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
                  Checkout
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

                    if (totalAllocatedQuantity !== maxAllowedQuantity) {
                      toast.error(`You must allocate exactly ${maxAllowedQuantity} items.`)
                      return
                    }

                    addToCart({
                      cartItemId: `cart-${baleData.baleId}`,
                      productId: baleData.productId,
                      baleId: baleData.id,
                      name: baleData.product.name,
                      image: baleData.product.images[2],
                      supplierId: baleData.product.supplierId,
                      price: baleData.product.price,
                      originalPrice: baleData.product.oldPrice,
                      discount: 10,
                      currency: "NGN",
                      slots: formValues.slots,
                      totalSlots: baleData.slot,
                      totalShippingFee:
                        baleData.deliveryFee * formValues.slots,
                      quantity: totalAllocatedQuantity,
                      unit: "unit",
                      variants: selectedVariants,
                      createdAt: baleData.createdAt,
                      updatedAt: baleData.updatedAt,
                      description: baleData.product.description,
                      status: Boolean(baleData.status == "OPEN"),
                      endIn: baleData.endIn,
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

          <Recommended products={filteredBales} />
        </div>
      </section>

      {/* ALLOCATION DRAWER */}
      {notLoggedIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className='w-full md:w-150 md:p-12!'>
            <form onSubmit={handleSubmit}>
              <div className="my-4">
                <h1 className="text-3xl">Login</h1>
                <p className="text-(--text-muted)">Enter your details to log into your account</p>
              </div>
              <Input
                input_type="text"
                element="input"
                placeholder="Enter your phone number"
                tag="Phone Number"
                name="phone"
                value={loginValues.phone || ''}
                handler={handleLoginChange}
                required
              />
              <Input
                input_type="password"
                element="input"
                placeholder="Enter your password"
                tag="Password"
                name="password"
                value={loginValues.password || ''}
                handler={handleLoginChange}
                required
              />
              <div className="flex justify-end relative -top-4">
                <Link href={''} className='text-(--primary) font-semibold text-sm'>
                  Forgot Password?
                </Link>
              </div>
              <Button
                type='submit'
                isFullWidth
                primary
                isLoading={isLoginLoading}
              >
                {isLoginLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="text-center text-sm mt-3">
              Don't have an account? Click
              <Link href={'/account/register'} className='text-(--primary) font-semibold'> Here </Link>
              to register
            </p>
          </Card>
        </div>
      )}
    </>

  );
};

export default ProductDetails;
