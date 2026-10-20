import { Skeleton } from "@/components/ui/skeleton";

export default function StoryDetailsSkeleton() {
  return (
    <section
      className="pb-12 pt-7 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14"
      aria-label="Loading story details"
    >
      <div className="container mx-auto max-w-[1080px] px-4 sm:px-8 lg:px-0">
        {/* Title */}
        <h1 className="text-balance text-center font-fredoka text-[30px] font-normal leading-[1.12] text-[#1E1E1E] min-[420px]:text-[34px] sm:text-[40px] lg:text-[48px] lg:leading-none">
          <span className="text-[#9C81BE]">Story</span>{" "}
          <span className="text-[#55AA82]">Personalised Children&apos;s Books</span>
        </h1>

        {/* Main Details Box */}
        <div className="relative mt-6 rounded-xl border border-[#FFAD79] bg-[#FFF9F3] p-3.5 sm:mt-8 sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(230px,0.76fr)_minmax(0,1.24fr)] lg:items-start lg:gap-10">
            {/* Book Cover Skeleton */}
            <div className="mx-auto w-full max-w-[240px] rounded-md bg-[#514256]/15 p-1.5 shadow-[0_10px_20px_rgba(66,52,62,0.12)] sm:max-w-[290px]">
              <Skeleton className="aspect-[0.76] w-full rounded-sm bg-[#E9DDD0]" />
            </div>

            {/* Details Right Card Skeleton */}
            <div className="min-w-0 rounded-xl bg-white p-4 shadow-[0_4px_14px_rgba(92,76,84,0.08)] sm:p-6">
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
              <div className="mt-6 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
                <Skeleton className="h-11 w-full rounded-lg bg-[#55AA82]/30 min-[480px]:h-10 min-[480px]:w-28" />
                <Skeleton className="h-11 w-full rounded-lg bg-[#9C81BE]/30 min-[480px]:h-10 min-[480px]:w-32" />
                <Skeleton className="h-11 w-full rounded-lg bg-[#E88DA0]/30 min-[480px]:h-10 min-[480px]:w-36" />
              </div>
            </div>
          </div>

          {/* Photos Used Section Skeleton */}
          <div className="mt-9 border-t border-[#F0E5D9] pt-6">
            <div className="flex items-center justify-between px-1">
              <Skeleton className="h-5 w-32 bg-[#EADFD3]" />
              <Skeleton className="h-4 w-24 bg-[#EADFD3]" />
            </div>
            <div className="mx-auto mt-5 grid max-w-[880px] grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-0 rounded-xl border border-[#F0E5D9] bg-white p-2.5 shadow-sm sm:p-3"
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
        <div className="mt-6 rounded-xl bg-[#FFFCF9] px-3.5 py-7 text-center shadow-[0_4px_14px_rgba(92,76,84,0.05)] sm:mt-8 sm:px-8 sm:py-10">
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

