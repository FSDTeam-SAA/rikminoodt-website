import Image from "next/image";
import { BookOpen, ChevronLeft, ChevronRight, Download, Grid2X2, Images, Pencil, Printer } from "lucide-react";

const story = {
  title: "Lisa's Camping Adventure",
  cover: "/images/story1.png",
  details: [
    ["Ages", "3 - 5 years"],
    ["Characters", "4"],
    ["Theme", "Adventure"],
    ["Illustration", "Collage"],
    ["Language", "English"],
  ],
  description:
    "When Lisa arrives at the camping ground with her family, she thinks the outdoor life will be boring. But an exciting adventure soon follows! She discovers new friends and they walk across a magical forest, make a big difference in protecting the home of forest creatures. Join Lisa on her heartwarming adventure as she discovers the magic of friendship by being a great friend to the world.",
};

const photos = [
  { name: "Our little camper!", role: "Main character", image: "/images/profile.png", rotate: "sm:-rotate-2" },
  { name: "Brave explorer!", role: "Friend", image: "/images/book_customer.jpg", rotate: "sm:rotate-2" },
  { name: "Best friend!", role: "Pet friend", image: "/images/story3.png", rotate: "sm:-rotate-1" },
  { name: "Happy traveller!", role: "Family", image: "/images/book_reveiew.jpg", rotate: "sm:rotate-2" },
];

const StoryDetails = ({ storyId }: { storyId: string }) => {
  return (
    <section className="pb-16 pt-10 sm:pb-20 lg:pt-14" aria-labelledby="story-details-heading">
      <div className="container mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-0">
        <h1 id="story-details-heading" className="text-center font-fredoka text-[48px] font-normal leading-none text-[#1E1E1E]">
          <span className="text-[#9C81BE]">Story</span>{" "}
          <span className="text-[#55AA82]">Personalised Children&apos;s Books</span>
        </h1>

        <div className="relative mt-8 rounded-xl border border-[#FFAD79] bg-[#FFF9F3] p-4 sm:p-6 lg:p-8">
          <div className="grid gap-7 md:grid-cols-[minmax(230px,0.76fr)_minmax(0,1.24fr)] md:items-start lg:gap-10">
            <div className="mx-auto w-full max-w-[290px] rounded-md bg-[#514256] p-1.5 shadow-[0_10px_20px_rgba(66,52,62,0.28)]">
              <Image
                src={story.cover}
                alt={`Cover of ${story.title}`}
                width={396}
                height={512}
                className="aspect-[0.76] w-full rounded-sm object-cover object-top"
                priority
              />
            </div>

            <div className="rounded-xl bg-white p-5 shadow-[0_4px_14px_rgba(92,76,84,0.08)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9DFD6] pb-4">
                <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-[#1E1E1E]">
                  <BookOpen size={19} className="text-[#F27643]" aria-hidden="true" />
                  Story Details
                </h2>
                <button type="button" className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#F1C1CF] px-3 py-1.5 font-sans text-sm text-[#E88DA0] transition-colors hover:bg-[#FFF2F5]">
                  Edit Book <Pencil size={14} aria-hidden="true" />
                </button>
              </div>

              <dl className="mt-3 divide-y divide-[#EEE6DE] font-sans text-sm">
                {story.details.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[105px_1fr] gap-3 py-2 text-[#514A4E]">
                    <dt className="font-medium text-[#756E73]">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[105px_1fr] gap-3 py-2 text-[#514A4E]">
                  <dt className="font-medium text-[#756E73]">Story</dt>
                  <dd className="leading-relaxed">{story.description}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#9C81BE] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#8667AD]">
                  <Download size={16} aria-hidden="true" /> Download PDF
                </button>
                <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E88DA0] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#DF7894]">
                  <Printer size={16} aria-hidden="true" /> Order Hardcopy
                </button>
              </div>
            </div>
          </div>

          <div className="mt-9 border-t border-[#F0E5D9] pt-6">
            <div className="flex items-center justify-between gap-4 px-1">
              <h2 className="inline-flex items-center gap-2 font-sans text-base font-semibold text-[#514256]">
                <Images size={16} className="text-[#9C81BE]" aria-hidden="true" /> Photos used
              </h2>
              <button type="button" className="inline-flex cursor-pointer items-center gap-1.5 font-sans text-sm text-[#514256] transition-colors duration-200 hover:text-[#9C81BE]">
                <Grid2X2 size={15} aria-hidden="true" /> View All 4 Photos
              </button>
            </div>
            <div className="mx-auto mt-5 grid max-w-[670px] grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-7">
              {photos.map((photo) => (
                <article key={photo.name} className={`rounded-md bg-white p-2.5 shadow-[0_5px_12px_rgba(92,76,84,0.14)] transition-transform duration-300 hover:rotate-0 ${photo.rotate}`}>
                  <Image src={photo.image} alt="" width={130} height={130} className="h-[122px] w-full rounded-sm object-cover sm:h-[132px]" />
                  <p className="mt-2 truncate text-center font-crimson text-xs font-semibold text-[#514256]">{photo.name}</p>
                  <p className="mt-0.5 truncate text-center font-sans text-[10px] text-[#8A8086]">{photo.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-xl bg-[#FFFCF9] px-5 py-9 text-center shadow-[0_4px_14px_rgba(92,76,84,0.05)] sm:px-8 sm:py-10" aria-labelledby="read-book-heading">
          <h2 id="read-book-heading" className="font-fredoka text-[48px] font-normal leading-none">
            <span className="text-[#55A7CF]">Read</span>{" "}
            <span className="text-[#E0A94C]">the book</span>
          </h2>
          <div className="mx-auto mt-6 w-full max-w-[300px] rounded-md bg-[#514256] p-1.5 shadow-[0_12px_24px_rgba(66,52,62,0.28)]">
            <Image src={story.cover} alt={`Preview of ${story.title}`} width={396} height={512} className="aspect-[0.76] w-full rounded-sm object-cover object-top" />
          </div>
          <div className="mt-5 flex justify-center gap-1.5" aria-label={`Page navigation for story ${storyId}`}>
            <button type="button" aria-label="Previous page" className="flex size-6 cursor-pointer items-center justify-center rounded border border-[#F0D8AF] text-[#B08A49] transition-colors hover:bg-[#FFF5E2]">
              <ChevronLeft size={13} aria-hidden="true" />
            </button>
            {[1, 2, 3].map((page) => (
              <button key={page} type="button" aria-label={`Go to page ${page}`} className={`flex size-6 cursor-pointer items-center justify-center rounded border font-sans text-xs transition-colors ${page === 1 ? "border-[#E0A94C] bg-[#E0A94C] text-white" : "border-[#F0D8AF] text-[#B08A49] hover:bg-[#FFF5E2]"}`}>
                {page}
              </button>
            ))}
            <button type="button" aria-label="Next page" className="flex size-6 cursor-pointer items-center justify-center rounded border border-[#F0D8AF] text-[#B08A49] transition-colors hover:bg-[#FFF5E2]">
              <ChevronRight size={13} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default StoryDetails;
