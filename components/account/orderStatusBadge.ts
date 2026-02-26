import { OrderStatus } from "@/types/checkout";


export const getOrderStatusVariant = (
  status: OrderStatus
): "primary" | "secondary" | "warning" | "success" | "danger" => {
  switch (status) {
    // Neutral / early stage
    case "CREATED":
    case "LOCKED":
      return "secondary";

    // Payment in progress
    case "AWAITING_BALANCE":
    case "PARTIALLY_PAID":
      return "warning";

    // Paid states
    case "PAID":
    case "PAID_IN_FULL":
      return "primary";

    // Fulfillment
    case "PROCESSING":
    case "SHIPPED":
      return "primary";

    // Completed
    case "DELIVERED":
    case "COMPLETED":
      return "success";

    // Failed / problem
    case "CANCELLED":
    case "REFUNDED":
    case "DEFAULTED":
    case "DISPUTE_RAISED":
      return "danger";

    default:
      return "secondary";
  }
};