import Link from 'next/link';
import { RiArrowRightLine } from 'react-icons/ri';
import { Badge, Button } from '../ui';
import Steel from "@/assets/images/watch.jpg";
import Image from 'next/image';

const SuppliersSection = () => {
  const suppliers = [
    {
      id: "precision-parts-ltd",
      name: "Precision Parts Ltd.",
      logo: "/images/suppliers/precision-parts.png",
      countryCode: "CN",
      country: "China",
      yearsExperience: 8,
      verificationStatus: "verified",
      badges: ["gold"],
      highlights: ["98% On-time delivery"],
      isFactory: true,
    },
    {
      id: "global-tech-group",
      name: "Global Tech Group",
      logo: "/images/suppliers/global-tech.png",
      countryCode: "DE",
      country: "Germany",
      yearsExperience: 15,
      verificationStatus: "verified",
      badges: ["gold"],
      highlights: ["100% Quality inspection"],
      isFactory: true,
    },
    {
      id: "heavy-mach-co",
      name: "Heavy Mach Co.",
      logo: "/images/suppliers/heavy-mach.png",
      countryCode: "KR",
      country: "South Korea",
      yearsExperience: 12,
      verificationStatus: "verified",
      badges: [],
      highlights: ["Direct factory pricing"],
      isFactory: true,
    },
  ];


  return (
    <section className='my-20 px-4 md:px-20 '>
      <div className="bg-(--bg-surface) rounded-2xl p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
          <div>
            <h2 className="text-2xl lg:text-3xl">Trusted Suppliers</h2>
            <p>Top performing manufacturers with verified facilities and certifications</p>
          </div>
          <Link href={''}>
            <Button className='flex gap-1 items-center'>
              All Verified Factories
              <RiArrowRightLine />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-4">
          {
            suppliers.map(supplier => (
              <div key={supplier.id} className='flex gap-4 md:items-center'>
                <img src={Steel.src} alt='' className='w-24 aspect-square rounded-xl' />
                <div>
                  <h3 className="text-xl">{supplier.name}</h3>
                  <div className="flex gap-1">
                    <Badge secondary className='capitalize'>
                      { supplier.verificationStatus }
                    </Badge>
                    {
                      supplier.badges.length != 0 ? 
                      <Badge primary className='capitalize'>
                        {supplier.badges[0]}
                      </Badge> : ''
                    }
                  </div>
                  <p className="text-(--text-muted) text-sm mt-1 font-semibold">
                    {supplier.countryCode} | {supplier.yearsExperience} Yrs Experience
                  </p>
                  <p className="mt-1 text-(--primary) text-xs font-semibold">
                    {supplier.highlights[0]}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default SuppliersSection
