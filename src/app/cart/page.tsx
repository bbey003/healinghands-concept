import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage(): JSX.Element {
  return (
    <div className="container-content py-12">
      <h1 className="display-h2 mb-8">Your cart</h1>
      <CartView />
    </div>
  );
}
