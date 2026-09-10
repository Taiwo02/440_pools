"use client"

import { useGetSupplierById } from "@/api/market";
import { RiCloseLine, RiErrorWarningLine, RiLoader5Fill } from "react-icons/ri";
// @ts-ignore
import Modal from "react-modal";

type Props = {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  supplierId?: string
}

const SupplierDrawer = ({ isModalOpen, setIsModalOpen, supplierId }: Props) => {
  const { data: supplier, isLoading, error } = useGetSupplierById(supplierId!);

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Example Modal"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 80,
        },
        content: {
          width: window.innerWidth > 768 ? "40%" : "100%",
          top: window.innerWidth > 768 ? 0 : "10%",
          left: window.innerWidth > 768 ? "60%" : "0%",
          height: window.innerWidth > 768 ? "100%" : "90%",
          backgroundColor: "var(--bg-page)",
          borderRadius: "10px 0 0 10px",
          border: "none",
        },
      }}
    >
      <button onClick={() => setIsModalOpen(false)} className="block ml-auto">
        <RiCloseLine size={20} />
      </button>
      <div className="h-full">
        {isLoading && (
          <div className="h-full flex justify-center items-center">
            <RiLoader5Fill
              size={48}
              className="text-(--primary) animate-spin"
            />
          </div>
        )}
        {error && (
          <div className="h-full flex justify-center items-center flex-col gap-3">
            <RiErrorWarningLine />
            <p className="text-xl">There was an error loading this supplier</p>
          </div>
        )}
        {supplier && (
          <div className="mt-8">
            <div className="h-40">
              {supplier.image ? (
                <img
                  src={supplier.image}
                  alt={supplier.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center bg-(--bg-muted) justify-center text-sm text-(--text-muted)">
                  No image
                </div>
              )}
            </div>

            <div className="my-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xl font-bold">{supplier.name}</p>
                {supplier.medal && (
                  <span className="text-xs rounded-full px-2.5 py-1 bg-(--bg-muted) whitespace-nowrap">
                    {supplier.medal}
                  </span>
                )}
              </div>
              <p className="text-sm text-(--text-muted)">
                Club Code: {supplier.clubCode}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-(--text-muted)">Location</p>
                <p className="font-medium">{supplier.location || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-(--text-muted)">Supplier Type</p>
                <p className="font-medium">{supplier.supplierType || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-(--text-muted)">Year</p>
                <p className="font-medium">{supplier.year || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-(--text-muted)">Return Rate</p>
                <p className="font-medium">
                  {supplier.returnRate != null
                    ? `${supplier.returnRate}%`
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--text-muted)">Rating</p>
                <p className="font-medium">
                  {supplier.rate != null ? `⭐ ${supplier.rate}` : "—"}
                </p>
              </div>
            </div>

            {supplier.description && (
              <div className="mb-5">
                <p className="text-xs text-(--text-muted) mb-1">Description</p>
                <p className="text-sm">{supplier.description}</p>
              </div>
            )}

            {supplier.market && (
              <div className="border-t border-(--table-border) pt-4">
                <p className="text-xs text-(--text-muted) mb-2">Market</p>
                <div className="flex items-center gap-3">
                  {supplier.market.image ? (
                    <img
                      src={supplier.market.image}
                      alt={supplier.market.name}
                      className="w-14 h-14 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-(--bg-muted) flex items-center justify-center text-[10px] text-(--text-muted)">
                      No image
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{supplier.market.name}</p>
                    <p className="text-sm text-(--text-muted)">
                      {supplier.market.category} · {supplier.market.country}
                    </p>
                    <p className="text-xs text-(--text-muted)">
                      {supplier.market.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SupplierDrawer;
