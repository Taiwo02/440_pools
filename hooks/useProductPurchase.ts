import { useState } from "react";
import { getCrossSubdomainCookie } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const useProductPurchase = (addToBuyCart: any) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const router = useRouter();

  const openModal = () => setShowBuyModal(true);
  const closeModal = () => setShowBuyModal(false);

  const handleBuyNow = () => {
    closeModal();

    const token = getCrossSubdomainCookie("440_token");

    if (!token) {
      return { notLoggedIn: true };
    }

    router.push("/checkout");
  };

  const handleAddToCart = (cartItem: any) => {
    closeModal();

    const token = getCrossSubdomainCookie("440_token");

    if (!token) {
      return { notLoggedIn: true };
    }

    addToBuyCart(cartItem);
  };

  return {
    showBuyModal,
    openModal,
    closeModal,
    handleBuyNow,
    handleAddToCart
  };
};