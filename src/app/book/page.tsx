import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { LoadingScreen } from "@/components/ui/Loading";

export const metadata: Metadata = { title: "Book an appointment" };

export default function BookPage(): JSX.Element {
  return (
    <div className="container-content py-12">
      <p className="eyebrow">Appointments</p>
      <h1 className="display-h2 mt-2 mb-8">Book your session</h1>
      <Suspense fallback={<LoadingScreen />}>
        <BookingFlow />
      </Suspense>
    </div>
  );
}
