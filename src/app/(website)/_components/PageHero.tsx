import Image from "next/image";

type PageHeroProps = {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Shared banner for informational website pages.
 * Change the content for each page through the title and description props.
 */
export default function PageHero({
  title,
  description,
  imageSrc = "/images/cont_pri_img.png",
  imageAlt = "Decorative page banner",
}: PageHeroProps) {
  return (
    <section className="relative flex h-[58svh] min-h-[400px] w-full items-center justify-center overflow-hidden pt-16 text-center sm:min-h-[470px] sm:pt-20 lg:min-h-[520px]">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/65" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <h1 className="font-crimson text-4xl font-bold leading-tight text-[#1E1E1E] sm:text-5xl lg:text-[56px]">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-[#333333] sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
