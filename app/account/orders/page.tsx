import { redirect } from "next/navigation";

export default function AccountOrdersIndexPage() {
  redirect("/account/orders/ongoing");
}
