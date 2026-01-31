"use client"

import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { RiLogoutCircleLine } from "react-icons/ri";

export default function AccountPage() {
  const { logout } = useAuth();
  
  return (
    <section className="pt-24 mb-10 md:mb-16">
      <div className="px-4 md:px-10 lg:px-20 flex flex-col justify-center items-center h-screen">
        Account Page
        <Button className="bg-red-500" onClick={logout}>
          <RiLogoutCircleLine />
          Logout
        </Button>
      </div>
    </section>
  );
}
