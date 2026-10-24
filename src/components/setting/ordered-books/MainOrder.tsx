"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import OrderCard, { OrderDetails } from "./OrderCard";
import TrackingView from "./TrackingView";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
  const { t, language } = useLanguage();
  const copy = t.settings.orders;
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
          throw new Error(json?.message || copy.loadFailed);
        }

        if (Array.isArray(json?.data)) {
          setOrders(json.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : copy.ordersLoadFailed);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, [copy.loadFailed, copy.ordersLoadFailed, sessionStatus, session?.user?.accessToken]);

  const formatAddress = (addr?: BackendPrintOrder["shippingAddress"]) => {
    if (!addr) return copy.standardAddress;
    const parts = [addr.line1, addr.city, addr.country].filter(Boolean);
    return parts.join(", ") || copy.standardAddress;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return copy.notAvailable;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const locale = language === "nl" ? "nl-NL" : language === "fr" ? "fr-FR" : "en-GB";
    return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
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
        <h1 className="text-2xl font-serif text-gray-800 mb-2">{t.settings.orderedBooks}</h1>
        <p className="text-sm text-gray-500">
          {copy.description}
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
              {copy.ongoing} {ongoingOrders.length > 0 && `(${ongoingOrders.length})`}
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
              {copy.completed} {completedOrders.length > 0 && `(${completedOrders.length})`}
            </button>
          </div>

          {loading ? (
            <div role="status" aria-label={copy.loading} className="animate-pulse space-y-6">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="rounded-2xl border border-[#F2E9EC] bg-[#FFFDFD] p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="h-28 w-24 shrink-0 rounded-xl bg-[#F6EEF1]" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-2/5 rounded-full bg-[#F3E7EB]" />
                      <div className="h-4 w-3/5 rounded-full bg-[#F7EFF2]" />
                      <div className="h-4 w-1/2 rounded-full bg-[#F7EFF2]" />
                      <div className="mt-5 h-10 w-36 rounded-xl bg-[#F3E7EB]" />
                    </div>
                  </div>
                </div>
              ))}
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
                  <p>{copy.noOngoing}</p>
                  <Link
                    href="/setting/generated-books"
                    className="mt-3 inline-block font-semibold text-[#E3859A] hover:underline"
                  >
                    {copy.viewGenerated}
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
                  <p>{copy.noCompleted}</p>
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
