"use client";

import { Check, ChevronLeft, PackageCheck, Truck, House } from "lucide-react";
import OrderCard, { OrderDetails } from "./OrderCard";

interface TrackingViewProps {
  order: OrderDetails;
  onBack: () => void;
}

const trackingSteps = [
  { label: "Order placed", description: "Payment confirmed", icon: Check },
  { label: "Processing", description: "We are preparing your book", icon: PackageCheck },
  { label: "Shipped", description: "On its way to you", icon: Truck },
  { label: "Delivered", description: "Enjoy your storybook", icon: House },
];

export default function TrackingView({ order, onBack }: TrackingViewProps) {
  const getStepFromStatus = (status?: string): number => {
    switch (status) {
      case "PAYMENT_PENDING":
        return 0;
      case "PRINTING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 1;
    }
  };

  const activeStep = getStepFromStatus(order.rawStatus);
  const completedLineWidth = (activeStep / (trackingSteps.length - 1)) * 75;

  return (
    <div className="animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to orders"
          className="rounded-full p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A]"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Tracking Order</h2>
          <p className="text-xs text-gray-500">Order #{order.orderId}</p>
        </div>
      </div>

      <section aria-label="Order progress" className="mb-10 rounded-2xl border border-[#EDF1EE] bg-[#FBFDFC] px-3 py-6 sm:px-6 md:px-10">
        <div className="relative">
          <div className="absolute left-[12.5%] right-[12.5%] top-6 h-1 rounded-full bg-[#E4EAE6]" />
          <div
            className="absolute left-[12.5%] top-6 h-1 rounded-full bg-[#96C2A7] transition-[width] duration-300"
            style={{ width: `${completedLineWidth}%` }}
          />

          <ol className="relative grid grid-cols-4">
            {trackingSteps.map((step, index) => {
              const isComplete = index < activeStep;
              const isActive = index === activeStep;
              const Icon = step.icon;

              return (
                <li key={step.label} className="flex min-w-0 flex-col items-center text-center">
                  <div
                    className={`flex size-12 items-center justify-center rounded-full border-4 shadow-sm transition-colors ${
                      isComplete
                        ? "border-[#DDEEE3] bg-[#96C2A7] text-white"
                        : isActive
                          ? "border-[#D9EAF5] bg-[#82B3D6] text-white ring-4 ring-[#82B3D6]/15"
                          : "border-[#EEF1F0] bg-white text-gray-400"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2.3} aria-hidden="true" />
                  </div>

                  <span
                    className={`mt-3 text-xs font-semibold sm:text-sm ${
                      isComplete ? "text-[#57916E]" : isActive ? "text-[#5A96C2]" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="mt-1 hidden max-w-28 text-[11px] leading-tight text-gray-400 sm:block">
                    {step.description}
                  </span>
                  {isActive && (
                    <span className="mt-2 rounded-full bg-[#EAF4FB] px-2 py-0.5 text-[10px] font-semibold text-[#5A96C2]">
                      Current
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <OrderCard order={order} showCancelLink={activeStep <= 1} />
    </div>
  );
}
