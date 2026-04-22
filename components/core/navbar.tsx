"use client"

import { FormEvent, useEffect, useState } from "react";
import { RiAccountCircleLine, RiMessageLine, RiSearchLine, RiShoppingCartLine, RiComputerLine, RiFlashlightFill, RiGridFill, RiHeartPulseLine, RiSettings2Line, RiShirtFill, RiToolsFill, RiCloseLine, RiMenu3Line, RiArchive2Line, RiHome3Line, RiTShirtLine, RiFootballLine, RiSparklingLine, RiBriefcaseLine, RiHomeLine, RiRunLine, RiVipDiamondLine, RiFootprintLine, RiPrinterLine, RiParentLine, RiMedicineBottleLine, RiGiftLine, RiBugLine, RiBook2Line, RiBuilding2Line, RiStore2Line, RiBuildingLine, RiHome4Line, RiSofaLine, RiLightbulbLine, RiFridgeLine, RiCarLine, RiCarWashingLine, RiToolsLine, RiLeafLine, RiPlugLine, RiShieldCheckLine, RiTestTubeLine, RiSettingsLine, RiCpuLine, RiBusLine, RiPlantLine, RiBox3Line, RiServiceLine } from 'react-icons/ri'
import Link from 'next/link'
import { AnimatePresence, Variants, motion } from "framer-motion";
import { usePathname, useRouter } from 'next/navigation'
import SearchForm from './search'
import SupportMessagePanel from './SupportMessagePanel'
import { useBuy } from '@/hooks/use-buy';
import { useAuth } from '@/hooks/use-auth';

const Navbar = () => {
  const { user, authenticated } = useAuth();
  const isLoggedIn = Boolean(user) || authenticated;
  const router = useRouter();
  const [category, setCategory] = useState('Electronics')
  const pathname = usePathname() ?? "/";
  const hideCheckoutChrome = pathname.startsWith("/checkout");
  const [isVisible, setIsVisible] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    if (hideCheckoutChrome) {
      setIsVisible(false);
    }
  }, [hideCheckoutChrome]);

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
  const { buyCart } = useBuy();
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchTerm.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  const navLinks = [
    {
      label: 'Products',
      href: '/products',
      icon: <RiArchive2Line />
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: 
        <>
          <RiShoppingCartLine />
          <div className="absolute w-4 h-4 rounded-full bg-red-500 flex justify-center items-center text-white text-[8px] font-bold -top-1 left-2">
            {buyCart.length}
          </div>
        </>
    },
    {
      label: 'Account',
      href: '/account/overview',
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
    <>
    <nav
      className={`fixed z-50 w-full shadow-sm ${
        hideCheckoutChrome ? "hidden" : ""
      }`}
    >
      {/* Mobile / tablet — 1688-style: logo row + search + sign in */}
      <div className="border-b border-(--border-default) bg-(--bg-surface) lg:hidden">
        <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-2">
          <Link href="/" className="shrink-0 flex items-center gap-2 min-w-0">
            <img
              src="/images/440_Logo.png"
              alt="440"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-sm font-bold text-(--primary) truncate"></span>
          </Link>
          <button
            type="button"
            aria-label="Menu"
            className="shrink-0 p-2 rounded-lg border border-(--border-default) text-(--text-primary)"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <RiCloseLine className="text-xl" /> : <RiMenu3Line className="text-xl" />}
          </button>
        </div>
        <form
          className="flex items-stretch gap-2 px-3 pb-2.5"
          onSubmit={handleSearchSubmit}
        >
          <div className="flex flex-1 min-w-0 items-stretch rounded-full border-2 border-(--primary) overflow-hidden bg-(--bg-surface)">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, pools & suppliers"
              className="min-w-0 flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none placeholder:text-(--text-muted)"
              aria-label="Search"
            />
            <button
              type="submit"
              className="shrink-0 flex items-center justify-center px-3 bg-(--primary) text-white"
              aria-label="Search"
            >
              <RiSearchLine className="text-lg" />
            </button>
          </div>
          {!isLoggedIn && (
            <Link
              href="/account"
              className="shrink-0 flex items-center justify-center rounded-md bg-(--primary) text-white text-xs font-bold px-3 py-2 hover:opacity-95 transition-opacity"
            >
              Sign in
            </Link>
          )}
        </form>
      </div>

      <div className='hidden lg:flex bg-(--bg-surface) py-2 px-4 md:px-20 gap-12 items-center justify-between'>
        <Link href={'/'} className="text-2xl font-bold shrink-0 ">
          <img src="/images/440_Logo.png" alt="" width={70} height={70} className='text-5xl' />
        </Link>
        <div className="hidden lg:flex w-150">
          <SearchForm
            category={category}
            setCategory={setCategory}
            productCategories={productCategories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSubmit={handleSearchSubmit}
          />
        </div>
        <ul className="flex items-center gap-4 shrink-0 navBar">
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
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isVisible && !hideCheckoutChrome && (
          <motion.ul
            variants={list}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              fixed inset-x-0 z-52
              rounded-r-3xl bg-(--bg-surface) text-(--text-primary)
              p-4 w-[85%] h-screen top-0 shadow-lg
              lg:hidden
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
              className="p-3"
              onClick={() => setIsVisible(false)}
            >
              <Link
                href={'/account/overview'}
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
    </nav>

    <SupportMessagePanel
      open={supportOpen}
      onClose={() => setSupportOpen(false)}
    />

    {/* Floating support message button */}
    <button
      type="button"
      onClick={() => setSupportOpen((v) => !v)}
      className={`fixed bottom-20 right-4 z-[55] flex items-center gap-2 bg-(--primary) text-white shadow-lg rounded-full px-4 py-3 transition-transform duration-200 hover:scale-105 group lg:bottom-6 lg:right-6 ${
        hideCheckoutChrome ? "hidden" : ""
      } ${supportOpen ? "ring-2 ring-white ring-offset-2 ring-offset-(--bg-page)" : ""}`}
      aria-label={supportOpen ? "Close support" : "Message support"}
      aria-expanded={supportOpen}
    >
      <RiMessageLine className="text-xl shrink-0" />
      <span className="text-sm font-medium overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Support
      </span>
    </button>
    </>
  )
}

export default Navbar
