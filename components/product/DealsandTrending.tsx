"use client"

import { StaticImageData } from "next/image";
import { Button, Card, Progress } from "../ui";
import { useGetBales } from "@/api/bale";
import Link from "next/link";
import { RiLoader5Line } from "react-icons/ri";

type DealItem = {
  id: string;
  name: string;
  image: StaticImageData;
  price: number;
  oldPrice?: number;
};

type Props = {
  dailyDeals: {
    endsAt: string;
    items: DealItem[];
  };
};

export const DealsAndTrending = ({ dailyDeals }: Props) => {
  const { data: allBales = [], isPending } = useGetBales();
  const slicedBales = allBales?.slice(1, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* DAILY DEALS */}
      <Card className="rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            Daily Deals
          </h3>
          <span className="text-xs text-gray-500">
            Ends in {dailyDeals.endsAt}
          </span>
        </div>

        <div className="space-y-4">
          {dailyDeals.items.map(item => (
            <div key={item.id} className="flex gap-3 border border-(--border-default) rounded-lg p-2">
              <img
                src={item.image.src}
                alt={item.name}
                className="w-20 aspect-square object-contain rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 font-semibold">
                    &#8358;{item.price.toFixed(2)}
                  </span>
                  {item.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      &#8358;{item.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="font-bold text-(--primary) text-sm mt-2">
                  8/10 joined
                </p>
                <Progress 
                  totalQty={100}
                  currentQty={80}
                  className="my-0!"
                />
              </div>
            </div>
          ))}
        </div>
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
                <Card
                  key={item.id}
                  className="border rounded-lg shadow-none! hover:shadow-sm transition p-0!"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-34 mb-2 rounded-t-lg object-cover"
                  />
                  <div className="px-2 pb-2">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-orange-600 font-semibold text-sm">
                      &#8358;{item.price.toFixed(2)}
                    </p>
                    <div className="flex justify-between items-center flex-wrap mt-2">
                      <p className="font-bold text-(--primary) text-sm">
                        {item.filledSlot}/{item.slot} joined
                      </p>
                    </div>
                    <Progress
                      totalQty={item.slot}
                      currentQty={item.filledSlot}
                      className='my-0!'
                    />
                    <Link href={`/products/${item.id}`}>
                      <Button primary isFullWidth className='mt-2 py-2! rounded-lg!'>
                        Join Pool
                      </Button>
                    </Link>
                  </div>

                  {/* <p className="text-xs text-gray-500">
                {item.unitsSold} units sold
              </p> */}
                </Card>
              ))}
            </div>
        }
      </Card>

    </div>
  );
};
