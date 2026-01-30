"use client"

import { Button, Card, Pagination } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RiArrowDownSLine, RiCheckboxCircleFill, RiGlobeFill, RiGlobeLine, RiGridFill, RiHashtag, RiListUnordered, RiMoneyDollarBoxFill, RiStarFill } from "react-icons/ri";

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");

  const productImages = {
    sensorModule: "https://picsum.photos/seed/sensor-module/600/600",
    pcbAssembly: "https://picsum.photos/seed/pcb-assembly/600/600",
    waterproofConnector: "https://picsum.photos/seed/waterproof-connector/600/600",
    multimeter: "https://picsum.photos/seed/digital-multimeter/600/600",
    heatSink: "https://picsum.photos/seed/aluminum-heat-sink/600/600",
    ledDisplay: "https://picsum.photos/seed/led-matrix-display/600/600",

    proximitySensor: "https://picsum.photos/seed/proximity-sensor/600/600",
    powerSupply: "https://picsum.photos/seed/power-supply/600/600",
    relayModule: "https://picsum.photos/seed/relay-module/600/600",
    controlPanel: "https://picsum.photos/seed/control-panel/600/600",
    cableHarness: "https://picsum.photos/seed/cable-harness/600/600",
    terminalBlock: "https://picsum.photos/seed/terminal-block/600/600",
    industrialSwitch: "https://picsum.photos/seed/industrial-switch/600/600",
    motorDriver: "https://picsum.photos/seed/motor-driver/600/600",
    smdResistor: "https://picsum.photos/seed/smd-resistor/600/600",
    capacitorBank: "https://picsum.photos/seed/capacitor-bank/600/600",
    panelMeter: "https://picsum.photos/seed/panel-meter/600/600",
    encoder: "https://picsum.photos/seed/rotary-encoder/600/600",
    plcModule: "https://picsum.photos/seed/plc-module/600/600",
    coolingFan: "https://picsum.photos/seed/industrial-fan/600/600"
  };

  const products = [
    {
      id: 1,
      name: "Advanced Industrial Optical Sensor Module",
      priceRange: { min: 1.20, max: 1.50 },
      currency: "USD",
      unit: "unit",
      minOrder: 500,
      supplier: "Shenzhen Tech Manufacturing",
      category: "Sensors",
      tag: "Hot Sale",
      image: productImages.sensorModule,
      imageAlt: "Industrial optical sensor module PCB"
    },
    {
      id: 2,
      name: "Custom Multi-Layer PCB Assembly with Lead-Free Finish",
      priceRange: { min: 0.45, max: 0.85 },
      currency: "USD",
      unit: "piece",
      minOrder: 1000,
      supplier: "Precision Circuits Ltd.",
      category: "PCBs",
      image: productImages.pcbAssembly,
      imageAlt: "Multi-layer PCB close-up"
    },
    {
      id: 3,
      name: "Heavy Duty Waterproof Connector IP68",
      priceRange: { min: 5.50, max: 7.20 },
      currency: "USD",
      unit: "pair",
      minOrder: 200,
      supplier: "Global Connect Solutions",
      category: "Connectors",
      image: productImages.waterproofConnector,
      imageAlt: "Gold-plated waterproof connectors"
    },
    {
      id: 4,
      name: "Digital Multimeter High Accuracy for Maintenance Engineers",
      priceRange: { min: 32.00, max: 45.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 10,
      supplier: "Industrial Tooling Corp",
      category: "Testing Equipment",
      image: productImages.multimeter,
      imageAlt: "Digital multimeter with probes"
    },
    {
      id: 5,
      name: "CNC Machined Aluminum Heat Sink with Blue Anodized Coating",
      priceRange: { min: 2.10, max: 3.40 },
      currency: "USD",
      unit: "piece",
      minOrder: 300,
      supplier: "Eastern Machining Hub",
      category: "Thermal Management",
      image: productImages.heatSink,
      imageAlt: "Aluminum heat sink component"
    },
    {
      id: 6,
      name: "Ultra-Bright LED Matrix Display for Machine Information Panels",
      priceRange: { min: 8.80, max: 12.50 },
      currency: "USD",
      unit: "set",
      minOrder: 50,
      supplier: "Lumin Optoelectronics",
      category: "Displays",
      image: productImages.ledDisplay,
      imageAlt: "LED matrix display module"
    },
    {
      id: 7,
      name: "Inductive Proximity Sensor M12 Housing",
      priceRange: { min: 3.20, max: 4.80 },
      currency: "USD",
      unit: "unit",
      minOrder: 200,
      supplier: "SenseCore Automation",
      category: "Sensors",
      image: productImages.proximitySensor,
      imageAlt: "Inductive proximity sensor"
    },
    {
      id: 8,
      name: "Industrial Switching Power Supply 24V",
      priceRange: { min: 18.00, max: 25.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 20,
      supplier: "VoltEdge Systems",
      category: "Power Supplies",
      image: productImages.powerSupply,
      imageAlt: "Industrial power supply unit"
    },
    {
      id: 9,
      name: "8-Channel Relay Control Module",
      priceRange: { min: 4.50, max: 6.00 },
      currency: "USD",
      unit: "board",
      minOrder: 100,
      supplier: "ControlLogic Ltd.",
      category: "Control Modules",
      image: productImages.relayModule,
      imageAlt: "Relay control module PCB"
    },
    {
      id: 10,
      name: "Industrial Touch Control Panel HMI",
      priceRange: { min: 95.00, max: 130.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 5,
      supplier: "HMI Systems Co.",
      category: "Automation",
      image: productImages.controlPanel,
      imageAlt: "Industrial HMI control panel"
    },
    {
      id: 11,
      name: "Custom Industrial Cable Harness Assembly",
      priceRange: { min: 6.00, max: 9.50 },
      currency: "USD",
      unit: "set",
      minOrder: 100,
      supplier: "WireTech Assemblies",
      category: "Cables",
      image: productImages.cableHarness,
      imageAlt: "Industrial cable harness"
    },
    {
      id: 12,
      name: "DIN Rail Terminal Block Connector",
      priceRange: { min: 0.60, max: 1.10 },
      currency: "USD",
      unit: "piece",
      minOrder: 1000,
      supplier: "ConnectPro Manufacturing",
      category: "Connectors",
      image: productImages.terminalBlock,
      imageAlt: "Terminal block connector"
    },
    {
      id: 13,
      name: "Industrial Ethernet Network Switch",
      priceRange: { min: 55.00, max: 75.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 10,
      supplier: "NetWorks Industrial",
      category: "Networking",
      image: productImages.industrialSwitch,
      imageAlt: "Industrial ethernet switch"
    },
    {
      id: 14,
      name: "High Power DC Motor Driver Module",
      priceRange: { min: 14.00, max: 19.50 },
      currency: "USD",
      unit: "board",
      minOrder: 50,
      supplier: "MotionDrive Tech",
      category: "Motor Control",
      image: productImages.motorDriver,
      imageAlt: "Motor driver module"
    },
    {
      id: 15,
      name: "SMD Resistor Assortment Kit",
      priceRange: { min: 3.00, max: 5.00 },
      currency: "USD",
      unit: "kit",
      minOrder: 100,
      supplier: "PassiveParts Co.",
      category: "Electronic Components",
      image: productImages.smdResistor,
      imageAlt: "SMD resistor assortment"
    },
    {
      id: 16,
      name: "High Voltage Capacitor Bank Module",
      priceRange: { min: 22.00, max: 30.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 20,
      supplier: "Capacitek Industries",
      category: "Electronic Components",
      image: productImages.capacitorBank,
      imageAlt: "Capacitor bank module"
    },
    {
      id: 17,
      name: "Digital Panel Meter Voltage Display",
      priceRange: { min: 6.50, max: 9.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 100,
      supplier: "MeterWorks Ltd.",
      category: "Displays",
      image: productImages.panelMeter,
      imageAlt: "Digital panel meter"
    },
    {
      id: 18,
      name: "Incremental Rotary Encoder Industrial Grade",
      priceRange: { min: 12.00, max: 16.50 },
      currency: "USD",
      unit: "unit",
      minOrder: 50,
      supplier: "EncoderTech",
      category: "Sensors",
      image: productImages.encoder,
      imageAlt: "Rotary encoder sensor"
    },
    {
      id: 19,
      name: "PLC Expansion I/O Module",
      priceRange: { min: 38.00, max: 52.00 },
      currency: "USD",
      unit: "module",
      minOrder: 10,
      supplier: "AutoLogic Systems",
      category: "Automation",
      image: productImages.plcModule,
      imageAlt: "PLC I/O expansion module"
    },
    {
      id: 20,
      name: "Industrial Cooling Fan 120mm",
      priceRange: { min: 4.80, max: 7.00 },
      currency: "USD",
      unit: "unit",
      minOrder: 100,
      supplier: "CoolFlow Manufacturing",
      category: "Thermal Management",
      image: productImages.coolingFan,
      imageAlt: "Industrial cooling fan"
    }
  ];

  if (!products || products.length === 0) {
    return <p className="text-center font-bold text-xl">No data available</p>;
  }

  // FILTER before pagination
  const filteredData = products.filter((row) => {
    // check first 2 available columns
    const col1 = row.name.toLowerCase() || "";
    const col2 = row.supplier.toLowerCase() || "";

    return (
      col1.includes(searchQuery.toLowerCase()) ||
      col2.includes(searchQuery.toLowerCase())
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleData = filteredData.slice(startIndex, endIndex);

  const prevDisable = currentPage === 1;
  const nextDisable = currentPage === totalPages;


  return (
    <>
      <section className='pt-24 mb-10 md:mb-16'>
        <div className="md:px-10 lg:px-20 flex flex-col md:flex-row gap-8 items-start">
          <div className="hidden lg:block basis-full lg:basis-1/5 p-6 rounded-xl bg-(--bg-surface)">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Filters</h2>
              <span className="text-(--primary)">Clear All</span>
              
            </div>
            <Accordion defaultOpenId="one">
              <Accordion.Item id="one">
                <Accordion.Trigger id="one">
                  <div className="flex items-center gap-2">
                    <RiListUnordered />
                    <span>Categories</span>
                  </div>
                  
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="one">
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Fashion
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Electronics
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Machinery
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Luxury
                  </div>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="two">
                <Accordion.Trigger id="two">
                  <div className="flex items-center gap-2">
                    <RiMoneyDollarBoxFill />
                    <span>Price Range</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="two">
                  <div className="flex gap-4">
                    <div className="basis-1/2">
                      <input className="w-full p-2 border" />
                    </div>
                    <div className="basis-1/2">
                      <input className="w-full p-2 border" />
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="three">
                <Accordion.Trigger id="three">
                  <div className="flex items-center gap-2">
                    <RiHashtag />
                    <span>Min Order</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="three">
                  <input type="range" min={0} max={10000} className="w-full" />
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="four">
                <Accordion.Trigger id="four">
                  <div className="flex items-center gap-2">
                    <RiStarFill />
                    <span>Supplier Rating</span>
                  </div>
                  
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="four">
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    1 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    2 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    3 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    4 <RiStarFill />
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    5 <RiStarFill />
                  </div>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="five">
                <Accordion.Trigger id="five">
                  <div className="flex items-center gap-2">
                    <RiGlobeLine />
                    <span>Market Location</span>
                  </div>
                  <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content id="five">
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    China
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Japan
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    USA
                  </div>
                  <div className="my-2 flex items-center gap-2">
                    <input type="checkbox" />
                    Rest of the World
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <Button primary className="mt-5" isFullWidth>
              Apply
            </Button>
          </div>
          <div className="basis-full lg:basis-4/5">
            <div className="p-4 rounded-xl bg-(--bg-surface) hidden md:flex justify-between items-center mb-6">
              <div className="flex gap-2 items-center">
                <span className="text-(--primary)/70">Sort By:</span>
                <ul className="flex items-center gap-2">
                  <li>Popularity</li>
                  <li>Newest</li>
                  <li>Price</li>
                  <li>MOQ</li>
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Found { filteredData.length } products</span>
                <div className="flex border border-(--primary-soft) rounded-lg">
                  <button className="p-2 rounded-l-lg bg-(--primary-soft) text-(--primary)">
                    <RiGridFill />
                  </button>
                  <button className="p-2 rounded-r-lg">
                    <RiListUnordered />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-(--bg-surface)">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 lg:gap-8">
                {
                  visibleData.map((product, index) => (
                    <Card
                      key={product.id}
                      className='p-0!'
                    >
                      <Image src={product.image} alt='' width={0} height={0} className='w-full aspect-square rounded-t-2xl' />
                      <div className="p-2 md:p-4">
                        <p className="md:text-lg font-bold line-clamp-2">{product.name}</p>
                        <div className="mt-1">
                          <div className="flex flex-wrap items-center md:gap-2">
                            <p className="text-lg md:text-2xl text-(--primary) font-bold">${product.priceRange.min} - ${product.priceRange.max}</p>
                            <p className="text-(--text-muted) text-xs">/ unit</p>
                          </div>
                        </div>
                        <div className="md:my-2">
                          <div className="flex justify-between flex-wrap">
                            <p className="font-bold text-sm">Min Order: {product.minOrder} units</p>
                          </div>
                        </div>
                        <div className="flex gap-1 items-center">
                          <p className="font-bold text-sm truncate">{product.supplier}</p>
                          <RiCheckboxCircleFill size={12} className="text-(--primary)" />
                        </div>
                        <Link href={`/products/${product.id}`}>
                          <Button primary isFullWidth className='mt-2 py-2! md:py-3! rounded-xl! md:rounded-2xl!'>
                            View Product
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))
                }
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              prevDisable={prevDisable}
              nextDisable={nextDisable}
              prev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              next={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Products
