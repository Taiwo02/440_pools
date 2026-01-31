"use client"

import { useGetSingleBale } from "@/api/bale"
import ProductImages from "@/components/product/ImageGallery"
import Countdown from "@/components/shared/Countdown"
import { Alert, Badge, Button, Input, Progress } from "@/components/ui"
import { Tabs } from "@/components/ui/tabs"
import { Bale } from "@/types/types"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useEffectEvent, useRef, useState } from "react"
import { RiGroup2Fill, RiGroupFill, RiLoader5Line, RiRocket2Fill, RiShieldCheckFill, RiShip2Fill, RiStarFill, RiStarHalfFill, RiTimeFill } from "react-icons/ri"

const ProductDetails = () => {
  const [formValues, setFormValues] = useState({
    sizes: [],
    slots: 0,
    colors: []
  });

  const params = useParams<{ productId: string }>();
  const id = params?.productId;
  const { data: baleData, isPending, error } = useGetSingleBale(id as string);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const imageRef = useRef(null!);

  useEffect(() => {
    if(baleData) console.log(baleData);
    console.log(id);
  }, [baleData]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    setFormValues((prev: any) => {
      const values = prev[name] || [];
      return {
        ...prev,
        [name]: checked
          ? [...values, value]
          : values.filter((v: string) => v !== value),
      };
    });
  };

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = e.target;

  //   setSizes(prev =>
  //     checked
  //       ? [...prev, value]
  //       : prev.filter(size => size !== value)
  //   );
  // };

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

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", { maximumFractionDigits: 0 })
  }

  // const colorsInput = ["red", "white", "black", "yellow"];

  if(isPending) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <RiLoader5Line size={48} className='animate-spin text-(--primary)' />
      </div>
    )
  }

  if (error) return <p>Error loading bale</p>;

  const productsPerSlot = baleData?.quantity / baleData?.slot
  const imageList = baleData?.product.images.slice(1);
  
  const sizesList = baleData?.product.productSizes.map(size => ({
    id: size.id,
    label: size.size.label
  }));

  return (
    <section className='pt-24 mb-10 md:mb-16'>
      <div className="px-4 md:px-10 lg:px-20 flex flex-col gap-8 items-start">
        <div className="flex flex-col md:flex-row gap-8 items-start w-full">
          <div className="w-full md:basis-1/2 lg:basis-4/5">
            <div className="bg-(--bg-surface) p-4 md:p-6 rounded-xl md:mb-8">
              <ProductImages 
                imageList={imageList} 
              />
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
          <div className="w-full md:basis-1/2 lg:basis:1/5 bg-(--bg-surface) p-4 md:p-6 rounded-xl sticky top-0">
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
            {/* <div className="w-full md:w-fit flex gap-4 items-stretch mb-4 p-4 rounded-xl bg-(--bg-page) border border-(--border-default)">
              <div className="flex flex-col gap-1">
                <p className="text-(--text-muted) uppercase">10-100 Units</p>
                <p className="text-xl font-bold">$1.50</p>
              </div>
              <div className="border border-(--border-default)"></div>
              <div className="flex flex-col gap-1">
                <p className="text-(--text-muted) uppercase">100-500 Units</p>
                <p className="text-xl font-bold">$1.50</p>
              </div>
              <div className="border border-(--border-default)"></div>
              <div className="flex flex-col gap-1">
                <p className="text-(--text-muted) uppercase">500+ Units</p>
                <p className="text-xl font-bold">$1.50</p>
              </div>
            </div> */}
            <div className="rounded-xl p-4 bg-(--primary-soft) border-2 border-(--primary) mb-4">
              <div className="flex md:items-end justify-between">
                <div className="flex flex-col gap-2">
                  <div className="hidden md:flex gap-2 items-center text-(--primary)">
                    <RiGroupFill />
                    <h2 className="text-xl uppercase"><span className="hidden md:block"></span> Bale Progress</h2>
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
                * 1 slot = { productsPerSlot } products
              </Alert>
            </div>
            <div className="mb-4 flex flex-col gap-4">
              <div>
                <p className="text-(--text-muted) uppercase font-semibold">Sizes</p>
                <div className="flex flex-wrap gap-1">{
                  sizesList?.map(size => (
                    <Input
                      key={size.id}
                      element="input"
                      input_type="checkbox"
                      name="sizes"
                      value={formValues.sizes}
                      handler={handleCheckboxChange}
                      checkboxOptions={[size.label]}
                      genStyle="my-0!"
                      styling="p-2!"
                    />
                  ))
                }</div>
              </div>
              {/* <div>
                <p className="text-(--text-muted) uppercase font-semibold">Colors</p>
                <div className="flex gap-1">
                  {
                    colorsInput.map((color, index) => (
                      <Input
                        key={index}
                        element="input"
                        input_type="checkbox"
                        name="colors"
                        value={formValues.colors}
                        handler={handleCheckboxChange}
                        checkboxOptions={[`${color}`]}
                        genStyle="my-0!"
                        styling={`p-2! rounded-full! ${color == "black" || color == "white" ? `bg-${color}` : `bg-${color}-500`}`}
                        invisible
                      />
                    ))
                  }
                </div>
              </div> */}
            </div>
            <div className="mb-4 flex flex-col gap-4">
              <div>
                <p className="text-(--text-muted) uppercase font-semibold">Slots</p>
                <div className="flex items-stretch">
                  <Button
                    className="rounded-r-none rounded-l-xl! py-2!"
                    disabled={Boolean(formValues.slots == 0)}
                    onClick={() =>
                      setFormValues(prev => ({
                        ...prev,
                        slots: prev.slots == 0 ? 0 : prev.slots - 1
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
                    value={formValues.slots}
                    handler={handleChange}
                    genStyle="my-0!"
                    styling="rounded-none p-2! focus:outline-none! disabled w-30!"
                  />
                  <Button
                    className="rounded-l-none rounded-r-xl! py-2!"
                    onClick={() =>
                      setFormValues(prev => ({
                        ...prev,
                        slots: prev.slots + 1
                      }))
                    }
                    primary
                  >
                    +
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-(--text-muted) uppercase font-semibold">Total Estimated Price</p>
                <p className="uppercase font-bold text-3xl">
                  &#8358;{
                    formValues.slots == 0 ? "0" :
                      formatPrice((formValues.slots * productsPerSlot * baleData.price) + baleData.deliveryFee)
                  }
                  <i className="text-(--text-muted) text-xs font-normal">(+ Shipping)</i>
                </p>
              </div>
            </div>
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
            <div className="mb-4 flex gap-4 items-center">
              <Button primary className="uppercase flex gap-2 items-center">
                <RiRocket2Fill className="hidden md:block" />
                Join Pool
              </Button>
              <Button primary className="uppercase ring-2 ring-(--primary) ring-inset text-(--primary)! bg-transparent">
                Add to Cart
              </Button>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex gap-2 items-center">
                <RiShip2Fill className="text-(--primary)" />
                <p className="text-xs text-(--text-muted)">Est. Delivery: Oct 24 - 28</p>
              </div>
              <div className="flex gap-2 items-center">
                <RiShieldCheckFill className="text-(--primary)" />
                <p className="text-xs text-(--text-muted)">Quality Assurance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
