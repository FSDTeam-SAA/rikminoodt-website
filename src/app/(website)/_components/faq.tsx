"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

const faqs = [
  { question: "What is the Kids Book Generator?", answer: "It is a simple way to create a magical, personalised storybook where your child is the hero of their very own adventure." },
  { question: "How can I create a personalized kids book?", answer: "Choose a story theme, add your child's details, and personalise the adventure in just a few friendly steps." },
  { question: "Can I add my child's name to the story?", answer: "Yes. Your child's name is woven naturally into the story to make every page feel made especially for them." },
  { question: "What age groups are the books suitable for?", answer: "Our storybooks are designed for curious young readers and make a lovely shared reading experience for families." },
  { question: "Can I choose the story theme or characters?", answer: "Yes. Pick the theme that sparks your child's imagination, then create an adventure they will love returning to." },
  { question: "Can I customize the illustrations?", answer: "You can personalise key story details so the finished book feels truly unique to your child." },
  { question: "Can I download or print the book?", answer: "Your completed storybook can be prepared for you to enjoy and share with your family." },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionId = useId();

  return ( 
    <section id="faq" aria-labelledby="faq-heading" className="overflow-hidden py-14 sm:py-16 lg:mb-32 lg:py-0">
      <div className="container relative mx-auto px-5 sm:px-10 lg:px-0">
        <header className="text-center">
          <h2 id="faq-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-2 text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">
            Discover magical adventures, exciting themes, and heartwarming stories created to make every child the hero.
          </p>
        </header>

        <div className="relative mt-8 lg:mt-12 lg:pr-[178px]">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `${sectionId}-panel-${index}`;
              const buttonId = `${sectionId}-button-${index}`;

              return (
                <article key={faq.question} className="overflow-hidden rounded-xl border border-[#ded2df] bg-[#ece5ef] shadow-[0_2px_3px_rgba(77,54,77,0.08)]">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex min-h-[54px] w-full items-center gap-3 px-4 py-2 text-left font-crimson text-lg leading-snug text-[#514554] transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#987fc5] sm:min-h-[58px] sm:px-5 sm:text-xl lg:min-h-[63px] lg:px-6 lg:text-2xl"
                    >
                      <Image src="/images/faq_icon.png" alt="" width={20} height={28} className="h-6 w-auto shrink-0 sm:h-[26px]" />
                      <span className="flex-1">{faq.question}</span>
                      {isOpen ? <Minus aria-hidden="true" size={22} strokeWidth={1.8} /> : <Plus aria-hidden="true" size={22} strokeWidth={1.8} />}
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-[#d9cddd] px-11 pb-4 pt-3 text-sm leading-relaxed text-[#5c5559] sm:px-12 lg:px-14 lg:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <Image src="/images/faq.png" alt="A curious child looking for answers" width={237} height={289} className="pointer-events-none absolute bottom-[97px] right-[-20px] hidden h-auto w-[229px] lg:block" />
        </div>
      </div>
    </section>
  );
};

export default Faq;
