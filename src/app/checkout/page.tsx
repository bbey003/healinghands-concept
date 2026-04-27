import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/shop/CheckoutFlow";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage(): JSX.Element {
  return (
    <div className="container-content py-12">
      <h1 className="display-h2 mb-8">Checkout</h1>
      <CheckoutFlow />
    </div>
  );
}
