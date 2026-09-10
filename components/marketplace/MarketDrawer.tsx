"use client";

import { useGetMarketById } from "@/api/market";
import { RiCloseLine, RiErrorWarningLine, RiLoader5Fill } from "react-icons/ri";
// @ts-ignore
import Modal from "react-modal";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  marketId?: string;
};

const MarketDrawer = ({ isModalOpen, setIsModalOpen, marketId }: Props) => {
  const { data: market, isLoading, error } = useGetMarketById(marketId!);

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
            <p className="text-xl">There was an error loading this market</p>
          </div>
        )}
        {market && (
          <div className="mt-8">
            <div className="h-40">
              {market.image ? (
                <img
                  src={market.image}
                  alt={market.name}
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
              <p className="text-xl font-bold">{market.name}</p>
              {market.category && (
                <span className="inline-block text-xs rounded-full px-2.5 py-1 bg-(--bg-muted) mt-2">
                  {market.category}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-(--text-muted)">Country</p>
                <p className="font-medium">{market.country || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-(--text-muted)">Address</p>
                <p className="font-medium">{market.address || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MarketDrawer;
