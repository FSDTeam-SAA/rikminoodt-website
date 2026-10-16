import Image from "next/image";

const features = [
  { title: "AI-Powered Stories", description: "Turn your child's ideas into unique, heartwarming stories with the magic of AI.", image: "fairy_tales.png", color: "bg-[#FFF2E4]" },
  { title: "Consistent Characters", description: "Keep your child's character looking the same throughout every adventure for a truly personal experience.", image: "family.png", color: "bg-[#EEF9FF]" },
  { title: "Magical Illustrations", description: "Beautiful enchanting illustrations bring every story to life in a special way.", image: "worlds.png", color: "bg-[#F5F0FF]" },
  { title: "Multiple Languages", description: "Create stories in your preferred language and share the magic with family around the world.", image: "feelings.png", color: "bg-[#F3FCEE]" },
  { title: "Interactive Book Editor", description: "Easily personalise the text, images and details with a simple and enjoyable editing experience.", image: "activities.png", color: "bg-[#FFF1F3]" },
  { title: "Digital & Printed Books", description: "Download a high-quality digital book instantly or order a beautiful hardcover keepsake delivered to your door.", image: "educational.png", color: "bg-[#FFF9ED]" },
];

const StoryMagical = () => {
  return (
    <section className="pb-16 sm:pb-20" aria-labelledby="story-magical-heading">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <div className="rounded-2xl bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
          <header className="mx-auto max-w-3xl text-center">
            <h2 id="story-magical-heading" className="font-crimson text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-none text-[#1E1E1E]">
              Everything That Makes Your Story Magical
            </h2>
            <p className="mt-3 font-sans text-[18px] leading-normal text-[#444444]">
              Discover powerful features that make every story more personal, engaging and memorable for your child.
            </p>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className={`flex min-h-[250px] flex-col items-center rounded-xl px-5 py-5 text-center ${feature.color}`}>
                <Image src={`/images/choose_your-theme/${feature.image}`} alt="" width={170} height={150} className="h-[132px] w-auto object-contain sm:h-[145px]" />
                <h3 className="mt-3 font-crimson text-xl font-semibold leading-none text-[#514256]">{feature.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#5C5559]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryMagical;
