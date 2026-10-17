import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ShoppingBag } from "lucide-react";

export type CartBook = {
  id: string;
  title: string;
  image: string;
  format: string;
  price: number;
  quantity: number;
};

type CartPageProps = {
  isSignedIn?: boolean;
  books?: CartBook[];
};

const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-xl px-6 font-sans text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2";

export default function CartPage({ isSignedIn = false, books = [] }: CartPageProps) {
  const total = books.reduce((sum, book) => sum + book.price * book.quantity, 0);
  const formatPrice = (amount: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);

  return (
    <main className="relative min-h-[520px] overflow-hidden bg-[#FBF3EA] px-5 pb-20 pt-14 sm:px-8 sm:pb-28 sm:pt-16 lg:pt-20">
      <Image src="/images/cloud.png" alt="" width={160} height={107} className="pointer-events-none absolute -right-12 top-20 hidden h-auto w-36 opacity-70 sm:block" />
      <Image src="/images/parasut.png" alt="" width={110} height={130} className="pointer-events-none absolute -bottom-4 left-0 hidden h-auto w-20 opacity-80 sm:block" />
      <section aria-labelledby="cart-heading" className="relative mx-auto max-w-[1120px]">
        <h1 id="cart-heading" className="font-sans text-2xl font-semibold text-[#1E1E1E] sm:text-3xl">Cart</h1>
        {!isSignedIn || books.length === 0 ? (
          <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white px-5 py-12 text-center shadow-[0_3px_15px_rgba(104,78,71,0.05)] sm:min-h-[360px]">
            <span className="flex size-14 items-center justify-center rounded-full border border-[#FFD1BE] bg-[#FFF7F2] text-[#E88DA0]"><ShoppingBag size={22} aria-hidden="true" /></span>
            <h2 className="mt-5 font-sans text-base font-semibold text-[#1E1E1E] sm:text-lg">{isSignedIn ? "Your cart is empty" : "Log in to view your cart"}</h2>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {isSignedIn ? (
                <Link href="/setting/generated-books" className={`${buttonClass} bg-[#E88DA0] hover:bg-[#DD7893]`}>Add Book</Link>
              ) : (
                <button type="button" disabled className={`${buttonClass} cursor-not-allowed bg-[#9C81BE] opacity-70`}>Log in</button>
              )}
              <Link href="/book-builder/choose-age" className={`${buttonClass} ${isSignedIn ? "bg-[#9C81BE] hover:bg-[#8667AD]" : "bg-[#E88DA0] hover:bg-[#DD7893]"}`}>{isSignedIn ? "Create a new book" : "Create a children's book"}</Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl bg-white p-5 shadow-[0_3px_15px_rgba(104,78,71,0.05)] sm:p-7">
              <div className="flex items-center gap-3 border-b border-[#F1E5DE] pb-5"><span className="flex size-10 items-center justify-center rounded-full bg-[#FFF0F3] text-[#E88DA0]"><BookOpen size={19} aria-hidden="true" /></span><h2 className="font-sans text-lg font-semibold text-[#292329]">Your books</h2></div>
              <ul className="divide-y divide-[#F1E5DE]">
                {books.map((book) => (
                  <li key={book.id} className="flex gap-4 py-5 sm:gap-5">
                    <Image src={book.image} alt={`Cover of ${book.title}`} width={100} height={135} className="h-[110px] w-[82px] shrink-0 rounded-md object-cover shadow-sm sm:h-[135px] sm:w-[100px]" />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div><h3 className="font-sans text-base font-semibold text-[#292329] sm:text-lg">{book.title}</h3><p className="mt-2 text-sm text-[#756E73]">{book.format}</p><p className="mt-1 text-sm text-[#756E73]">Quantity: {book.quantity}</p></div>
                      <p className="font-sans text-base font-bold text-[#514256]">{formatPrice(book.price * book.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/setting/generated-books" className="inline-flex items-center gap-2 text-sm font-semibold text-[#D87990] hover:text-[#B75E78]">Add another book <ArrowRight aria-hidden="true" size={16} /></Link>
            </div>
            <aside className="rounded-2xl bg-white p-6 shadow-[0_3px_15px_rgba(104,78,71,0.05)]" aria-labelledby="cart-summary-heading">
              <h2 id="cart-summary-heading" className="font-sans text-lg font-semibold text-[#292329]">Order summary</h2>
              <div className="mt-5 flex items-center justify-between border-t border-[#F1E5DE] pt-5 font-sans text-base font-semibold text-[#514256]"><span>Total</span><span>{formatPrice(total)}</span></div>
              <button type="button" disabled className="mt-6 flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-xl bg-[#E88DA0] px-5 text-sm font-semibold text-white opacity-70">Continue to checkout</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
