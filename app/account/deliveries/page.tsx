import Deliveries from "@/components/account/Deliveries";

export default function AccountDeliveriesPage() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 lg:text-2xl">
        Deliveries
      </h1>
      <Deliveries />
    </div>
  );
}
