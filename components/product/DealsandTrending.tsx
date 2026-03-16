"use client"

import { Card, Progress, StarRating } from "../ui";
import { useGetBales } from "@/api/bale";
import Link from "next/link";
import { RiLoader5Line } from "react-icons/ri";
import UserBubbles from "./UserBubble";

type Props = {
  dailyDeals: {
    endsAt: string;
  };
};

export const DealsAndTrending = ({ dailyDeals }: Props) => {
  const { data: allBales = [], isPending } = useGetBales();
  const dailyDealsBales = allBales?.slice(0, 4);
  const slicedBales = allBales?.slice(1, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* DAILY DEALS - live API, two per row */}
      <Card className="rounded-xl p-3! md:p-4!">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            Daily Deals
          </h3>
          <span className="text-xs text-(--text-muted)">
            Ends in {dailyDeals.endsAt}
          </span>
        </div>

        {isPending ? (
          <div className="flex justify-center items-center w-full my-16">
            <RiLoader5Line size={48} className="animate-spin text-(--primary)" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dailyDealsBales.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="block cursor-pointer"
              >
                <div className="flex gap-3 border border-(--border-default) rounded-lg p-2">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 shrink-0 aspect-square object-contain rounded"
                  />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <StarRating rating={(item.product as { rating?: number }).rating ?? 4} size={12} className="mt-0.5" />
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 font-semibold">
                        &#8358;{item.price.toFixed(2)}
                      </span>
                      {item.oldPrice != null && item.oldPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          &#8358;{item.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-(--primary) text-sm mt-2">
                      {item.filledSlot}/{item.slot} joined
                    </p>
                    <Progress
                      totalQty={item.slot}
                      currentQty={item.filledSlot}
                      className="my-0!"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* TRENDING ITEMS */}
      <Card className="lg:col-span-2 bg-white rounded-xl p-3! md:p-4!">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            Trending Items
          </h3>
          <button className="text-xs text-blue-600 hover:underline">
            View Ranking
          </button>
        </div>

        {
          isPending ?
            <div className="flex justify-center items-center w-full my-16">
              <RiLoader5Line size={48} className='animate-spin text-(--primary)' />
            </div> : 
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {slicedBales.map(item => (
                <Link key={item.id} href={`/products/${item.id}`} className="block cursor-pointer">
                  <Card
                    className="border rounded-lg shadow-none! hover:shadow-sm transition p-0!"
                  >
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-34 mb-2 rounded-t-lg object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-(--primary) text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        TRENDING
                      </span>
                    </div>
                    <div className="px-2 pb-2">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <StarRating rating={(item.product as { rating?: number }).rating ?? 4} size={12} className="mt-0.5" />
                      <p className="text-xs text-(--text-muted) mt-0.5">GROUP PRICE</p>
                      <p className="text-(--primary) font-bold text-sm">
                        &#8358;{item.price.toFixed(2)}<span className="text-(--text-muted) font-normal text-xs">/unit</span>
                      </p>
                      <div className="flex justify-between items-center flex-wrap gap-1 mt-2">
                        <p className="font-bold text-(--primary) text-xs">
                          {item.filledSlot}/{item.slot}
                        </p>
                        <UserBubbles count={item.filledSlot} />
                      </div>
                      <Progress
                        totalQty={item.slot}
                        currentQty={item.filledSlot}
                        className='my-0!'
                      />
                      <span className="mt-2 inline-flex items-center justify-center w-full py-1.5 rounded-lg border-2 border-(--primary) text-(--primary) font-medium text-xs">
                        Join Pool
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
        }
      </Card>

    </div>
  );
};
