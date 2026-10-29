import { Skeleton } from "@/components/ui/skeleton";

const detailRows = ["Ages", "Characters", "Theme", "Subject", "Message", "Illustration", "Language", "Creator"];

export default function StoryDetailsSkeleton() {
  return (
    <section className="overflow-x-hidden pb-12 pt-7 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14" aria-label="Loading story details">
      <div className="container mx-auto px-3 sm:px-5 lg:px-0">
        <h1 className="text-balance text-center font-fredoka text-[30px] font-normal leading-[1.12] text-[#1E1E1E] min-[420px]:text-[34px] sm:text-[40px] lg:text-[48px] lg:leading-none">
          <span className="text-[#9C81BE]">Story</span>{" "}
          <span className="text-[#55AA82]">Personalised Children&apos;s Books</span>
        </h1>

        <div className="relative mt-6 rounded-xl border border-[#FFAD79] bg-[#FFF9F3] p-3.5 sm:mt-8 sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(400px,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
            <div className="mx-auto w-full max-w-[280px] rounded-md bg-[#514256]/15 p-1.5 shadow-[0_10px_20px_rgba(66,52,62,0.12)] sm:max-w-[340px] lg:max-w-[420px]">
              <Skeleton className="aspect-[0.76] w-full rounded-sm bg-[#E9DDD0]" />
            </div>

            <div className="min-w-0 rounded-xl bg-white p-4 shadow-[0_4px_14px_rgba(92,76,84,0.08)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9DFD6] pb-4">
                <Skeleton className="h-6 w-36 bg-[#EADFD3]" />
                <Skeleton className="h-10 w-28 rounded-lg bg-[#F7E9EE]" />
              </div>

              <div className="mt-3 divide-y divide-[#EEE6DE]">
                <div className="grid grid-cols-1 gap-1 py-2 min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]">
                  <Skeleton className="h-4 w-12 bg-[#EADFD3]" />
                  <Skeleton className="h-4 w-3/4 bg-[#EADFD3]" />
                </div>
                {detailRows.map((row, index) => (
                  <div key={row} className="grid grid-cols-1 gap-1 py-2 min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]">
                    <Skeleton className="h-4 w-16 bg-[#EADFD3]" />
                    <Skeleton className={`h-4 bg-[#EADFD3] ${index % 3 === 0 ? "w-2/5" : index % 3 === 1 ? "w-1/4" : "w-3/5"}`} />
                  </div>
                ))}
                <div className="grid grid-cols-1 gap-1 py-2 min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]">
                  <Skeleton className="h-4 w-12 bg-[#EADFD3]" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-full bg-[#EADFD3]" />
                    <Skeleton className="h-3.5 w-[88%] bg-[#EADFD3]" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
                <Skeleton className="h-11 w-full rounded-lg bg-[#55AA82]/30 min-[480px]:h-10 min-[480px]:w-28" />
                <Skeleton className="h-11 w-full rounded-lg bg-[#9C81BE]/30 min-[480px]:h-10 min-[480px]:w-32" />
                <Skeleton className="h-11 w-full rounded-lg bg-[#E88DA0]/30 min-[480px]:h-10 min-[480px]:w-36" />
              </div>
            </div>
          </div>

          <div className="mt-9 border-t border-[#F0E5D9] pt-6">
            <div className="flex flex-col items-start justify-between gap-1.5 px-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4">
              <Skeleton className="h-5 w-28 bg-[#EADFD3]" />
              <Skeleton className="h-4 w-24 bg-[#EADFD3]" />
            </div>
            <div className="mt-5 grid w-full max-w-[1080px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:mt-6 sm:grid-cols-4 sm:gap-6">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="min-w-0 overflow-hidden rounded-xl border border-[#F0E5D9] bg-white shadow-[0_7px_16px_rgba(92,76,84,0.13)]">
                  <Skeleton className="aspect-[4/3] w-full rounded-none bg-[#EADFD3]" />
                  <div className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
                    <Skeleton className="mx-auto h-4 w-20 bg-[#EADFD3]" />
                    <Skeleton className="mx-auto mt-1 h-3 w-14 bg-[#EADFD3]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 h-[calc(100svh-78px)] w-full sm:mt-12 sm:h-[calc(100svh-88px)] lg:h-[calc(100svh-116px)]">
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-[min(72vh,620px)] w-[min(88vw,860px)] rounded-md bg-[#E9DDD0]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
