"use client";
import { useGetMarkets, useGetSuppliers } from "@/api/market";
import MarketCard from "@/components/marketplace/MarketCard";
import SupplierCard from "@/components/marketplace/SupplierCard";
import { Button, Input } from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import { MarketParams, SupplierParams } from "@/types/types";
import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowLeftSFill, RiArrowLeftSLine, RiArrowRightSFill, RiArrowRightSLine, RiFilter2Line, RiListUnordered, RiLoader5Fill } from "react-icons/ri";

const defaultMarketFilters: MarketParams = { page: 1, limit: 10 };
const defaultSupplierFilters: SupplierParams = { page: 1, limit: 10 };

const MarketPage = () => {
  const [activeTab, setActiveTab] = useState<"suppliers" | "markets">(
    "suppliers",
  );

  // Draft state — bound to inputs, doesn't trigger fetches on its own
  const [tempMarketFilters, setTempMarketFilters] =
    useState<MarketParams>(defaultMarketFilters);
  const [tempSupplierFilters, setTempSupplierFilters] =
    useState<SupplierParams>(defaultSupplierFilters);

  // Applied state — this is what actually gets sent to the hooks
  const [appliedMarketFilters, setAppliedMarketFilters] =
    useState<MarketParams>(defaultMarketFilters);
  const [appliedSupplierFilters, setAppliedSupplierFilters] =
    useState<SupplierParams>(defaultSupplierFilters);

  const handleMarketChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTempMarketFilters((prev) => ({
      ...prev,
      [name]:
        value === "" ? undefined : name === "cityId" ? Number(value) : value,
    }));
  };

  const handleSupplierChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setTempSupplierFilters((prev) => ({
      ...prev,
      [name]:
        value === "" ? undefined : name === "marketId" ? Number(value) : value,
    }));
  };

  const handleApply = () => {
    if (activeTab === "markets") {
      setAppliedMarketFilters(tempMarketFilters);
    } else {
      setAppliedSupplierFilters(tempSupplierFilters);
    }
  };

  const handleClear = () => {
    if (activeTab === "markets") {
      setTempMarketFilters(defaultMarketFilters);
      setAppliedMarketFilters(defaultMarketFilters);
    } else {
      setTempSupplierFilters(defaultSupplierFilters);
      setAppliedSupplierFilters(defaultSupplierFilters);
    }
  };

  const { data: marketsData, isLoading: marketsLoading } = useGetMarkets(
    appliedMarketFilters,
    { enabled: activeTab === "markets" },
  );

  const { data: suppliersData, isLoading: suppliersLoading } = useGetSuppliers(
    appliedSupplierFilters,
    { enabled: activeTab === "suppliers" },
  );

  const isLoading = activeTab === "markets" ? marketsLoading : suppliersLoading;

  return (
    <section className="pt-16 lg:pt-24 mb-12">
      <div className="mx-3 md:mx-10 lg:mx-20">
        <div className="p-4 rounded-xl bg-(--bg-surface) mb-4 hidden md:block">
          <p className="font-bold mb-3">Filters:-</p>
          <div className="flex gap-2 items-end">
            <Input
              element="select"
              name="activeTab"
              value={activeTab}
              handler={(e) =>
                setActiveTab(e.target.value as "suppliers" | "markets")
              }
              selectOptions={["suppliers", "markets"]}
              tag="Request"
              genStyle="my-0! flex-1"
            />

            {activeTab === "markets" ? (
              <>
                <Input
                  element="input"
                  input_type="text"
                  name="cityId"
                  value={tempMarketFilters.cityId ?? ""}
                  handler={handleMarketChange}
                  placeholder="City ID"
                  tag="City ID"
                  genStyle="my-0! flex-1"
                />
                <Input
                  element="input"
                  input_type="text"
                  name="country"
                  value={tempMarketFilters.country ?? ""}
                  handler={handleMarketChange}
                  placeholder="Country"
                  tag="Country"
                  genStyle="my-0! flex-1"
                />
                <Input
                  element="input"
                  input_type="text"
                  name="search"
                  value={tempMarketFilters.search ?? ""}
                  handler={handleMarketChange}
                  placeholder="Search"
                  tag="Search"
                  genStyle="my-0! flex-1"
                />
              </>
            ) : (
              <>
                <Input
                  element="input"
                  input_type="text"
                  name="marketId"
                  value={tempSupplierFilters.marketId ?? ""}
                  handler={handleSupplierChange}
                  placeholder="Market ID"
                  tag="Market ID"
                  genStyle="my-0! flex-1"
                />
                <Input
                  element="input"
                  input_type="text"
                  name="search"
                  value={tempSupplierFilters.search ?? ""}
                  handler={handleSupplierChange}
                  placeholder="Search"
                  tag="Search"
                  genStyle="my-0! flex-1"
                />
              </>
            )}

            <Button onClick={handleClear} className="bg-red-500">
              Clear
            </Button>
            <Button primary onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-(--bg-surface) mb-4 block md:hidden">
          <Accordion>
            <Accordion.Item id="filter">
              <Accordion.Trigger id="filter">
                <div className="flex items-center gap-2">
                  <RiFilter2Line />
                  <span>Filters</span>
                </div>
                <RiArrowDownSLine className="transition-transform data-[state=open]:rotate-180" />
              </Accordion.Trigger>
              <Accordion.Content id="filter">
                <div className="flex flex-col gap-2">
                  <Input
                    element="select"
                    name="activeTab"
                    value={activeTab}
                    handler={(e) =>
                      setActiveTab(e.target.value as "suppliers" | "markets")
                    }
                    selectOptions={["suppliers", "markets"]}
                    tag="Request"
                    genStyle="my-0! flex-1"
                  />

                  {activeTab === "markets" ? (
                    <>
                      <Input
                        element="input"
                        input_type="text"
                        name="cityId"
                        value={tempMarketFilters.cityId ?? ""}
                        handler={handleMarketChange}
                        placeholder="City ID"
                        tag="City ID"
                        genStyle="my-0! flex-1"
                      />
                      <Input
                        element="input"
                        input_type="text"
                        name="country"
                        value={tempMarketFilters.country ?? ""}
                        handler={handleMarketChange}
                        placeholder="Country"
                        tag="Country"
                        genStyle="my-0! flex-1"
                      />
                      <Input
                        element="input"
                        input_type="text"
                        name="search"
                        value={tempMarketFilters.search ?? ""}
                        handler={handleMarketChange}
                        placeholder="Search"
                        tag="Search"
                        genStyle="my-0! flex-1"
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        element="input"
                        input_type="text"
                        name="marketId"
                        value={tempSupplierFilters.marketId ?? ""}
                        handler={handleSupplierChange}
                        placeholder="Market ID"
                        tag="Market ID"
                        genStyle="my-0! flex-1"
                      />
                      <Input
                        element="input"
                        input_type="text"
                        name="search"
                        value={tempSupplierFilters.search ?? ""}
                        handler={handleSupplierChange}
                        placeholder="Search"
                        tag="Search"
                        genStyle="my-0! flex-1"
                      />
                    </>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleClear} className="bg-red-500">
                      Clear
                    </Button>
                    <Button primary onClick={handleApply}>
                      Apply
                    </Button>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </div>

        <div className="p-4 rounded-xl bg-(--bg-surface)">
          {isLoading && (
            <div className="h-100 flex items-center justify-center w-full">
              <RiLoader5Fill
                size={48}
                className="text-(--primary) animate-spin"
              />
            </div>
          )}

          {!isLoading && activeTab === "markets" && (
            <>
              <h2 className="text-xl font-bold mb-4">Markets</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {marketsData?.markets.map((market, index) => (
                  <MarketCard key={index} market={market} />
                ))}
              </div>
              <div className="flex justify-self-end">
                <div className="flex items-center gap-2 p-2 rounded-3xl bg-(--bg-muted)">
                  <Button
                    onClick={() =>
                      setAppliedMarketFilters((prev) => ({
                        ...prev,
                        page: prev.page > 1 ? prev.page - 1 : 1,
                      }))
                    }
                  >
                    <RiArrowLeftSLine />
                  </Button>
                  <p>
                    Page {appliedMarketFilters.page} of{" "}
                    {marketsData?.totalPages}
                  </p>
                  <Button
                    onClick={() =>
                      setAppliedMarketFilters((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={
                      appliedMarketFilters.page >=
                      (marketsData?.totalPages || 1)
                    }
                  >
                    <RiArrowRightSLine />
                  </Button>
                </div>
              </div>
            </>
          )}

          {!isLoading && activeTab === "suppliers" && (
            <>
              <h2 className="text-xl font-bold mb-4">Suppliers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {suppliersData?.suppliers.map((supplier, index) => (
                  <SupplierCard key={index} supplier={supplier} />
                ))}
              </div>
              <div className="flex justify-self-end">
                <div className="flex items-center gap-2 p-2 rounded-3xl bg-(--bg-muted)">
                  <Button
                    onClick={() =>
                      setAppliedSupplierFilters((prev) => ({
                        ...prev,
                        page: prev.page > 1 ? prev.page - 1 : 1,
                      }))
                    }
                  >
                    <RiArrowLeftSLine />
                  </Button>
                  <p>
                    Page {appliedSupplierFilters.page} of{" "}
                    {suppliersData?.totalPages}
                  </p>
                  <Button
                    onClick={() =>
                      setAppliedSupplierFilters((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={
                      appliedSupplierFilters.page >=
                      (suppliersData?.totalPages || 1)
                    }
                  >
                    <RiArrowRightSLine />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarketPage;
