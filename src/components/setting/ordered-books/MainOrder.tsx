"use client";

import { useState } from "react";
import OrderCard, { OrderDetails } from "./OrderCard";
import TrackingView from "./TrackingView";


// Demo Data
const ongoingOrders: OrderDetails[] = [
  {
    id: "1",
    orderId: "R34F34A23",
    orderDate: "3 Jan, 2026",
    address: "London",
    quantity: 2,
    amount: "$45.56",
    coverImage: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=400",
    bgColor: "bg-[#F0F8FF]", // Light Blue
  },
  {
    id: "2",
    orderId: "R34F34A23",
    orderDate: "3 Jan, 2026",
    address: "London",
    quantity: 2,
    amount: "$45.56",
    coverImage: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=400",
    bgColor: "bg-[#F5F0FF]", // Light Purple
  }
];

const completedOrders: OrderDetails[] = [
  {
    id: "3",
    orderId: "R34F34A23",
    orderDate: "3 Jan, 2026",
    deliveryDate: "8 Jan, 2026", // Completed gulo te delivery date ache
    address: "London",
    quantity: 2,
    amount: "$45.56",
    coverImage: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=400",
    bgColor: "bg-[#F0F8FF]", 
  },
  {
    id: "4",
    orderId: "R34F34A23",
    orderDate: "3 Jan, 2026",
    deliveryDate: "8 Jan, 2026",
    address: "London",
    quantity: 2,
    amount: "$45.56",
    coverImage: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=400",
    bgColor: "bg-[#F5F0FF]",
  }
];

export default function OrderedBooksPage() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");
  const [trackingOrder, setTrackingOrder] = useState<OrderDetails | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 h-full min-h-[600px]">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Ordered Books</h1>
        <p className="text-sm text-gray-500">
          View all your generated storybooks.
        </p>
      </div>

      {/* Jodi kono order track kora na hoy, tobe Tab ebong List dekhabo */}
      {!trackingOrder ? (
        <>
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-100 mb-8">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "ongoing"
                  ? "border-[#E3859A] text-[#E3859A]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Ongoing Hardcopy Book
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "completed"
                  ? "border-[#E3859A] text-[#E3859A]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Completed Hardcopy Book
            </button>
          </div>

          {/* List Content */}
          <div className="space-y-6">
            {activeTab === "ongoing" && ongoingOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                showTrackingButton={true} 
                onTrackOrder={() => setTrackingOrder(order)} 
              />
            ))}

            {activeTab === "completed" && completedOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                // Completed order-e kono tracking button nei chobi onujayi
              />
            ))}
          </div>
        </>
      ) : (
        /* Jodi 'Tracking Order' e click kora hoy, tobe TrackingView dekhabo */
        <div className="border rounded-2xl p-6 border-gray-100">
          <TrackingView 
            order={trackingOrder} 
            onBack={() => setTrackingOrder(null)} 
          />
        </div>
      )}

    </div>
  );
}