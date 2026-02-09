import React from 'react'
import { Button, Card } from '../ui'
import BG from "@/public/images/bg1.jpg";
import Image from 'next/image';
import { industries } from "./data";
import Link from 'next/link';

const Header = () => {
  return (
    <header className="h-110 md:h-120 flex items-stretch gap-4 md:px-20 pt-36 md:pt-24">
      <div className="hidden md:block md:w-80">
        <Card className='h-full p-0! overflow-hidden'>
          <div className="py-3 px-6 bg-(--bg-muted)">
            <h4 className="text-xl">Categories</h4>
          </div>
          <div className="overflow-y-auto h-full pb-4">
            {
              industries.map((industry, index) => (
                <Link key={index} href={''} className="py-2 px-6 border-b border-(--border-default) flex items-center gap-2">
                  { industry.icon }
                  { industry.name }
                </Link>
              ))
            }
          </div>
        </Card>
      </div>
      <div className="relative h-full w-full flex-1 md:rounded-xl">
        <Image src={BG} alt="" className="w-full h-full object-cover md:rounded-xl" />
        <div className="w-full h-full bg-black/50 absolute top-0 left-0 md:flex flex-col justify-center px-4 lg:px-20 text-white md:rounded-xl pt-6">
          <h1 className="text-3xl lg:text-5xl">
            Join <br /> <span className="text-(--primary)">Africa's Only</span> <br /> Demand Pool
          </h1>
          <p className="my-2 lg:my-3 max-w-150 font-light">
            Get direct from factory prices without meeting the minimum order requirements. Source from globally verified suppliers.
          </p>
          <Button primary className='w-fit'>
            Request For Quotation
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
