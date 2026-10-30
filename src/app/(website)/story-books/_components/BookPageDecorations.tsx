type BookPageDecorationsProps = {
  pageNumber?: number;
};

/** Matches the playful paper decoration system used by the generated PDF. */
export default function BookPageDecorations({ pageNumber }: BookPageDecorationsProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <span className="absolute -left-10 -top-11 size-28 rounded-full border border-dashed border-[#88B6CF]/75" />
        <span className="absolute left-[7%] top-[8%] size-3 rounded-full bg-[#F6A291]" />
        <span className="absolute left-[23%] top-[14%] size-3 rounded-full bg-[#BCCABB]" />
        <span className="absolute left-[12%] top-[20%] size-5 bg-[#6D9FC2] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        <span className="absolute left-[6%] top-[31%] size-5 rotate-45 border border-[#F6A291]" />
        <span className="absolute bottom-[22%] left-[7%] size-3 rounded-full bg-[#BFCDBD]" />
        <span className="absolute bottom-[11%] left-[10%] size-5 bg-[#F59D88] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        <span className="absolute bottom-[7%] left-[18%] font-sans text-base text-[#6D9FC2]">★</span>
        <span className="absolute bottom-[5%] left-[25%] size-3 rounded-full bg-[#F5B44C]" />

        <span className="absolute right-[10%] top-[9%] size-5 bg-[#F59D88] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        <span className="absolute right-[23%] top-[15%] size-3 rounded-full bg-[#F5B44C]" />
        <span className="absolute right-[8%] top-[21%] font-sans text-base text-[#6D9FC2]">★</span>
        <span className="absolute right-[16%] top-[29%] size-3 rounded-full bg-[#BFCDBD]" />
        <span className="absolute right-[6%] top-[37%] size-5 rotate-45 border border-[#BFCDBD]" />
        <span className="absolute right-[7%] bottom-[25%] size-3 rounded-full bg-[#F6A291]" />
        <span className="absolute bottom-[14%] right-[10%] size-5 bg-[#6D9FC2] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
        <span className="absolute bottom-[7%] right-[7%] size-3 rounded-full bg-[#F6A291]" />
        <span className="absolute bottom-[5%] right-[23%] size-3 rounded-full bg-[#F5B44C]" />
      </div>

      {pageNumber !== undefined && (
        <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full border border-[#E9DFD6] bg-white/90 font-crimson text-xs text-[#302735] shadow-sm">
          {pageNumber}
        </span>
      )}
    </div>
  );
}
