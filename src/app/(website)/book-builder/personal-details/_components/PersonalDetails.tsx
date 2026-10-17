"use client";

import Image from "next/image";
import Link from "next/link";
import { Mic, Pencil, PencilLine, Sparkles, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";

const ages = [
  { label: "0-2 Years", image: "/images/age_1.png", color: "#FDE1CF" },
  { label: "3-5 Years", image: "/images/age_2.png", color: "#DDEEFF" },
  { label: "5-9 Years", image: "/images/age_3.png", color: "#FADDE0" },
  { label: "10+ Years", image: "/images/age_4.png", color: "#D7EEE1" },
  { label: "Adult", image: "/images/age_5.png", color: "#E2D7F3" },
];

const themes = [
  { label: "Fairy Tales", image: "/images/theme_1.png", color: "#FFE5D4" },
  { label: "Adventure", image: "/images/theme_2.png", color: "#DDEEFF" },
  { label: "Activities", image: "/images/theme_3.png", color: "#FFDDE2" },
  { label: "Worlds", image: "/images/theme_4.png", color: "#D2EBD9" },
  { label: "Holidays", image: "/images/theme_5.png", color: "#D2E8D8" },
  { label: "Family", image: "/images/theme_6.png", color: "#FFDFE4" },
  { label: "Educational", image: "/images/theme_7.png", color: "#FFE5D4" },
  { label: "Feelings", image: "/images/theme_8.png", color: "#DDEEFF" },
];

const stories = [
  { label: "Unicorns", image: "/images/story_1.png", color: "#FFE5D6" },
  { label: "Princess & Princesses", image: "/images/story_2.png", color: "#DDEEFF" },
  { label: "Knights and dragons", image: "/images/story_3.png", color: "#FFDDE4" },
  { label: "Wizard School", image: "/images/story_4.png", color: "#D1ECD9" },
  { label: "The Magic Forest", image: "/images/story_5.png", color: "#CFE9DA" },
  { label: "Mermaids", image: "/images/story_6.png", color: "#FADDE1" },
  { label: "Gnomes", image: "/images/story_7.png", color: "#FFE5D4" },
  { label: "Fairies and Elves", image: "/images/story_8.png", color: "#DDEEFF" },
  { label: "Witches and Spells", image: "/images/story_9.png", color: "#D4EBDD" },
  { label: "Giants", image: "/images/story_10.png", color: "#F8DCE3" },
];

const messages = [
  { label: "Friendship", image: "/images/per_1.png", color: "#FFE5D6" },
  { label: "Courage", image: "/images/per_2.png", color: "#DDEEEF" },
  { label: "Caring for nature", image: "/images/per_3.png", color: "#FFDDE4" },
  { label: "Love", image: "/images/per_4.png", color: "#E6DAF1" },
  { label: "Perseverance", image: "/images/per_5.png", color: "#FFF0D3" },
  { label: "Sharing", image: "/images/per_6.png", color: "#FCE2E7" },
  { label: "Honesty", image: "/images/per_7.png", color: "#DCEDE7" },
  { label: "Respect", image: "/images/per_8.png", color: "#FFDCD4" },
];

const fonts = [
  { label: "Storybook Classic", image: "/images/font_1.png", color: "#FFF6DE" },
  { label: "Smooth Sands", image: "/images/font_2.png", color: "#DDEEFF" },
  { label: "Bubbly Tales", image: "/images/font_3.png", color: "#F9DDE8" },
  { label: "Candy Dreams", image: "/images/font_4.png", color: "#F4D8FC" },
  { label: "Neon Nexus", image: "/images/font_5.png", color: "#202044" },
  { label: "Cosy Curves", image: "/images/font_6.png", color: "#FFEAE4" },
  { label: "School Script", image: "/images/font_7.png", color: "#F8F7F0" },
  { label: "Adventure Book", image: "/images/font_8.png", color: "#F0D39F" },
];

type Choice = { label: string; image: string; color: string };

function ChoiceChip({ choice }: { choice?: Choice }) {
  if (!choice) return null;

  return (
    <div
      className="inline-flex h-7 items-center gap-1.5 rounded-full px-2 pr-2.5 font-sans text-[10px] font-medium text-[#4B4650] sm:h-9 sm:gap-2 sm:px-2 sm:pr-3 sm:text-sm"
      style={{ backgroundColor: choice.color }}
    >
      <span className="relative size-4 overflow-hidden rounded-full bg-white/45 sm:size-6">
        <Image src={choice.image} alt="" fill sizes="24px" className="object-contain object-bottom" />
      </span>
      <span>{choice.label}</span>
      <Pencil aria-hidden="true" size={11} strokeWidth={2.5} className="text-[#E5AF32] sm:size-[13px]" />
    </div>
  );
}

function FormField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block font-sans text-sm font-medium text-[#252025]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-8 w-full rounded-[5px] border border-[#F3A8B7] bg-[#FFFCFA] px-2.5 font-sans text-[10px] text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:h-9 sm:text-xs"
      />
    </label>
  );
}

export default function PersonalDetails() {
  const { selectedAge, selectedTheme, selectedStory, selectedMessage, selectedIllustration, selectedFont, selectedLanguage } = useBookBuilder();
  const [forewordMode, setForewordMode] = useState<"write" | "voice">("write");
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMounted = useRef(true);
  const requestingMic = useRef(false);
  const voiceModeRef = useRef(false);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    if (requestingMic.current || isRecording) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecordingError("Voice recording is not supported in this browser.");
      return;
    }
    requestingMic.current = true;
    setRecordingError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isMounted.current || !voiceModeRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (streamRef.current === stream) streamRef.current = null;
        if (!isMounted.current) return;
        setIsRecording(false);
        if (chunks.length) {
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          const url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
          audioUrlRef.current = url;
          setRecordingUrl(url);
        }
      };
      recorder.start();
      setSeconds(0);
      setIsRecording(true);
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (isMounted.current) setRecordingError("Unable to access your microphone. Please check your browser permissions.");
    } finally {
      requestingMic.current = false;
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = stories.find((item) => item.label === selectedStory);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);
  const illustrationLabels = ["3d Animation", "Water Colour", "Geometric", "Claymation", "Sticker Art", "Comic Book", "Gouache", "Soft Anime"];
  const illustrationIndex = illustrationLabels.indexOf(selectedIllustration ?? "");
  const illustration = illustrationIndex >= 0 ? { label: illustrationLabels[illustrationIndex], image: `/images/ill_${illustrationIndex + 1}.png`, color: "#FFFFFF" } : undefined;

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-3 pb-8 pt-[102px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="personal-details-heading">
        <h1 id="personal-details-heading" className="font-crimson text-[22px] leading-none text-[#1E1E1E] sm:text-4xl lg:text-[48px]">
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-3 max-w-[1120px] font-sans text-[10px] leading-[1.4] text-[#444444] sm:mt-5 sm:text-lg lg:text-[24px]">
          Choose a theme, add their name and special details, and create a personalized eBook they&apos;ll love. Turn it into a beautiful hardcover keepsake to treasure forever.
        </p>

        <section className="mt-5 w-full rounded-[18px] bg-[#FBF3EA] p-3 sm:mt-10 sm:p-6 lg:p-10" aria-labelledby="builder-summary-heading">
          <h2 id="builder-summary-heading" className="font-fredoka text-sm leading-none text-[#E88DA0] sm:text-xl lg:text-[32px]">Build a Magical Story Just for Them</h2>
          <p className="mt-3 font-sans text-xs text-[#444444] sm:text-base lg:mt-5 lg:text-[20px]">Your Choice</p>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-3">
            <ChoiceChip choice={age} />
            <ChoiceChip choice={theme} />
            <ChoiceChip choice={story} />
            <ChoiceChip choice={message} />
            <ChoiceChip choice={illustration} />
            <ChoiceChip choice={font} />
            <ChoiceChip choice={selectedLanguage ? { label: selectedLanguage, image: "/images/flag.png", color: "#FFFBDF" } : undefined} />
          </div>

          <div className="mt-6 sm:mt-9">
            <h3 className="font-sans text-sm font-semibold text-[#1E1E1E] sm:text-lg lg:text-[28px]">Your personal details</h3>
            <p className="mt-1 font-sans text-[10px] text-[#66605F] sm:text-sm">Give the book a unique and personal touch by including the creator of the book.</p>
          </div>

          <div className="mt-3 rounded-[7px] border border-[#F3A8B7] bg-white/20 p-2 sm:mt-5 sm:p-4">
            <FormField label="Creator of the book" placeholder="Enter the author’s name" />
            <div className="mt-4 grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
              <span className="font-sans text-sm font-medium text-[#252025]">Foreword in the book</span>
              <div className="mx-auto flex w-fit items-center rounded-xl bg-[#FBE6EA] p-1.5 font-sans text-sm sm:text-base">
                <button type="button" onClick={() => { voiceModeRef.current = false; stopRecording(); setForewordMode("write"); }} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 transition ${forewordMode === "write" ? "bg-[#E88DA0] text-white shadow-sm" : "text-[#252025]"}`}><PencilLine aria-hidden="true" size={18} /> Write</button>
                <button type="button" onClick={() => { voiceModeRef.current = true; setForewordMode("voice"); }} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 transition ${forewordMode === "voice" ? "bg-[#E88DA0] text-white shadow-sm" : "text-[#252025]"}`}><Mic aria-hidden="true" size={18} /> Voice</button>
              </div>
              <button type="button" className="inline-flex h-11 items-center gap-2 justify-self-start rounded-xl bg-[#FBE6EA] px-5 font-sans text-sm text-[#A06676] transition hover:bg-[#F8D8DF] sm:justify-self-end sm:text-base"><Sparkles aria-hidden="true" size={18} /> Let AI help</button>
            </div>
            <textarea placeholder="Write an inspiring message" hidden={forewordMode !== "write"} className="mt-2 min-h-[150px] w-full resize-y rounded-[5px] border border-[#F3A8B7] bg-[#FFFCFA] px-2.5 py-2 font-sans text-[10px] text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:min-h-[180px] sm:text-xs" />
            {forewordMode === "voice" && (
              <div className="mt-3 flex min-h-[245px] flex-col items-center justify-center rounded-lg border border-[#F5CED7] bg-white px-4 py-8 text-center sm:min-h-[290px]">
                {isRecording ? (
                  <>
                    <p className="font-sans text-xs text-[#E88DA0]"><span aria-hidden="true">●</span> Recording</p>
                    <p className="mt-1 font-sans text-xl text-[#514256]" aria-label={`Recording time ${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds`}>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</p>
                    <div aria-hidden="true" className="my-7 flex h-4 items-center gap-[3px]">{Array.from({ length: 24 }, (_, index) => <span key={index} className="w-[3px] rounded-full bg-[#E88DA0]" style={{ height: `${index % 5 === 0 ? 12 : index % 3 === 0 ? 8 : 5}px` }} />)}</div>
                    <button type="button" onClick={stopRecording} aria-label="Stop recording" className="flex size-[106px] items-center justify-center rounded-full bg-[#FFE1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"><span className="flex size-14 items-center justify-center rounded-full bg-white text-[#E88DA0] shadow-[0_3px_14px_rgba(157,102,164,0.25)]"><Square aria-hidden="true" size={16} fill="currentColor" /></span></button>
                  </>
                ) : (
                  <>
                    <p className="font-sans text-lg font-semibold text-[#514256]">What&apos;s your idea?</p>
                    <p className="mt-1 font-sans text-sm text-[#AAA5A8]">Tap the mic and start speaking</p>
                    <button type="button" onClick={startRecording} aria-label="Start recording" className="mt-7 flex size-[88px] items-center justify-center rounded-full bg-[#FBE4E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"><span className="flex size-[72px] items-center justify-center rounded-full bg-[#F3B8C5]"><span className="flex size-[58px] items-center justify-center rounded-full bg-[#E88DA0] text-white"><Mic aria-hidden="true" size={21} /></span></span></button>
                    {recordingUrl && <audio controls src={recordingUrl} className="mt-5 max-w-full" aria-label="Play recorded foreword" />}
                    {recordingError && <p role="alert" className="mt-4 font-sans text-sm text-[#B74760]">{recordingError}</p>}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-5 sm:mt-7">
            <h3 className="font-sans text-sm font-semibold text-[#1E1E1E] sm:text-lg lg:text-[28px]">Your details</h3>
            <p className="mt-1 font-sans text-[10px] text-[#66605F] sm:text-sm">Fill in your details to create an account and save your book.</p>
          </div>
          <div className="mt-3 space-y-4 rounded-[7px] border border-[#F3A8B7] bg-white/20 p-2 sm:mt-5 sm:space-y-5 sm:p-4">
            <FormField label="Name" placeholder="Enter your full name" />
            <FormField label="Country" placeholder="United Kingdom" />
            <FormField label="Email" placeholder="you123@gmail.com" type="email" />
            <FormField label="Confirm email" placeholder="you123@gmail.com" type="email" />
            <FormField label="Password (min 8 letters)" placeholder="Choose strong password" type="password" />
          </div>

          <p className="mt-3 rounded-[5px] bg-[#FFF1C6] px-2 py-2 font-sans text-[8px] leading-[1.3] text-[#B78631] sm:mt-5 sm:text-[10px]">ⓘ Almost there. Your digital book costs £9.99. If you also order a hardcover book later, this amount is deducted from it.</p>
          <div className="mt-4 flex justify-center sm:mt-6">
            <Link href="/book-builder/special-events" className="inline-flex h-8 items-center rounded-xl bg-[#E88DA0] px-5 font-sans text-[10px] font-semibold text-white shadow-[0_4px_10px_rgba(232,141,160,0.22)] transition hover:bg-[#DD7893] sm:h-10 sm:px-7 sm:text-sm">Next Step</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

