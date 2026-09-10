"use client";

import Link from "next/link";
import {
  RiArrowRightLine,
  RiErrorWarningLine,
  RiLoader5Fill,
} from "react-icons/ri";
import { Badge, Button } from "../ui";
import Image from "next/image";
import { useGetSuppliers } from "@/api/market";
import { useState } from "react";
import SupplierDrawer from "../marketplace/SupplierDrawer";

const SuppliersSection = () => {
  const {
    data: suppliers,
    isLoading,
    error,
  } = useGetSuppliers({ page: 1, limit: 3 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const shortenText = (str: string, length = 20) => {
    if (!str) return "";
    return str.length > length ? str.slice(0, length) + "..." : str;
  };

  const handleSupplierClick = (id: number) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  return (
    <section className="my-10 px-4 md:px-20 ">
      <div className="bg-(--bg-surface) rounded-2xl p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
          <div>
            <h2 className="text-2xl lg:text-3xl">Trusted Suppliers</h2>
            <p>
              Top performing manufacturers with verified facilities and
              certifications
            </p>
          </div>
          <Link href={"/marketplace"}>
            <Button className="flex gap-1 items-center">
              All Verified Factories
              <RiArrowRightLine />
            </Button>
          </Link>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <RiLoader5Fill
              size={36}
              className="text-(--primary) animate-spin"
            />
          </div>
        )}
        {error && (
          <div className="flex flex-col gap-3 justify-center items-center py-12">
            <RiErrorWarningLine size={36} className="text-red-500" />
            <div className="">
              <h2 className="text-xl font-bold">Something went wrong</h2>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-4">
          {suppliers?.suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="flex gap-4 md:items-center cursor-pointer"
              onClick={() => handleSupplierClick(supplier.id)}
            >
              <img
                src={supplier.image}
                alt={supplier.name}
                className="w-24 aspect-square rounded-xl"
              />
              <div>
                <h3 className="text-xl">{shortenText(supplier.name, 20)}</h3>
                {supplier.returnRate != null && (
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="capitalize">
                      {supplier.returnRate}% return rate
                    </Badge>
                  </div>
                )}
                <p className="text-(--text-muted) text-sm mt-1 font-semibold">
                  {supplier.location} | {supplier.year} Yrs Experience
                </p>
                <p className="mt-1 text-(--primary) text-xs font-semibold">
                  {supplier.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedId && (
        <SupplierDrawer
          isModalOpen={modalOpen}
          setIsModalOpen={setModalOpen}
          supplierId={String(selectedId)}
        />
      )}
    </section>
  );
};

export default SuppliersSection;
