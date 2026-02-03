// @ts-nocheck

import Inverter from "/images/inverter.jpg";
import PowerBank from "/images/download.png";
import Steel from "/images/steel.jpg";
import Watch from "/images/watch.jpg";

 const   products = [
      {
        id: "industrial-inverter-welder",
        name: "Heavy Duty Industrial Inverter Welder – Series X",
        category: "machinery",
        image: Inverter,
        price: 185.0,
        oldPrice: 240.0,
        unit: "per unit",
        minOrder: 500,
        discountPercent: 22,
        rating: 4.5,
        isGroupBuy: true,
        quantity: 1500,
        quantity_sold: 700
      },
      {
        id: "lithium-storage-battery",
        name: "Deep Cycle Lithium Storage Battery – 100Ah/12V Pack",
        category: "energy",
        image: PowerBank,
        price: 72.5,
        oldPrice: 96.0,
        unit: "per pack",
        minOrder: 100,
        discountPercent: 45,
        rating: 4.6,
        isGroupBuy: true,
        quantity: 500,
        quantity_sold: 270
      },
      {
        id: "smartwatch-series-x-ultra",
        name: "Smart Watch Series X Ultra – Wholesale Batch",
        category: "electronics",
        image: Watch,
        price: 6.4,
        oldPrice: 12.0,
        unit: "per unit",
        minOrder: 5000,
        discountPercent: 95,
        rating: 4.2,
        isGroupBuy: true,
        quantity: 1000,
        quantity_sold: 762
      },
      {
        id: "galvanized-structural-steel-beams",
        name: "Galvanized Structural Steel Beams – Bulk Pool",
        category: "machinery",
        image: Steel,
        price: 410.0,
        oldPrice: 560.0,
        unit: "per pool",
        minOrder: 100,
        discountPercent: 23,
        rating: 4.7,
        isGroupBuy: true,
        quantity: 1200,
        quantity_sold: 900
      },
    ];

    export default products
