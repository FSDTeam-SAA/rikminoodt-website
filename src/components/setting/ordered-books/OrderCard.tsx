"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

export interface OrderDetails {
  id: string;
  orderId: string;
  orderDate: string;
  deliveryDate?: string;
  address: string;
  quantity: number;
  amount: string;
  coverImage: string;
  bgColor: string;
  rawStatus?: string;
}

interface OrderCardProps {
  order: OrderDetails;
  showTrackingButton?: boolean;
  onTrackOrder?: () => void;
  showCancelLink?: boolean;
}

export default function OrderCard({ order, showTrackingButton, onTrackOrder, showCancelLink }: OrderCardProps) {
  const { t } = useLanguage();
  const copy = t.settings.orders;

  return (
    <div className={`w-full p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center ${order.bgColor}`}>
      {/* Left: Book Image with Shelf */}
      <div className="w-32 md:w-40 flex-shrink-0 flex flex-col items-center">
        <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-lg z-10 bg-[#f9edf0]">
          <Image
            src={order.coverImage}
            alt={copy.bookCover}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 128px, 160px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 mix-blend-overlay"></div>
        </div>
        {/* Wooden Shelf */}
        <div className="w-[115%] h-3 bg-[#D29D59] rounded-b-md shadow-md mt-[-2px] border-t border-[#C08C4A] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
      </div>

      {/* Right: Order Details (White Card) */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm w-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{copy.orderId}</span>
            <span className="text-gray-500 font-mono text-xs sm:text-sm">{order.orderId}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{copy.orderDate}</span>
            <span className="text-gray-500">{order.orderDate}</span>
          </div>
          
          {/* Shudhu Completed list-e Delivery Date dekhabe */}
          {order.deliveryDate && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">{copy.deliveryDate}</span>
              <span className="text-gray-500">{order.deliveryDate}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{copy.deliveryAddress}</span>
            <span className="text-gray-500 text-right max-w-[200px] sm:max-w-none truncate">{order.address}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{copy.quantity}</span>
            <span className="text-gray-500">{order.quantity}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{copy.totalAmount}</span>
            <span className="text-gray-800 font-medium">{order.amount}</span>
          </div>
        </div>

        {/* Buttons / Links at the bottom right */}
        <div className="mt-6 flex justify-end">
          {showTrackingButton && (
            <button 
              type="button"
              onClick={onTrackOrder}
              className="border border-[#E3859A] text-[#E3859A] hover:bg-[#FFF0F2] px-6 py-2 rounded-xl transition-colors text-sm font-medium"
            >
              {copy.trackingOrder}
            </button>
          )}
          {showCancelLink && (
            <button
              type="button"
              className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors underline decoration-red-300 underline-offset-4"
            >
              {copy.cancelOrder}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
