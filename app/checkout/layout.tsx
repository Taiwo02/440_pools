import { Suspense } from "react";
import { RiLoader5Fill } from "react-icons/ri";

export const metadata = {
  title: "Checkout",
};

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense 
      fallback={
        <div className="h-screen flex items-center justify-center flex-col">
          <RiLoader5Fill size={48} className="text-(--primary) animate-spin" />
          Loading checkout...
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default CheckoutLayout;