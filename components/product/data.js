import Welder from "@/public/images/welder.jpg";
import Battery from "@/public/images/battery.avif"

export const dailyDeals = {
  endsAt: "22:50:49", // countdown display
  items: [
    {
      id: "dd-1",
      name: "Industrial Welder X2",
      image: Welder,
      price: 185.0,
      oldPrice: 240.0
    },
    {
      id: "dd-2",
      name: "Lithium Battery 100Ah",
      image: Battery,
      price: 72.5,
      oldPrice: 95.0
    }
  ]
};

export const trendingItems = [
  {
    id: "ti-1",
    name: "Smart Watch Pro",
    image: "/images/watch.png",
    price: 64.0,
    unitsSold: 125
  },
  {
    id: "ti-2",
    name: "Solar Inverter Panel",
    image: "/images/solar.png",
    price: 410.0,
    unitsSold: 76
  },
  {
    id: "ti-3",
    name: "Portable Power Generator",
    image: "/images/generator.png",
    price: 152.0,
    unitsSold: 94
  },
  {
    id: "ti-4",
    name: "Power Bank 20,000mAh",
    image: "/images/powerbank.png",
    price: 68.0,
    unitsSold: 210
  }
];
