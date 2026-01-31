"use client"

import { useState } from 'react'
import Dropdown from '../ui/dropdown'
import Button from '../ui/button'
import { RiAccountCircleLine, RiMessageLine, RiSearchLine, RiShoppingCartLine, RiComputerLine, RiFlashlightFill, RiGridFill, RiHeartPulseLine, RiSettings2Line, RiShirtFill, RiToolsFill, RiCloseLine, RiMenu3Line, RiArchive2Line, RiHome3Line } from 'react-icons/ri'
import Link from 'next/link'
import { AnimatePresence, Variants, motion } from "framer-motion";
import { usePathname } from 'next/navigation'

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
    {
      id: "machinery",
      name: "Machinery",
      icon: <RiSettings2Line />,
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: <RiComputerLine />,
    },
    {
      id: "apparel",
      name: "Apparel",
      icon: <RiShirtFill />,
    },
    {
      id: "energy",
      name: "Energy",
      icon: <RiFlashlightFill />,
    },
    {
      id: "tools",
      name: "Tools",
      icon: <RiToolsFill />,
    },
    {
      id: "medical",
      name: "Medical",
      icon: <RiHeartPulseLine />,
    },
    {
      id: "all",
      name: "All Categories",
      icon: <RiGridFill />,
    },
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
        <Link href={'/'} className="text-2xl font-bold shrink-0"><img src="https://shop.4401.live/img/logos/440_Logo_GS-removebg.png" alt="" width="70px" height="70px" /></Link>
        <form className="hidden lg:flex items-stretch flex-1 min-w-0 border-2 border-(--primary) rounded-full">
          <Dropdown
            value={category}
            onChange={value => setCategory(value)}
            options={productCategories}
            className='p-3! rounded-l-full!'
            dropClass='w-50!'
          />
          <input
            className='w-full p-3 bg-(--bg-surface) border border-slate-200 focus:border focus:outline-(--primary) placeholder:text(--muted)'
            name='searchTerm'
            value={searchTerm}
            placeholder="Search for products, factories or global suppliers..."
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button primary className='flex gap-1 items-center rounded-r-full!'>
            <RiSearchLine />
            Search
          </Button>
        </form>
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
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-full bg-(--primary) text-white"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
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
            {navLinks.map((link, index) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <motion.li
                  key={index}
                  variants={item}
                  className="p-3"
                  onClick={() => setIsVisible(false)}
                >
                  <Link
                    href={link.href}
                    className={`${isActive ? "active" : ""} flex items-center gap-2`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
      <div className="flex md:hidden gap-2 items-center bg-(--bg-page) overflow-auto py-1 px-4 -mt-0.5">
        {
          industries.map(industry => (
            <div key={industry.id} className='py-0.5 px-2 bg-(--primary) text-white rounded-full'>
              <span className='text-xs text-nowrap'>{industry.name}</span>
            </div>
          ))
        }
      </div>
    </nav>
  )
}

export default Navbar
