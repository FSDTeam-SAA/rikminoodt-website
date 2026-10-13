import Image from "next/image";
import ExploreStories from "../_components/explore-stories";
import ChooseTheme from "./_components/ChooseTheme";

const StoryBooksPage = () => {
  return (
    <main className="pt-16 lg:pt-20">
      <div className="relative flow-root overflow-hidden">
        <ExploreStories />
        <Image
          src="/images/cloud.png"
          alt=""
          width={154}
          height={98}
          className="pointer-events-none absolute bottom-10 -right-8 h-auto w-[95px] sm:bottom-14 sm:-right-10 sm:w-[125px]"
        />
      </div>
      <ChooseTheme />
    </main>
  );
};

export default StoryBooksPage;
