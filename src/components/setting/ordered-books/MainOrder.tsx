"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import OrderCard, { OrderDetails } from "./OrderCard";
import TrackingView from "./TrackingView";
import { getApiBaseUrl } from "@/config/api";

interface BackendPrintOrder {
  _id: string;
  book?: {
    _id?: string;
    title?: string;
    theme?: string;
    coverImageUrl?: string;
    creatorName?: string;
  };
  quantity: number;
  pricePerCopy?: number;
  totalAmount: number;
  stripeSessionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  status: "PAYMENT_PENDING" | "PRINTING" | "SHIPPED" | "DELIVERED";
}

const bgColors = ["bg-[#F0F8FF]", "bg-[#F5F0FF]"];

export default function OrderedBooksPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");
  const [trackingOrder, setTrackingOrder] = useState<OrderDetails | null>(null);
  const [orders, setOrders] = useState<BackendPrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStatus === "loading") return;

    const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${getApiBaseUrl()}/print-orders/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const json = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(json?.message || "Failed to load ordered books");
        }

        if (Array.isArray(json?.data)) {
          setOrders(json.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, [sessionStatus, session?.user?.accessToken]);

  const formatAddress = (addr?: BackendPrintOrder["shippingAddress"]) => {
    if (!addr) return "Standard delivery address";
    const parts = [addr.line1, addr.city, addr.country].filter(Boolean);
    return parts.join(", ") || "Standard delivery address";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const ongoingOrders: OrderDetails[] = orders
    .filter((o) => o.status !== "DELIVERED")
    .map((o, index) => ({
      id: o._id,
      orderId: o.stripeSessionId ? o.stripeSessionId.slice(-9).toUpperCase() : o._id.slice(-8).toUpperCase(),
      orderDate: formatDate(o.createdAt || o.paidAt),
      address: formatAddress(o.shippingAddress),
      quantity: o.quantity || 1,
      amount: `£${Number(o.totalAmount || 0).toFixed(2)}`,
      coverImage: o.book?.coverImageUrl || "/images/exp_c_1.jpg",
      bgColor: bgColors[index % bgColors.length],
      rawStatus: o.status,
    }));

  const completedOrders: OrderDetails[] = orders
    .filter((o) => o.status === "DELIVERED")
    .map((o, index) => ({
      id: o._id,
      orderId: o.stripeSessionId ? o.stripeSessionId.slice(-9).toUpperCase() : o._id.slice(-8).toUpperCase(),
      orderDate: formatDate(o.createdAt || o.paidAt),
      deliveryDate: formatDate(o.updatedAt || o.createdAt),
      address: formatAddress(o.shippingAddress),
      quantity: o.quantity || 1,
      amount: `£${Number(o.totalAmount || 0).toFixed(2)}`,
      coverImage: o.book?.coverImageUrl || "/images/exp_c_1.jpg",
      bgColor: bgColors[index % bgColors.length],
      rawStatus: o.status,
    }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Ordered Books</h1>
        <p className="text-sm text-gray-500">
          View all your hardcopy storybooks.
        </p>
      </div>

      {!trackingOrder ? (
        <>
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-100 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab("ongoing")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "ongoing"
                  ? "border-[#E3859A] text-[#E3859A]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Ongoing Hardcopy Book {ongoingOrders.length > 0 && `(${ongoingOrders.length})`}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "completed"
                  ? "border-[#E3859A] text-[#E3859A]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Completed Hardcopy Book {completedOrders.length > 0 && `(${completedOrders.length})`}
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center text-sm text-gray-500 gap-2">
              <Loader2 size={18} className="animate-spin text-[#E3859A]" />
              <span>Loading ordered books...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === "ongoing" && ongoingOrders.length > 0 && (
                ongoingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showTrackingButton={true}
                    onTrackOrder={() => setTrackingOrder(order)}
                  />
                ))
              )}

              {activeTab === "ongoing" && ongoingOrders.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  <p>You don&apos;t have any ongoing hardcopy book orders.</p>
                  <Link
                    href="/setting/generated-books"
                    className="mt-3 inline-block font-semibold text-[#E3859A] hover:underline"
                  >
                    View your generated books
                  </Link>
                </div>
              )}

              {activeTab === "completed" && completedOrders.length > 0 && (
                completedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))
              )}

              {activeTab === "completed" && completedOrders.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500">
                  <p>You don&apos;t have any completed hardcopy book orders yet.</p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
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
