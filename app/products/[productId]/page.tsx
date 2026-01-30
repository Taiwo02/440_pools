"use client"

import { Badge, Button, Input, Progress } from "@/components/ui"
import { Tabs } from "@/components/ui/tabs"
import Image from "next/image"
import { useState } from "react"
import { RiGroup2Fill, RiGroupFill, RiRocket2Fill, RiShieldCheckFill, RiShip2Fill, RiStarFill, RiStarHalfFill, RiTimeFill } from "react-icons/ri"

const ProductDetails = () => {
  const supplierInfo = {
    id: "sup-001",
    name: "Shenzhen Tech Manufacturing",
    verifiedStatus: true,
    verificationType: "Gold Supplier",
    yearsActive: 8,
    country: "China",
    city: "Shenzhen",
    rating: 4.7,
    responseRate: 96,
    responseTime: "< 4 hrs",
    logo: "https://picsum.photos/seed/shenzhen-tech/200/200",
    badges: ["Verified", "On-time Delivery", "Trade Assurance"],
    mainProducts: ["Sensors", "Optical Modules", "Automation Parts"]
  }

  const productInfo = {
    id: 1,
    name: "Advanced Industrial Optical Sensor Module",
    priceRange: { min: 1.20, max: 1.50 },
    currency: "USD",
    unit: "unit",
    minOrder: 500,
    supplier: "Shenzhen Tech Manufacturing",
    category: "Sensors",
    tag: "Hot Sale",
    image: "https://picsum.photos/seed/sensor-module/600/600",
    imageAlt: "Industrial optical sensor module PCB"
  }

  const [formValues, setFormValues] = useState({
    sizes: [],
    quantity: 0,
  })
  const [sizes, setSizes] = useState<string[]>([])
  const [quantity, setQuantity] = useState(0)
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

  return (
    <section className='pt-24 mb-10 md:mb-16'>
      <div className="px-4 md:px-10 lg:px-20 flex flex-col gap-8 items-start">
        <div className="p-4 rounded-lg bg-(--bg-surface) flex flex-col md:flex-row justify-between gap-4 items-center w-full">
          <div className="flex items-center gap-4">
            <Image src={supplierInfo.logo} alt="" width={0} height={0} className="w-20 aspect-square rounded-full" />
            <div>
              <h2 className="text-xl">{ supplierInfo.name }</h2>
              <p className="text-(--text-muted)">{ supplierInfo.city }, { supplierInfo.country }</p>
              {
                supplierInfo.verifiedStatus &&
                <Badge primary className="font-semibold">{ supplierInfo.verificationType }</Badge>
              }
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <div className="mb-1">
                <p className="text-(--text-muted) uppercase text-xs">In Business</p>
                <p className="font-semibold">12 Years</p>
              </div>
              <div>
                <p className="text-(--text-muted) uppercase text-xs">Response Time</p>
                <p className="font-semibold">Less than 4 Hours</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-1">
                <p className="text-(--text-muted) uppercase text-xs">Rating</p>
                <p className="font-semibold">{ supplierInfo.rating } / 5.0</p>
              </div>
              <div>
                <p className="text-(--text-muted) uppercase text-xs">Transactions</p>
                <p className="font-semibold">5k+</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button primary className="py-2! rounded-xl!">
              View Supplier
            </Button>
            <Button className="py-2! rounded-xl!">
              Message Supplier
            </Button>
          </div>
        </div>

        <div className="p-2 md:p-8 rounded-2xl bg-(--bg-surface) flex flex-col md:flex-row justify-between gap-8 items-start w-full">
          <div className="w-full md:basis-1/4">
            <Image src={productInfo.image} alt="" width={0} height={0} className="w-full aspect-square rounded-xl" />
            <div className="grid grid-cols-4 gap-2 mt-3">
              <Image src={productInfo.image} alt="" width={0} height={0} className="w-full aspect-square rounded-xl" />
              <Image src={productInfo.image} alt="" width={0} height={0} className="w-full aspect-square rounded-xl" />
              <Image src={productInfo.image} alt="" width={0} height={0} className="w-full aspect-square rounded-xl" />
              <Image src={productInfo.image} alt="" width={0} height={0} className="w-full aspect-square rounded-xl" />
            </div>
          </div>
          <div className="basis-full md:basis-3/4">
            <h1 className="text-3xl lg:text-4xl">{ productInfo.name }</h1>
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
              <p className="text-(--text-muted) uppercase">SKU: fbf-2332</p>
            </div>
            <div className="w-full md:w-fit flex gap-4 items-stretch mb-4 p-4 rounded-xl bg-(--bg-page) border border-(--border-default)">
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
            </div>
            <div className="rounded-xl p-4 md:p-6 bg-(--primary-soft) border-2 border-(--primary) mb-4">
              <div className="flex md:items-end justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center text-(--primary)">
                    <RiGroupFill />
                    <h2 className="text-xl uppercase"><span className="hidden md:block"></span> Bale Progress</h2>
                  </div>
                  <p className="text-(--text-muted)">
                    <span className="text-lg md:text-2xl text-(--text-primary) font-bold">750 </span>
                    / 1000 units
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2 items-center text-(--text-muted)">
                    <RiTimeFill />
                    <p className="font-bold uppercase">Time Left</p>
                  </div>
                  <p className="text-lg md:text-2xl text-(--text-primary) font-bold">
                    14h:22m:09s
                  </p>
                </div>
              </div>
              <Progress
                totalQty={1000}
                currentQty={750}
                className='my-0!'
                progClass="bg-(--bg-page)/70!"
              />
            </div>
            <div className="mb-4">
              <p className="text-(--text-muted) uppercase font-semibold">Sizes</p>
              <Input
                element="input"
                input_type="checkbox"
                name="sizes"
                value={formValues.sizes}
                handler={handleCheckboxChange}
                checkboxOptions={["S", "M", "L", "XL", "XXL"]}
                genStyle="my-0!"
              />
            </div>
            <div className="mb-4 flex flex-col md:flex-row md:items-end gap-4">
              <div>
                <p className="text-(--text-muted) uppercase font-semibold">Quantity</p>
                <Input
                  element="input"
                  input_type="number"
                  name="quantity"
                  value={formValues.quantity}
                  handler={handleChange}
                  genStyle="my-0!"
                />
              </div>
              <div>
                <p className="text-(--text-muted) uppercase font-semibold">Total Estimated Price</p>
                <p className="uppercase font-bold text-3xl">
                  $650 
                  <i className="text-(--text-muted) text-xs font-normal">(+ Shipping)</i>
                </p>
              </div>
            </div>
            <div className="mb-4 flex gap-4 items-center">
              <Button primary className="uppercase flex gap-2 items-center">
                <RiRocket2Fill />
                Join Bale
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

        <div className="p-4 md:p-8 rounded-2xl bg-(--bg-surface) w-full">
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
      </div>
    </section>
  )
}

export default ProductDetails
