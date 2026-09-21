import type { Metadata } from "next";
import RfqLandingPage from "@/components/services/requestForQuot/RfqLandingPage";

export const metadata: Metadata = {
  title: "RFQ",
  description: "Request a quotation.",
};

export default function RfqShortcutPage() {
  return <RfqLandingPage />;
}
