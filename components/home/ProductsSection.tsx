import Link from 'next/link';
import { RiArrowRightSLine } from 'react-icons/ri';
import PowerBank from "@/assets/images/download.png";
import Inverter from "@/assets/images/inverter.jpg";
import Steel from "@/assets/images/steel.jpg";
import Watch from "@/assets/images/watch.jpg";
import { Button, Card, Progress } from '../ui';
import Image from 'next/image';

const ProductsSection = () => {
  const products = [
    {
      id: "industrial-inverter-welder",
      name: "Heavy Duty Industrial Inverter Welder – Series X",
      category: "machinery",
      image: Inverter,
      price: 185.0,
      oldPrice: 240.0,
      unit: "per unit",
      minOrder: 500,
      discountPercent: 22,
      rating: 4.5,
      isGroupBuy: true,
      quantity: 1500,
      quantity_sold: 700
    },
    {
      id: "lithium-storage-battery",
      name: "Deep Cycle Lithium Storage Battery – 100Ah/12V Pack",
      category: "energy",
      image: PowerBank,
      price: 72.5,
      oldPrice: 96.0,
      unit: "per pack",
      minOrder: 100,
      discountPercent: 45,
      rating: 4.6,
      isGroupBuy: true,
      quantity: 500,
      quantity_sold: 270
    },
    {
      id: "smartwatch-series-x-ultra",
      name: "Smart Watch Series X Ultra – Wholesale Batch",
      category: "electronics",
      image: Watch,
      price: 6.4,
      oldPrice: 12.0,
      unit: "per unit",
      minOrder: 5000,
      discountPercent: 95,
      rating: 4.2,
      isGroupBuy: true,
      quantity: 1000,
      quantity_sold: 762
    },
    {
      id: "galvanized-structural-steel-beams",
      name: "Galvanized Structural Steel Beams – Bulk Bale",
      category: "machinery",
      image: Steel,
      price: 410.0,
      oldPrice: 560.0,
      unit: "per bale",
      minOrder: 100,
      discountPercent: 23,
      rating: 4.7,
      isGroupBuy: true,
      quantity: 1200,
      quantity_sold: 900
    },
  ];

  return (
    <section className='my-10 md:my-20'>
      <div className="px-4 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end">
          <div>
            <p className="text-sm font-bold text-(--primary) uppercase">Limited Time</p>
            <h2 className="text-2xl lg:text-3xl">Featured Bulk Deals</h2>
          </div>
          <Link href={''} className='flex gap-1 items-center text-(--primary)'>
            View all active bales
            <RiArrowRightSLine />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8 my-4">
          {
            products.map(product => (
              <Card 
                key={product.id}
                className='p-0!'
              >
                <Image src={product.image} alt='' className='w-full aspect-square rounded-t-2xl' />
                <div className="p-2 md:p-4">
                  <p className="md:text-lg font-bold truncate">{product.name}</p>
                  <div className="mt-1">
                    <div className="flex items-end gap-2">
                      <p className="text-lg md:text-2xl text-(--primary) font-bold">${product.price}</p>
                      <p className="text-(--text-muted) line-through">${product.oldPrice}</p>
                    </div>
                    <p className="uppercase text-sm hidden md:block">Unit Price (At Goal)</p>
                  </div>
                  <div className="my-2">
                    <div className="flex justify-between flex-wrap">
                      <p className="font-bold text-sm hidden md:block">Goal: {product.quantity} units</p>
                      <p className="font-bold text-(--primary) text-sm">{Math.ceil((product.quantity_sold / product.quantity)* 100) }% joined</p>
                    </div>
                    <Progress 
                      totalQty={product.quantity}
                      currentQty={product.quantity_sold}
                      className='my-0!'
                    />
                  </div>
                  <Button primary isFullWidth className='mt-2 py-2! md:py-3! rounded-xl! md:rounded-2xl!'>
                    Join Pool
                  </Button>
                </div>
              </Card>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
