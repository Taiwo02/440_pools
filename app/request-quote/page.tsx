import type { Metadata } from "next";
import RfqLandingPage from "@/components/requestForQuot/RfqLandingPage";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Submit a request for quotation for bulk or custom sourcing.",
};

export default function RequestQuotePage() {
  return <RfqLandingPage />;
}
