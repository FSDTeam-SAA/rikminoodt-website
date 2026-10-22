"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Pencil, PencilLine, Sparkles, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { getStoryChoice } from "../../_components/subject-options";

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

type Choice = { label: string; image: string; color?: string };

function ChoiceChip({
  choice,
  href,
  label,
}: {
  choice: Choice | undefined;
  href: string;
  label: string;
}) {
  if (!choice) {
    return (
      <Link
        href={href}
        className="rounded-full border border-dashed border-[#D8C8C2] px-3 py-2 text-sm text-[#856F77]"
      >
        Choose {label.toLowerCase()}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`Edit ${label.toLowerCase()}: ${choice.label}`}
      className="group inline-flex h-9 items-center gap-2 rounded-full px-2 pr-3 font-sans text-sm font-medium text-[#4B4650] transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 sm:h-10 sm:text-base"
      style={{ backgroundColor: choice.color ?? "#FFFFFF" }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45">
        <Image
          src={choice.image}
          alt=""
          fill
          sizes="24px"
          className="object-contain object-bottom"
        />
      </span>
      <span>{choice.label}</span>
      <Pencil
        aria-hidden="true"
        size={14}
        strokeWidth={2.3}
        className="text-[#E5AF32]"
      />
    </Link>
  );
}

export default function SpecialEvents() {
  const router = useRouter();
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    specialEvents: savedEvents,
    setSpecialEvents,
    foreword: initialForeword,
    setForeword,
    forewordMode: initialForewordMode,
    setForewordMode,
    voiceBlob,
    setVoiceBlob,
  } = useBookBuilder();

  const [localForeword, setLocalForeword] = useState(initialForeword || savedEvents || "");
  const [forewordMode, setLocalForewordMode] = useState<"write" | "voice">(initialForewordMode || "write");

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState("");
  const [validationError, setValidationError] = useState("");
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
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (streamRef.current === stream) streamRef.current = null;
        if (!isMounted.current) return;
        setIsRecording(false);
        if (chunks.length) {
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          const url = URL.createObjectURL(blob);
          audioUrlRef.current = url;
          setRecordingUrl(url);
          setVoiceBlob(blob);
        }
      };
      recorder.start();
      setSeconds(0);
      setIsRecording(true);
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (isMounted.current)
        setRecordingError("Unable to access your microphone. Please check your browser permissions.");
    } finally {
      requestingMic.current = false;
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const handleAiHelp = () => {
    setLocalForeword(
      "May this magical story fill your heart with joy, courage, and endless wonder. Always believe in yourself and follow your dreams."
    );
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (forewordMode === "voice" && !voiceBlob) {
      setValidationError("Record a voice message before continuing, or switch to Write.");
      return;
    }
    setValidationError("");
    setSpecialEvents(localForeword);
    setForeword(localForeword);
    setForewordMode(forewordMode);
    router.push("/book-builder/personal-details");
  };

  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = getStoryChoice(selectedStory, selectedTheme);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);
  const illustrationLabels = ["3d Animation", "Water Colour", "Geometric", "Claymation", "Sticker Art", "Comic Book", "Gouache", "Soft Anime"];
  const illustrationIndex = illustrationLabels.indexOf(selectedIllustration ?? "");
  const illustration = illustrationIndex >= 0 ? { label: illustrationLabels[illustrationIndex], image: `/images/ill_${illustrationIndex + 1}.png`, color: "#FFFFFF" } : undefined;

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section
        className="mx-auto max-w-[1280px]"
        aria-labelledby="special-events-heading"
      >
        <h1
          id="special-events-heading"
          className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]"
        >
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          Choose a theme, add their name and special details, and create a
          personalized eBook they&apos;ll love. Turn it into a beautiful
          hardcover keepsake to treasure forever.
        </p>

        <section
          className="mt-10 rounded-[19px] bg-[#FBF3EA] px-3 py-4 sm:px-5 sm:py-6 lg:px-10 lg:py-10"
          aria-labelledby="special-events-options-heading"
        >
          <h2
            id="special-events-options-heading"
            className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]"
          >
            Build a Magical Story Just for Them
          </h2>
          <p className="mt-3 font-sans text-sm font-normal leading-none text-[#444444] sm:text-base lg:mt-5 lg:text-[20px]">
            Your Choice
          </p>
          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip
              label="Age"
              choice={age}
              href="/book-builder/choose-age"
            />
            <ChoiceChip
              label="Theme"
              choice={theme}
              href="/book-builder/choose-theme"
            />
            <ChoiceChip
              label="Subject"
              choice={story}
              href="/book-builder/choose-story"
            />
            <ChoiceChip
              label="Message"
              choice={message}
              href="/book-builder/personalize"
            />
            <ChoiceChip
              label="Illustration"
              choice={illustration}
              href="/book-builder/illustration"
            />
            <ChoiceChip
              label="Font"
              choice={font}
              href="/book-builder/choose-font"
            />
            <ChoiceChip
              label="Language"
              choice={
                selectedLanguage
                  ? {
                      label: selectedLanguage,
                      image: "/images/flag.png",
                      color: "#FFFBDF",
                    }
                  : undefined
              }
              href="/book-builder/language"
            />
          </div>

          <h3 className="mt-8 font-sans text-lg font-semibold leading-none text-[#1E1E1E] lg:mt-10 lg:text-[28px]">
            Special events for the story
          </h3>
          <p className="mt-2 font-sans text-sm text-[#444444] sm:text-base">
            This is optional. Describe events or write an inspiring foreword you&apos;d like to see in the story.
          </p>

          <div className="mt-7 max-w-[1120px] rounded-[10px] border border-[#F3A8B7] bg-white/20 p-3 sm:p-5">
            <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
              <span className="font-sans text-sm font-medium text-[#252025]">
                Special event or foreword
              </span>
              <div className="mx-auto flex w-fit items-center rounded-xl bg-[#FBE6EA] p-1.5 font-sans text-sm sm:text-base">
                <button
                  type="button"
                  onClick={() => {
                    voiceModeRef.current = false;
                    stopRecording();
                    setLocalForewordMode("write");
                  }}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 transition ${
                    forewordMode === "write" ? "bg-[#E88DA0] text-white shadow-sm" : "text-[#252025]"
                  }`}
                >
                  <PencilLine aria-hidden="true" size={18} /> Write
                </button>
                <button
                  type="button"
                  onClick={() => {
                    voiceModeRef.current = true;
                    setLocalForewordMode("voice");
                  }}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 transition ${
                    forewordMode === "voice" ? "bg-[#E88DA0] text-white shadow-sm" : "text-[#252025]"
                  }`}
                >
                  <Mic aria-hidden="true" size={18} /> Voice
                </button>
              </div>
              <button
                type="button"
                onClick={handleAiHelp}
                className="inline-flex h-11 items-center gap-2 justify-self-start rounded-xl bg-[#FBE6EA] px-5 font-sans text-sm text-[#A06676] transition hover:bg-[#F8D8DF] sm:justify-self-end sm:text-base"
              >
                <Sparkles aria-hidden="true" size={18} /> Let AI help
              </button>
            </div>

            <textarea
              placeholder="e.g. birthday, holidays, favorite memories or write an inspiring message"
              hidden={forewordMode !== "write"}
              value={localForeword}
              onChange={(event) => setLocalForeword(event.target.value)}
              className="mt-4 min-h-[150px] w-full resize-y rounded-[8px] border border-[#F4D7DD] bg-[#FFFCFA] px-3.5 py-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] hover:border-[#EDC7D0] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25 sm:min-h-[180px]"
            />

            {forewordMode === "voice" && (
              <div className="mt-4 flex min-h-[245px] flex-col items-center justify-center rounded-lg border border-[#F5CED7] bg-white px-4 py-8 text-center sm:min-h-[290px]">
                {isRecording ? (
                  <>
                    <p className="font-sans text-xs text-[#E88DA0]"><span aria-hidden="true">●</span> Recording</p>
                    <p className="mt-1 font-sans text-xl text-[#514256]" aria-label={`Recording time ${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds`}>
                      {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
                    </p>
                    <div aria-hidden="true" className="my-7 flex h-4 items-center gap-[3px]">
                      {Array.from({ length: 24 }, (_, index) => (
                        <span
                          key={index}
                          className="w-[3px] rounded-full bg-[#E88DA0]"
                          style={{ height: `${index % 5 === 0 ? 12 : index % 3 === 0 ? 8 : 5}px` }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      aria-label="Stop recording"
                      className="flex size-[106px] items-center justify-center rounded-full bg-[#FFE1E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
                    >
                      <span className="flex size-14 items-center justify-center rounded-full bg-white text-[#E88DA0] shadow-[0_3px_14px_rgba(157,102,164,0.25)]">
                        <Square aria-hidden="true" size={16} fill="currentColor" />
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-sans text-lg font-semibold text-[#514256]">What&apos;s your idea?</p>
                    <p className="mt-1 font-sans text-sm text-[#AAA5A8]">Tap the mic and start speaking</p>
                    <button
                      type="button"
                      onClick={startRecording}
                      aria-label="Start recording"
                      className="mt-7 flex size-[88px] items-center justify-center rounded-full bg-[#FBE4E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
                    >
                      <span className="flex size-[72px] items-center justify-center rounded-full bg-[#F3B8C5]">
                        <span className="flex size-[58px] items-center justify-center rounded-full bg-[#E88DA0] text-white">
                          <Mic aria-hidden="true" size={21} />
                        </span>
                      </span>
                    </button>
                    {recordingUrl && (
                      <audio controls src={recordingUrl} className="mt-5 max-w-full" aria-label="Play recorded foreword" />
                    )}
                    {recordingError && (
                      <p role="alert" className="mt-4 font-sans text-sm text-[#B74760]">{recordingError}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#E88DA0] px-7 font-sans text-sm font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
            >
              Next Step
            </button>
          </div>
          {validationError && (
            <p role="alert" className="mt-3 text-center font-sans text-sm text-[#B74760]">
              {validationError}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
