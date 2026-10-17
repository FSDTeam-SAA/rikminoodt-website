import Image from "next/image";

export interface OrderDetails {
  id: string;
  orderId: string;
  orderDate: string;
  deliveryDate?: string;
  address: string;
  quantity: number;
  amount: string;
  coverImage: string;
  bgColor: string; // jemon: bg-[#EAF5FA] ba bg-[#F3EAFC]
}

interface OrderCardProps {
  order: OrderDetails;
  showTrackingButton?: boolean;
  onTrackOrder?: () => void;
  showCancelLink?: boolean;
}

export default function OrderCard({ order, showTrackingButton, onTrackOrder, showCancelLink }: OrderCardProps) {
  return (
    <div className={`w-full p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center ${order.bgColor}`}>
      {/* Left: Book Image with Shelf */}
      <div className="w-32 md:w-40 flex-shrink-0 flex flex-col items-center">
        <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-lg z-10">
          <Image src={order.coverImage} alt="Book Cover" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 mix-blend-overlay"></div>
        </div>
        {/* Wooden Shelf */}
        <div className="w-[115%] h-3 bg-[#D29D59] rounded-b-md shadow-md mt-[-2px] border-t border-[#C08C4A] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
      </div>

      {/* Right: Order Details (White Card) */}
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm w-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Order ID:</span>
            <span className="text-gray-500">{order.orderId}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Order date:</span>
            <span className="text-gray-500">{order.orderDate}</span>
          </div>
          
          {/* Shudhu Completed list-e Delivery Date dekhabe */}
          {order.deliveryDate && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Delivery date:</span>
              <span className="text-gray-500">{order.deliveryDate}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Delivery address:</span>
            <span className="text-gray-500">{order.address}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Quantity:</span>
            <span className="text-gray-500">{order.quantity}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">Total amount:</span>
            <span className="text-gray-800 font-medium">{order.amount}</span>
          </div>
        </div>

        {/* Buttons / Links at the bottom right */}
        <div className="mt-6 flex justify-end">
          {showTrackingButton && (
            <button 
              onClick={onTrackOrder}
              className="border border-[#E3859A] text-[#E3859A] hover:bg-[#FFF0F2] px-6 py-2 rounded-xl transition-colors text-sm font-medium"
            >
              Tracking Order
            </button>
          )}
          {showCancelLink && (
            <button className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors underline decoration-red-300 underline-offset-4">
              Cancel order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}