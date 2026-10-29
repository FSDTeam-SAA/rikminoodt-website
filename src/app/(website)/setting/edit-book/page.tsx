"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import CoverTab from "@/components/setting/book-editor/CoverTab";
import PrefaceTab from "@/components/setting/book-editor/PrefaceTab";
import StoryTab from "@/components/setting/book-editor/StoryTab";
import FontTab from "@/components/setting/book-editor/FontTab";
import type { EditableBook, EditableBookPage } from "@/components/setting/book-editor/types";
import { getApiBaseUrl } from "@/config/api";

type Tab = "cover" | "preface" | "story" | "font";

type BookApiResponse = Partial<EditableBook> & {
  status?: string;
  pages?: Array<Partial<EditableBookPage>>;
};

const titlePositions = new Set(["Top", "Middle", "Bottom"]);

function asEditableBook(data: BookApiResponse): EditableBook | null {
  if (!data._id) return null;
  return {
    _id: data._id,
    title: data.title || "",
    titlePosition: titlePositions.has(data.titlePosition || "") ? data.titlePosition as EditableBook["titlePosition"] : "Middle",
    creatorName: data.creatorName || "",
    backCoverText: data.backCoverText || "",
    foreword: data.foreword || "",
    font: data.font || "STORYBOOK_CLASSIC",
    coverImageUrl: data.coverImageUrl,
    pages: (data.pages || []).map((page, index) => ({
      pageNumber: Number(page.pageNumber ?? index + 1),
      storyPageNumber: page.storyPageNumber,
      text: page.text || "",
      title: page.title || "",
      imageUrl: page.imageUrl,
      kind: page.kind,
    })).sort((a, b) => a.pageNumber - b.pageNumber),
  };
}

export default function BookEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const bookId = searchParams.get("book_id");
  const [activeTab, setActiveTab] = useState<Tab>("cover");
  const [book, setBook] = useState<EditableBook | null>(null);
  const initialBookRef = useRef<EditableBook | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const detailsHref = bookId ? `/story-books/book-details/${encodeURIComponent(bookId)}` : "/setting/generated-books";
  const tabs: { id: Tab; label: string }[] = [
    { id: "cover", label: "Cover" },
    { id: "preface", label: "Preface" },
    { id: "story", label: "Story" },
    { id: "font", label: "Font" },
  ];

  useEffect(() => {
    if (sessionStatus === "loading") return;
    const token = session?.user?.accessToken || localStorage.getItem("token");
    const controller = new AbortController();

    if (!bookId) {
      setError("Choose a generated book before opening the editor.");
      setLoading(false);
      return () => controller.abort();
    }
    if (!token) {
      setError("Please sign in to edit your book.");
      setLoading(false);
      return () => controller.abort();
    }

    const loadBook = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(result?.message || "Unable to load this book for editing.");
        if (result?.data?.status !== "COMPLETED") throw new Error("Only completed books can be edited.");
        const editableBook = asEditableBook(result.data);
        if (!editableBook) throw new Error("This book could not be loaded for editing.");
        if (!controller.signal.aborted) {
          setBook(editableBook);
          initialBookRef.current = JSON.parse(JSON.stringify(editableBook)) as EditableBook;
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load this book for editing.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadBook();
    return () => controller.abort();
  }, [bookId, sessionStatus, session?.user?.accessToken]);

  useEffect(() => () => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
  }, [coverPreviewUrl]);

  const updateBook = (field: "title" | "titlePosition" | "creatorName" | "backCoverText" | "foreword" | "font", value: string) => {
    setBook((current) => current ? { ...current, [field]: value } : current);
  };

  const updatePage = (pageNumber: number, field: "text" | "title", value: string) => {
    setBook((current) => current ? {
      ...current,
      pages: current.pages.map((page) => page.pageNumber === pageNumber ? { ...page, [field]: value } : page),
    } : current);
  };

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverImage(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const saveBook = async () => {
    if (!book || !bookId || saving) return;
    const initialBook = initialBookRef.current;
    const token = session?.user?.accessToken || localStorage.getItem("token");
    if (!initialBook || !token) {
      setError("Please sign in again before saving your changes.");
      return;
    }

    const invalidPage = book.pages.find((page) => page.kind !== "cover" && !page.text.trim());
    if (invalidPage) {
      setError(`Page ${invalidPage.storyPageNumber ?? invalidPage.pageNumber} needs text before it can be saved.`);
      return;
    }

    const changedPages = book.pages.reduce<Array<{ pageNumber: number; text: string; title?: string }>>((changes, page) => {
      const originalPage = initialBook.pages.find((candidate) => candidate.pageNumber === page.pageNumber);
      if (!originalPage || (page.text === originalPage.text && (page.title || "") === (originalPage.title || ""))) return changes;
      changes.push({ pageNumber: page.pageNumber, text: page.text, ...(page.title !== (originalPage.title || "") ? { title: page.title || "" } : {}) });
      return changes;
    }, []);

    const formData = new FormData();
    if (book.title !== initialBook.title) formData.append("title", book.title);
    if (book.titlePosition !== initialBook.titlePosition) formData.append("titlePosition", book.titlePosition);
    if (book.creatorName !== initialBook.creatorName) formData.append("creatorName", book.creatorName);
    if (book.backCoverText !== initialBook.backCoverText) formData.append("backCoverText", book.backCoverText);
    if (book.foreword !== initialBook.foreword) formData.append("foreword", book.foreword);
    if (book.font !== initialBook.font) formData.append("font", book.font);
    if (changedPages.length) formData.append("pages", JSON.stringify(changedPages));
    if (coverImage) formData.append("coverImage", coverImage);

    const hasChanges =
      book.title !== initialBook.title ||
      book.titlePosition !== initialBook.titlePosition ||
      book.creatorName !== initialBook.creatorName ||
      book.backCoverText !== initialBook.backCoverText ||
      book.foreword !== initialBook.foreword ||
      book.font !== initialBook.font ||
      changedPages.length > 0 ||
      Boolean(coverImage);
    if (!hasChanges) {
      router.push(detailsHref);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${getApiBaseUrl()}/books/${encodeURIComponent(bookId)}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Unable to save your book changes.");
      router.push(detailsHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your book changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-[#FCF8F5] px-4 text-sm text-gray-500"><Loader2 size={20} className="mr-2 animate-spin" /> Loading your book…</main>;
  }

  if (!book) {
    return <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FCF8F5] px-4 text-center"><p className="text-sm text-[#a34259]">{error || "This book is unavailable for editing."}</p><Link href="/setting/generated-books" className="mt-4 text-sm font-medium text-[#E3859A] underline">Back to generated books</Link></main>;
  }

  return (
    <div className="min-h-screen bg-[#FCF8F5] px-4 py-6 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="py-2 sm:py-4">
          <div className="relative z-10 mb-6">
            <Link href={detailsHref} className="mb-1 inline-flex items-center gap-2 text-gray-800 hover:text-gray-600"><ChevronLeft size={20} /><span className="font-serif text-xl">Back to your book</span></Link>
            <p className="ml-7 text-sm text-gray-500">Edit your generated storybooks.</p>
          </div>
          <div className="mb-6 flex flex-wrap gap-2.5 sm:gap-4">
            {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors sm:px-8 ${activeTab === tab.id ? "bg-[#E3859A] text-white shadow-sm" : "border border-[#E3859A] bg-white text-[#E3859A] hover:bg-[#FFF0F2]"}`}>{tab.label}</button>)}
          </div>
          <div className="overflow-hidden rounded-xl border border-[#F0A976] bg-white">
            {activeTab === "cover" && <CoverTab coverImageUrl={book.coverImageUrl} coverPreviewUrl={coverPreviewUrl || undefined} title={book.title} titlePosition={book.titlePosition} creatorName={book.creatorName} backCoverText={book.backCoverText} onCoverImageChange={handleCoverImageChange} onChange={updateBook} />}
            {activeTab === "preface" && <PrefaceTab value={book.foreword} onChange={(value) => updateBook("foreword", value)} />}
            {activeTab === "story" && <StoryTab pages={book.pages} onChange={updatePage} />}
            {activeTab === "font" && <FontTab value={book.font} title={book.title} sampleText={book.pages.find((page) => page.kind === "story")?.text || book.foreword} onChange={(value) => updateBook("font", value)} />}
          </div>
          {error && <p role="alert" className="mt-4 text-center text-sm text-[#a34259]">{error}</p>}
        </div>
        <div className="mt-8 flex justify-center">
          <button type="button" disabled={saving} onClick={saveBook} className="inline-flex items-center gap-2 rounded-xl bg-[#E3859A] px-10 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-[#d67288] disabled:cursor-not-allowed disabled:opacity-60">{saving && <Loader2 size={16} className="animate-spin" />}{saving ? "Saving…" : "Save and View Book"}</button>
        </div>
      </div>
    </div>
  );
}
