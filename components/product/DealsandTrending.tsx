import { Card } from "../ui";

type DealItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
};

type TrendingItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  unitsSold: number;
};

type Props = {
  dailyDeals: {
    endsAt: string;
    items: DealItem[];
  };
  trendingItems: TrendingItem[];
};

export const DealsAndTrending = ({ dailyDeals, trendingItems }: Props) => {
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
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600 font-semibold">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${item.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* TRENDING ITEMS */}
      <Card className="lg:col-span-2 bg-white rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl flex items-center gap-2">
            Trending Items
          </h3>
          <button className="text-xs text-blue-600 hover:underline">
            View Ranking
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {trendingItems.map(item => (
            <Card
              key={item.id}
              className="border rounded-lg p-3 shadow-none! hover:shadow-sm transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-24 object-contain mb-2"
              />
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-orange-600 font-semibold text-sm">
                ${item.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {item.unitsSold} units sold
              </p>
            </Card>
          ))}
        </div>
      </Card>

    </div>
  );
};
