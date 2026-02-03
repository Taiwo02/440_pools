import React from 'react'
import { RiComputerLine, RiFlashlightFill, RiGridFill, RiHeartPulseLine, RiSettings2Line, RiShirtFill, RiToolsFill } from 'react-icons/ri';
import { Card } from '../ui';

const ShopBy = () => {
  const industries = [
    {
      id: "machinery",
      name: "Machinery",
      icon: <RiSettings2Line size={20} />,
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: <RiComputerLine size={20} />,
    },
    {
      id: "apparel",
      name: "Apparel",
      icon: <RiShirtFill size={20} />,
    },
    {
      id: "energy",
      name: "Energy",
      icon: <RiFlashlightFill size={20} />,
    },
    {
      id: "tools",
      name: "Tools",
      icon: <RiToolsFill size={20} />,
    },
    {
      id: "medical",
      name: "Medical",
      icon: <RiHeartPulseLine size={20} />,
    },
    {
      id: "all",
      name: "All Categories",
      icon: <RiGridFill size={20} />,
    },
  ];

  return (
    <section className=' md:block my-10'>
      <div className="px-8 md:px-10 lg:px-20">
        <h2 className="text-xl lg:text-2xl">Shop By Industry</h2>
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 my-4">
          {
            industries.map(industry => (
              <Card key={industry.id} className='text-center flex flex-col  items-center gap-2 shadow-sm!'>
                <div className="p-4 w-fit mx-auto bg-(--primary-soft)/50 rounded-xl">
                  { industry.icon }
                </div>
                <p className="text-md font-bold">{ industry.name }</p>
              </Card>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default ShopBy
