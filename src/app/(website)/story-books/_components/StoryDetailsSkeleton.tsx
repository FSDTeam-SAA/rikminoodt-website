import { Skeleton } from "@/components/ui/skeleton";

export default function StoryDetailsSkeleton() {
  return (
    <section
      className="pb-16 pt-10 sm:pb-20 lg:pt-14"
      aria-label="Loading story details"
    >
      <div className="container mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-0">
        {/* Title */}
        <h1 className="text-center font-fredoka text-[48px] font-normal leading-none text-[#1E1E1E]">
          <span className="text-[#9C81BE]">Story</span>{" "}
          <span className="text-[#55AA82]">Personalised Children&apos;s Books</span>
        </h1>

        {/* Main Details Box */}
        <div className="relative mt-8 rounded-xl border border-[#FFAD79] bg-[#FFF9F3] p-4 sm:p-6 lg:p-8">
          <div className="grid gap-7 md:grid-cols-[minmax(230px,0.76fr)_minmax(0,1.24fr)] md:items-start lg:gap-10">
            {/* Book Cover Skeleton */}
            <div className="mx-auto w-full max-w-[290px] rounded-md bg-[#514256]/15 p-1.5 shadow-[0_10px_20px_rgba(66,52,62,0.12)]">
              <Skeleton className="aspect-[0.76] w-full rounded-sm bg-[#E9DDD0]" />
            </div>

            {/* Details Right Card Skeleton */}
            <div className="rounded-xl bg-white p-5 shadow-[0_4px_14px_rgba(92,76,84,0.08)] sm:p-6">
              <div className="flex items-center justify-between border-b border-[#E9DFD6] pb-4">
                <Skeleton className="h-6 w-36 bg-[#EADFD3]" />
              </div>

              <div className="mt-4 space-y-3 font-sans">
                {/* Title row */}
                <div className="grid grid-cols-[105px_1fr] items-center gap-3 py-1">
                  <Skeleton className="h-4 w-16 bg-[#EADFD3]" />
                  <Skeleton className="h-5 w-52 bg-[#EADFD3]" />
                </div>
                {/* Details rows */}
                {[
                  ["Ages", "w-24"],
                  ["Characters", "w-16"],
                  ["Theme", "w-32"],
                  ["Subject", "w-28"],
                  ["Illustration", "w-36"],
                  ["Language", "w-20"],
                ].map(([label, width]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[105px_1fr] items-center gap-3 py-1"
                  >
                    <Skeleton className="h-4 w-20 bg-[#EADFD3]" />
                    <Skeleton className={`h-4 ${width} bg-[#EADFD3]`} />
                  </div>
                ))}

                {/* Story description */}
                <div className="grid grid-cols-[105px_1fr] items-start gap-3 py-1">
                  <Skeleton className="h-4 w-14 bg-[#EADFD3]" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-full bg-[#EADFD3]" />
                    <Skeleton className="h-3.5 w-[92%] bg-[#EADFD3]" />
                    <Skeleton className="h-3.5 w-[75%] bg-[#EADFD3]" />
                  </div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Skeleton className="h-10 w-28 rounded-lg bg-[#55AA82]/30" />
                <Skeleton className="h-10 w-32 rounded-lg bg-[#9C81BE]/30" />
                <Skeleton className="h-10 w-36 rounded-lg bg-[#E88DA0]/30" />
              </div>
            </div>
          </div>

          {/* Photos Used Section Skeleton */}
          <div className="mt-9 border-t border-[#F0E5D9] pt-6">
            <div className="flex items-center justify-between px-1">
              <Skeleton className="h-5 w-32 bg-[#EADFD3]" />
              <Skeleton className="h-4 w-24 bg-[#EADFD3]" />
            </div>
            <div className="mx-auto mt-6 grid max-w-[880px] grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#F0E5D9] bg-white p-3 shadow-sm"
                >
                  <Skeleton className="aspect-square w-full rounded-lg bg-[#EADFD3]" />
                  <Skeleton className="mx-auto mt-3 h-4 w-20 bg-[#EADFD3]" />
                  <Skeleton className="mx-auto mt-1.5 h-3 w-14 bg-[#EADFD3]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Read Book Preview Section Skeleton */}
        <div className="mt-8 rounded-xl bg-[#FFFCF9] px-5 py-9 text-center shadow-[0_4px_14px_rgba(92,76,84,0.05)] sm:px-8 sm:py-10">
          <Skeleton className="mx-auto h-10 w-60 bg-[#EADFD3]" />

          <div className="mx-auto mt-6 w-full max-w-[300px] rounded-md bg-[#514256]/15 p-1.5">
            <Skeleton className="aspect-[0.76] w-full rounded-sm bg-[#EADFD3]" />
          </div>

          <Skeleton className="mx-auto mt-4 h-4 w-64 bg-[#EADFD3]" />

          <div className="mt-7 flex justify-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((btn) => (
              <Skeleton key={btn} className="size-11 rounded-md bg-[#EADFD3]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

