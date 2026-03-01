"use client"

import { useGetUserProfile } from "@/api/auth";
import Deliveries from "@/components/account/Deliveries";
import OrderHistory from "@/components/account/OrderHistory";
import { Button } from "@/components/ui";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { RiLogoutCircleLine, RiUser5Fill } from "react-icons/ri";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const { logout } = useAuth();
  const { data: person, isPending, error } = useGetUserProfile();
  

  useEffect(() => {
    const merchantString = localStorage.getItem("merchant");
    if (merchantString) {
      setUser(JSON.parse(merchantString));
    }
  }, []);

  useEffect(() => {
    if(person) console.log(person)
  }, [person])
  

  // if(isPending) {
  //   return (
  //     <div className="flex justify-center items-center w-full h-screen">
  //       <RiLoader5Line size={48} className='animate-spin text-(--primary)' />
  //     </div>
  //   )
  // }
  
  // if (error) return (
  //   <div className="flex justify-center items-center w-full h-screen">
  //     <p>Error loading user</p>
  //   </div>
  // );
  
  
  return (
    <section className="pt-24 mb-10 md:mb-16">
      <div className="px-4 md:px-10 py-10 flex flex-col md:flex-row gap-4 md:items-center justify-around rounded-2xl bg-(--bg-surface) mx-4 mt-4 relative">
        <div className="flex gap-4 items-center">
          <div className="w-20 h-20 rounded-full bg-(--primary-soft) flex items-center justify-center">
            <RiUser5Fill size={36} className="text-(--primary)" />
          </div>
          <div>
            <p className="font-bold">Business Name</p>
            <p className="uppercase">
              {user?.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="font-bold">Email Address</p>
            <p className="uppercase">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="font-bold">Phone Number</p>
            <p className="uppercase">
              {user?.phone}
            </p>
          </div> 
        </div>
        <Button className="bg-red-500" onClick={logout}>
          <RiLogoutCircleLine />
          Logout
        </Button>
      </div>
      <div className="px-4 md:px-10 py-4 rounded-2xl bg-(--bg-surface) mx-4 mt-4">
        <Tabs defaultValue="history">
          <Tabs.List className="border-b border-(--border-default)">
            <Tabs.Trigger
              value="history"
              className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
            >
              <span className="block md:hidden">History</span>
              <span className="hidden md:block">Order History</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="deliveries"
              className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
            >
              <span>Deliveries</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="reviews"
              className="px-4 py-2 data-[state=active]:border-b-3 data-[state=active]:border-(--primary) data-[state=active]:text-(--primary)"
            >
              <span className="block md:hidden">Reviews</span>
              <span className="md:block hidden">Product Reviews</span>
            </Tabs.Trigger>
          </Tabs.List>
        
          <Tabs.Content value="history" className="pt-4">
            <OrderHistory />
          </Tabs.Content>
          <Tabs.Content value="deliveries" className="pt-4">
            <Deliveries />
          </Tabs.Content>
          <Tabs.Content value="reviews" className="pt-4">
            Reviews content goes here
          </Tabs.Content>
        </Tabs>
      </div>
    </section>
  );
}
