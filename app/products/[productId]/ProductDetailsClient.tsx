"use client";

import { useGetBales, useGetSingleBale } from "@/api/bale";
import ProductImages from "@/components/product/ImageGallery";
import Countdown from "@/components/shared/Countdown";
import { Badge, Button } from "@/components/ui";
import { Tabs } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { getCrossSubdomainCookie } from "@/lib/utils";
import { FormValues } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  RiBankCardFill,
  RiCloseLine,
  RiGroup2Fill,
  RiLoader5Line,
} from "react-icons/ri";
import { toast } from "react-toastify";
import Recommended from "@/components/product/Recommended";
import ProductLogin from "@/components/product/ProductLogin";
import { useBuy } from "@/hooks/use-buy";
import { useProductAllocation } from "@/hooks/useProductAllocation";
import AllocationModal from "@/components/product/AllocationModal";

const ProductDetails = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    sizes: [],
    colors: [],
    slots: 1,
    directQty: 30
  });

  // State for switch
  const [buyDirectly, setBuyDirectly] = useState(false);

  // Buy modal
  const [showBuyModal, setShowBuyModal] = useState(false);

  // Show allocation modal
  const [showAllocationModal, setShowAllocationModal] = useState(false);

  // For login modal display
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  // Hooks
  const { productId } = useParams<{ productId: string }>();
  const { data: baleData, isLoading, error } = useGetSingleBale(productId);
  const { data: allBales = [], isPending: isBalesPending } = useGetBales({ categories: [], priceRange: { min: 0, max: 1000000 }, marketLocation: [] });
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToBuyCart } = useBuy();

  const productsPerSlot =
    baleData?.slot && baleData.slot > 0
      ? Math.floor(baleData.quantity / baleData.slot)
      : 0;

  const maxAllowedQuantity =
    formValues.slots * productsPerSlot

  const maxDirectAllowedQuantity =
    formValues.directQty

  const {
    allocations,
    setAllocations,
    activeColorId,
    setActiveColorId,
    totalAllocatedQuantity,
    increaseColorQty,
    decreaseColorQty,
    increaseSizeQty,
    decreaseSizeQty,
    getColorQuantity,
    handleCheckboxChange,
    hasColors,
    hasSizes,
    DEFAULT_COLOR_ID
  } = useProductAllocation({ baleData, buyDirectly, maxAllowedQuantity, maxDirectAllowedQuantity, setFormValues });

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
      </div>
    );
  }

  if (error || !baleData) {
    return <p>Error loading bale</p>;
  }

  const sizesList = Array.from(
    new Map(
      baleData.product.productSizes.map(s => [
        s.size.label,
        {
          id: s.size.id,
          value: s.size.label,
          label: s.size.label,
        }
      ])
    ).values()
  );

  const colorsList = baleData.product.colors.map(c => ({
    value: c.color,
    label: c.color,
    node: c.images.length > 0 ? (
      <img
        src={c.images[0]}
        alt={c.color}
        className="w-10 h-10 rounded-lg object-cover"
      />
    ) : null,
  }));

  const isAllocationExceeded =
    buyDirectly ?
      totalAllocatedQuantity > maxDirectAllowedQuantity :
      totalAllocatedQuantity > maxAllowedQuantity

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
      if (baleData) {
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

  const handleBuyNow = () => {
    if (isAllocationExceeded) {
      toast.error(
        `You selected ${totalAllocatedQuantity} items, but only ${maxDirectAllowedQuantity} are allowed for ${formValues.slots} slot(s).`
      )
      return
    }

    if (totalAllocatedQuantity !== maxDirectAllowedQuantity) {
      toast.error(`You must allocate exactly ${maxDirectAllowedQuantity} items.`)
      return
    }

    setShowBuyModal(false);

    const token = getCrossSubdomainCookie("440_token");

    if (!token) {
      setNotLoggedIn(true);
      return;
    }

    if (baleData) {
      addToBuyCart({
        cartItemId: `cart-${baleData.baleId}`,
        productId: baleData.productId,
        baleId: baleData.id,
        name: baleData.product.name,
        image: baleData.product.images[2],
        supplierId: baleData.product.supplierId,
        price: baleData.product.oldPrice,
        originalPrice: baleData.product.oldPrice,
        discount: 10,
        currency: "NGN",
        slots: formValues.slots,
        totalSlots: baleData.slot,
        totalShippingFee: baleData.deliveryFee * formValues.slots,
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

    router.push('/checkout?direct_order=true');
  };

  const handleAddToCart = () => {
    if (isAllocationExceeded) {
      toast.error(
        `You selected ${totalAllocatedQuantity} items, but only ${maxDirectAllowedQuantity} are allowed for ${formValues.slots} slot(s).`
      )
      return
    }

    if (totalAllocatedQuantity !== maxDirectAllowedQuantity) {
      toast.error(`You must allocate exactly ${maxDirectAllowedQuantity} items.`)
      return
    }

    setShowBuyModal(false);

    const token = getCrossSubdomainCookie("440_token");


    if (!token) {
      setNotLoggedIn(true);
      return;
    }

    if (baleData) {
      addToBuyCart({
        cartItemId: `cart-${baleData.baleId}`,
        productId: baleData.productId,
        baleId: baleData.id,
        name: baleData.product.name,
        image: baleData.product.images[2],
        supplierId: baleData.product.supplierId,
        price: baleData.product.oldPrice,
        originalPrice: baleData.product.oldPrice,
        discount: 10,
        currency: "NGN",
        slots: formValues.slots,
        totalSlots: baleData.slot,
        totalShippingFee: baleData.deliveryFee * formValues.slots,
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

      toast.success("Added to cart");
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

  const filteredBales = allBales?.filter(bale => bale.id != Number(productId));

  const remainingColors = colorsList.length - 5;

  const openBuy = () => {
    setBuyDirectly(true);
    setShowAllocationModal(true);
  }

  const openPool = () => {
    setBuyDirectly(false);
    setShowAllocationModal(true);
  }

  return (
    <>
      <section className="pt-[86px] md:pt-24 mb-16">
        <div className="px-2 md:px-10 lg:px-32 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4">

            {/* LEFT */}
            <div className="md:basis-2/3 md:sticky md:top-24">
              <div className="bg-(--bg-surface) p-6 rounded-xl mb-2 md:mb-8">
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
              <div>
                <h1 className="text-2xl font-bold">{baleData.product.name}</h1>
                <div className="my-4">
                  <div className="flex flex-wrap items-end gap-2">
                    <p className="text-3xl md:text-4xl text-(--primary) font-bold">&#8358;{formatPrice(baleData.price)}</p>
                    <p className="text-(--text-muted) line-through">&#8358;{formatPrice(baleData.oldPrice)}</p>
                  </div>
                </div>

                <div className="">
                  <h3 className="text-lg font-bold mb-2">Variations</h3>

                  {colorsList.length > 0 && (
                    <div className="mb-4">
                      <p className="uppercase text-sm font-semibold text-(--text-muted)">
                        Colors
                      </p>
                      {/* Color selection (unchanged UI, just wired) */}
                      <div className={`flex flex-wrap items-stretch gap-2 mt-1`}>
                        {
                          colorsList.slice(0, 4).map((color, index) => {
                            return (
                              <div
                                key={index}
                                className={`relative flex gap-2 items-center rounded-lg border p-2 cursor-pointer transition border-(--border-default) h-fit`}
                              >
                                {color.node != null && color.node}
                                {color.node == null && color.label}
                              </div>
                            )
                          })
                        }

                        {remainingColors > 0 && (
                          <div className="px-4 rounded-lg bg-(--primary-soft) text-(--primary) flex items-center justify-center text-xl font-medium border border-white">
                            +{remainingColors}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col h-full gap-3 overflow-y-auto mb-3">
                    
                    {
                      hasSizes && (
                        <>
                          <p className="uppercase text-sm font-semibold text-(--text-muted)">
                            Sizes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {
                              sizesList.map(size => (
                                <span key={size.id} className="px-2 py-1 rounded bg-(--primary-soft) cursor-pointer">{size.label}</span>
                              ))
                            }
                          </div>
                        </>
                        
                      )
                    }
                  </div>
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
              <div className="mt-8 mb-4 flex gap-4 items-center">
                <Button
                  primary
                  className={`uppercase gap-2 items-center`}
                  disabled={Boolean(formValues.slots == 0)}
                  onClick={openBuy}
                >
                  <RiBankCardFill className="block" />
                  Buy
                </Button>
                <Button
                  primary
                  className={`uppercase ring-2 ring-(--primary) ring-inset text-(--primary)! bg-transparent`}
                  disabled={Boolean(formValues.slots == 0)}
                  onClick={openPool}
                >
                  <RiGroup2Fill className="block" />
                  Join Pool
                </Button>
              </div>
            </div>
          </div>

          <Recommended products={filteredBales} />
        </div>
      </section>

      {/* ALLOCATION DRAWER */}
      {notLoggedIn && (
        <ProductLogin
          baleData={baleData}
          totalAllocatedQuantity={totalAllocatedQuantity}
          maxAllowedQuantity={maxAllowedQuantity}
          maxDirectAllowedQuantity={maxDirectAllowedQuantity}
          formValues={formValues}
          selectedVariants={selectedVariants}
          items={items}
          buyDirectly={buyDirectly}
          setNotLoggedIn={setNotLoggedIn}
        />
      )}

      {/* Buy modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-(--bg-surface) rounded-xl p-6 w-[90%] max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Continue with your purchase
              </h3>
              <button
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => setShowBuyModal(false)}
              >
                <RiCloseLine size={24} />
              </button>
            </div>

            <p className="text-sm mb-6">
              You can buy this item now or add it to your cart to purchase later
            </p>

            <div className="flex gap-4">
              <Button
                primary
                className="flex-1 uppercase"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>

              <Button
                primary
                className="flex-1 ring-2 ring-(--primary) bg-transparent text-(--primary)! uppercase"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Modal */}
      {showAllocationModal && (
        <AllocationModal
          isModalOpen={showAllocationModal}
          setIsModalOpen={setShowAllocationModal}
          baleData={baleData}
          formatPrice={formatPrice}
          productsPerSlot={productsPerSlot}
          colorsList={colorsList}
          formValues={formValues}
          setFormValues={setFormValues}
          getColorQuantity={getColorQuantity}
          handleCheckboxChange={handleCheckboxChange}
          activeColorId={activeColorId}
          hasSizes={hasSizes}
          sizesList={sizesList}
          isAllocationExceeded={isAllocationExceeded}
          allocations={allocations}
          setAllocations={setAllocations}
          decreaseSizeQty={decreaseSizeQty}
          increaseSizeQty={increaseSizeQty}
          decreaseColorQty={decreaseColorQty}
          increaseColorQty={increaseColorQty}
          handleChange={handleChange}
          buyDirectly={buyDirectly}
          joinPool={joinPool}
          handleBuyNow={handleBuyNow}
          handleAddToCart={handleAddToCart}
        />
      )}
    </>

  );
};

export default ProductDetails;