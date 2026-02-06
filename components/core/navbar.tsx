"use client"

import { useState } from 'react'
import Dropdown from '../ui/dropdown'
import Button from '../ui/button'
import { RiAccountCircleLine, RiMessageLine, RiSearchLine, RiShoppingCartLine, RiComputerLine, RiFlashlightFill, RiGridFill, RiHeartPulseLine, RiSettings2Line, RiShirtFill, RiToolsFill, RiCloseLine, RiMenu3Line, RiArchive2Line, RiHome3Line, RiTShirtLine, RiFootballLine, RiSparklingLine, RiBriefcaseLine, RiHomeLine, RiRunLine, RiVipDiamondLine, RiFootprintLine, RiPrinterLine, RiParentLine, RiMedicineBottleLine, RiGiftLine, RiBugLine, RiBook2Line, RiBuilding2Line, RiStore2Line, RiBuildingLine, RiHome4Line, RiSofaLine, RiLightbulbLine, RiFridgeLine, RiCarLine, RiCarWashingLine, RiToolsLine, RiLeafLine, RiPlugLine, RiShieldCheckLine, RiTestTubeLine, RiSettingsLine, RiCpuLine, RiBusLine, RiPlantLine, RiBox3Line, RiServiceLine } from 'react-icons/ri'
import Link from 'next/link'
import { AnimatePresence, Variants, motion } from "framer-motion";
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import SearchForm from './search'
import { useCart } from '@/hooks/use-cart'

const Navbar = () => {
  const [category, setCategory] = useState('Electronics')
  const pathname = usePathname() ?? "/";
  const [isVisible, setIsVisible] = useState(false);

  const productCategories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty & Personal Care",
    "Sports & Fitness",
    "Groceries",
    "Health & Wellness",
    "Books & Stationery",
    "Toys & Games",
    "Automotive",
    "Furniture",
    "Jewelry & Accessories",
    "Phones & Gadgets",
    "Computers & Accessories",
    "Footwear",
    "Bags & Luggage",
    "Kitchen Appliances",
    "Office Supplies",
    "Pet Supplies",
    "Baby Products",
  ];
  const [searchTerm, setSearchTerm] = useState('')
  const { cart } = useCart();

  const navLinks = [
    {
      label: 'Products',
      href: '/products',
      icon: <RiArchive2Line />
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: <RiMessageLine />
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: <RiShoppingCartLine />
    },
    {
      label: 'Account',
      href: '/account',
      icon: <RiAccountCircleLine />
    },
  ]

  const industries = [
    { name: "Apparel & Accessories", icon: <RiTShirtLine />, href: "/categories/apparel-accessories" },
    { name: "Consumer Electronics", icon: <RiComputerLine />, href: "/categories/consumer-electronics" },
    { name: "Sports & Entertainment", icon: <RiFootballLine />, href: "/categories/sports-entertainment" },
    { name: "Beauty", icon: <RiSparklingLine />, href: "/categories/beauty" },
    { name: "Luggage, Bags & Cases", icon: <RiBriefcaseLine />, href: "/categories/luggage-bags-cases" },
    { name: "Home & Garden", icon: <RiHomeLine />, href: "/categories/home-garden" },
    { name: "Sportswear & Outdoor Apparel", icon: <RiRunLine />, href: "/categories/sportswear-outdoor-apparel" },
    { name: "Jewelry, Eyewear & Watches", icon: <RiVipDiamondLine />, href: "/categories/jewelry-eyewear-watches" },
    { name: "Shoes & Accessories", icon: <RiFootprintLine />, href: "/categories/shoes-accessories" },
    { name: "Packaging & Printing", icon: <RiPrinterLine />, href: "/categories/packaging-printing" },
    { name: "Parents, Kids & Toys", icon: <RiParentLine />, href: "/categories/parents-kids-toys" },
    { name: "Personal Care & Home Care", icon: <RiHeartPulseLine />, href: "/categories/personal-care-home-care" },
    { name: "Health & Medical", icon: <RiMedicineBottleLine />, href: "/categories/health-medical" },
    { name: "Gifts & Crafts", icon: <RiGiftLine />, href: "/categories/gifts-crafts" },
    { name: "Pet Supplies", icon: <RiBugLine />, href: "/categories/pet-supplies" },
    { name: "School & Office Supplies", icon: <RiBook2Line />, href: "/categories/school-office-supplies" },
    { name: "Industrial Machinery", icon: <RiBuilding2Line />, href: "/categories/industrial-machinery" },
    { name: "Commercial Equipment & Machinery", icon: <RiStore2Line />, href: "/categories/commercial-equipment-machinery" },
    { name: "Construction & Building Machinery", icon: <RiBuildingLine />, href: "/categories/construction-building-machinery" },
    { name: "Construction & Real Estate", icon: <RiHome4Line />, href: "/categories/construction-real-estate" },
    { name: "Furniture", icon: <RiSofaLine />, href: "/categories/furniture" },
    { name: "Lights & Lighting", icon: <RiLightbulbLine />, href: "/categories/lights-lighting" },
    { name: "Home Appliances", icon: <RiFridgeLine />, href: "/categories/home-appliances" },
    { name: "Automotive Supplies & Tools", icon: <RiCarLine />, href: "/categories/automotive-supplies-tools" },
    { name: "Vehicle Parts & Accessories", icon: <RiCarWashingLine />, href: "/categories/vehicle-parts-accessories" },
    { name: "Tools & Hardware", icon: <RiToolsLine />, href: "/categories/tools-hardware" },
    { name: "Renewable Energy", icon: <RiLeafLine />, href: "/categories/renewable-energy" },
    { name: "Electrical Equipment & Supplies", icon: <RiPlugLine />, href: "/categories/electrical-equipment-supplies" },
    { name: "Safety & Security", icon: <RiShieldCheckLine />, href: "/categories/safety-security" },
    { name: "Testing Instrument & Equipment", icon: <RiTestTubeLine />, href: "/categories/testing-instrument-equipment" },
    { name: "Power Transmission", icon: <RiSettingsLine />, href: "/categories/power-transmission" },
    { name: "Electronic Components", icon: <RiCpuLine />, href: "/categories/electronic-components" },
    { name: "Vehicles & Transportation", icon: <RiBusLine />, href: "/categories/vehicles-transportation" },
    { name: "Agriculture, Food & Beverage", icon: <RiPlantLine />, href: "/categories/agriculture-food-beverage" },
    { name: "Raw Materials", icon: <RiBox3Line />, href: "/categories/raw-materials" },
    { name: "Fabrication Services", icon: <RiServiceLine />, href: "/categories/fabrication-services" },
    { name: "Service", icon: <RiServiceLine />, href: "/categories/service" },
  ];

  // Mobile menu animations
  const list: Variants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
    exit: {
      x: "-100%",
      transition: { ease: "easeInOut" },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav className='fixed w-full z-50 shadow-sm'>
      <div className='bg-(--bg-surface) py-2 px-4 md:px-20 flex gap-12 items-center justify-between'>
        <Link href={'/'} className="text-2xl font-bold shrink-0 ">
          <img src="/images/440_Logo.png" alt="" width={70} height={70} className='text-5xl' />
        </Link>
        <div className="hidden lg:flex w-150">
          <SearchForm category={category} setCategory={setCategory} productCategories={productCategories} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </div>
        <ul className="hidden md:flex items-center gap-4 shrink-0 navBar">
          {
            navLinks.map((nav, index) => {
              const isActive =
                nav.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(nav.href);
              
              return (
                <li key={index}>
                  <Link href={nav.href} className={`flex items-center gap-2 ${ isActive && 'active' }`}>
                    {nav.icon}
                    {nav.label}
                  </Link>
                </li>
              )
            })
          }
        </ul>
        <div className="md:hidden flex items-center gap-3">
          <Link href={''} className="p-2 relative">
            <RiMessageLine />
          </Link>
          <Link href={'/cart'} className="p-2 relative">
            <RiShoppingCartLine />
            <div className="absolute w-4 h-4 rounded-full bg-red-500 flex justify-center items-center text-white text-[8px] font-bold top-0 right-0">
              { cart.length }
            </div>
          </Link>
          <button
            aria-label="Toggle menu"
            className="p-2 rounded-full bg-(--primary) text-white"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <RiCloseLine /> : <RiMenu3Line />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isVisible && (
          <motion.ul
            variants={list}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              fixed inset-x-0 z-40
              rounded-r-3xl bg-(--bg-surface) text-(--text-primary)
              p-4 w-[85%] h-screen top-0 shadow-lg
              md:hidden
            "
          >
            <motion.li
              variants={item}
              className="p-3"
              onClick={() => setIsVisible(false)}
            >
              <Link
                href={'/'}
                className={`flex items-center gap-2`}
              >
                <RiHome3Line />
                Home
              </Link>
            </motion.li>
            <motion.li
              variants={item}
              className="p-3"
              onClick={() => setIsVisible(false)}
            >
              <Link
                href={'/products'}
                className={`flex items-center gap-2`}
              >
                <RiArchive2Line />
                Products
              </Link>
            </motion.li>
            <motion.li
              variants={item}
              className="p-3 bg-(--bg-surface) absolute border-t border-(--border-default) w-full left-0 bottom-0"
              onClick={() => setIsVisible(false)}
            >
              <Link
                href={'/account'}
                className={`flex items-center gap-2`}
              >
                <RiAccountCircleLine />
                Account
              </Link>
            </motion.li>
            <motion.h2 
              className="text-lg mt-3"
              variants={item}
            >
              Categories
            </motion.h2>
            <div className="overflow-y-auto h-200">
              {industries.map((link, index) => {
                return (
                  <motion.li
                    key={index}
                    variants={item}
                    className="p-3 flex items-center gap-2"
                    onClick={() => setIsVisible(false)}
                  >
                    {link.icon}
                    {link.name}
                  </motion.li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
      <div className="flex md:hidden gap-2 items-center bg-(--bg-page) overflow-auto py-1 px-4 -mt-0.5">
        {/* {
          industries.map(industry => (
            <div key={industry.id} className='py-0.5 px-2 bg-(--primary) text-white rounded-full'>
              <span className='text-xs text-nowrap'>{industry.name}</span>
            </div>
          ))
        } */}
      </div>
      <div className="lg:hidden px-4 pb-2 bg-(--bg-surface)">
      <SearchForm category={category} setCategory={setCategory} productCategories={productCategories} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
    </nav>
    
  )
}

export default Navbar
