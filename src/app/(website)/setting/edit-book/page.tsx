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
import type { BookCharacter, EditableBook, EditableBookPage } from "@/components/setting/book-editor/types";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Tab = "cover" | "preface" | "story" | "font";

type BookApiResponse = Partial<EditableBook> & {
  status?: string;
  pages?: Array<Partial<EditableBookPage>>;
  characters?: BookCharacter[];
  language?: string;
  theme?: string;
  subject?: string;
  illustrationStyle?: string;
  ageCategory?: string;
};

const titlePositions = new Set(["Top", "Middle", "Bottom"]);

function asEditableBook(data: BookApiResponse): EditableBook | null {
  if (!data._id) return null;
  const backCoverText = data.backCoverText || data.pages?.find((p) => p.kind === "finalMessage")?.text || "";
  const foreword = data.foreword || data.pages?.find((p) => p.kind === "welcome")?.text || "";
  return {
    _id: data._id,
    title: data.title || "",
    titlePosition: titlePositions.has(data.titlePosition || "") ? data.titlePosition as EditableBook["titlePosition"] : "Middle",
    creatorName: data.creatorName || "",
    backCoverText,
    foreword,
    font: data.font || "STORYBOOK_CLASSIC",
    coverImageUrl: data.coverImageUrl,
    language: data.language,
    theme: data.theme,
    subject: data.subject,
    illustrationStyle: data.illustrationStyle,
    ageCategory: data.ageCategory,
    characters: data.characters,
    pages: (data.pages || []).map((page, index) => {
      let pageText = page.text || "";
      let pageImageUrl = page.imageUrl;
      if (page.kind === "cover" && data.coverImageUrl) {
        pageImageUrl = data.coverImageUrl;
      }
      if (page.kind === "finalMessage" && backCoverText) {
        pageText = backCoverText;
      } else if (page.kind === "welcome" && foreword) {
        pageText = foreword;
      }
      return {
        pageNumber: Number(page.pageNumber ?? index + 1),
        storyPageNumber: page.storyPageNumber,
        text: pageText,
        title: page.title || "",
        imageUrl: pageImageUrl,
        kind: page.kind,
      };
    }).sort((a, b) => a.pageNumber - b.pageNumber),
  };
}

export default function BookEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const { t } = useLanguage();
  const editBookT = t.settings?.editBook;
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
    { id: "cover", label: editBookT?.tabs?.cover || "Cover" },
    { id: "preface", label: editBookT?.tabs?.preface || "Preface" },
    { id: "story", label: editBookT?.tabs?.story || "Story" },
    { id: "font", label: editBookT?.tabs?.font || "Font" },
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

        // Merge any locally saved page image overrides
        try {
          if (typeof window !== "undefined" && bookId) {
            const storedCover = localStorage.getItem(`boekerello_cover_image_${bookId}`);
            if (storedCover) {
              editableBook.coverImageUrl = storedCover;
            }

            const stored = localStorage.getItem(`boekerello_page_images_${bookId}`);
            if (stored) {
              const overrides: Record<number, string> = JSON.parse(stored);
              editableBook.pages = editableBook.pages.map((p) => ({
                ...p,
                imageUrl: (p.kind === "cover" && storedCover) ? storedCover : (overrides[p.pageNumber] || p.imageUrl),
              }));
            } else if (storedCover) {
              editableBook.pages = editableBook.pages.map((p) => ({
                ...p,
                imageUrl: p.kind === "cover" ? storedCover : p.imageUrl,
              }));
            }
          }
        } catch {
          /* ignore storage errors */
        }

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
    setBook((current) => {
      if (!current) return current;
      if (field === "backCoverText") {
        return {
          ...current,
          backCoverText: value,
          pages: current.pages.map((p) => p.kind === "finalMessage" ? { ...p, text: value } : p),
        };
      }
      if (field === "foreword") {
        return {
          ...current,
          foreword: value,
          pages: current.pages.map((p) => p.kind === "welcome" ? { ...p, text: value } : p),
        };
      }
      return { ...current, [field]: value };
    });
  };

  const updatePage = (pageNumber: number, field: "text" | "title", value: string) => {
    setBook((current) => {
      if (!current) return current;
      const targetPage = current.pages.find((p) => p.pageNumber === pageNumber);
      const updatedPages = current.pages.map((page) =>
        page.pageNumber === pageNumber ? { ...page, [field]: value } : page
      );
      if (field === "text" && targetPage?.kind === "finalMessage") {
        return { ...current, backCoverText: value, pages: updatedPages };
      }
      if (field === "text" && targetPage?.kind === "welcome") {
        return { ...current, foreword: value, pages: updatedPages };
      }
      return { ...current, pages: updatedPages };
    });
  };

  const updatePageImage = (pageNumber: number, imageUrl: string) => {
    try {
      if (typeof window !== "undefined" && bookId) {
        const stored = localStorage.getItem(`boekerello_page_images_${bookId}`);
        const overrides: Record<number, string> = stored ? JSON.parse(stored) : {};
        overrides[pageNumber] = imageUrl;
        localStorage.setItem(`boekerello_page_images_${bookId}`, JSON.stringify(overrides));
      }
    } catch {
      /* ignore storage errors */
    }
    setBook((current) => current ? {
      ...current,
      pages: current.pages.map((page) => page.pageNumber === pageNumber ? { ...page, imageUrl } : page),
    } : current);
  };

  const reorderPages = (newOrderedPages: EditableBookPage[]) => {
    setBook((current) => {
      if (!current) return current;
      // Preserve non-editable cover pages
      const coverPages = current.pages.filter((p) => p.kind === "cover");
      return {
        ...current,
        pages: [...coverPages, ...newOrderedPages],
      };
    });
  };

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    const preview = URL.createObjectURL(file);
    setCoverImage(file);
    setCoverPreviewUrl(preview);
    setBook((current) => current ? {
      ...current,
      coverImageUrl: preview,
      pages: current.pages.map((p) => p.kind === "cover" ? { ...p, imageUrl: preview } : p),
    } : current);
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

    const changedPages = book.pages.reduce<Array<{ pageNumber: number; text: string; title?: string; imageUrl?: string }>>((changes, page) => {
      const originalPage = initialBook.pages.find((candidate) => candidate.pageNumber === page.pageNumber);
      const textChanged = !originalPage || page.text !== originalPage.text;
      const titleChanged = !originalPage || (page.title || "") !== (originalPage.title || "");
      const imageChanged = !originalPage || (page.imageUrl || "") !== (originalPage.imageUrl || "");

      if (textChanged || titleChanged || imageChanged) {
        changes.push({
          pageNumber: page.pageNumber,
          text: page.text,
          ...(titleChanged || page.title ? { title: page.title || "" } : {}),
          ...(imageChanged && page.imageUrl ? { imageUrl: page.imageUrl } : {}),
        });
      }
      return changes;
    }, []);

    // 1. Persist all updated page images in localStorage so reader and editor load them immediately
    try {
      if (typeof window !== "undefined" && bookId) {
        const stored = localStorage.getItem(`boekerello_page_images_${bookId}`);
        const overrides: Record<number, string> = stored ? JSON.parse(stored) : {};
        book.pages.forEach((p) => {
          if (p.imageUrl && p.kind !== "cover") {
            overrides[p.pageNumber] = p.imageUrl;
          }
        });
        localStorage.setItem(`boekerello_page_images_${bookId}`, JSON.stringify(overrides));
      }
    } catch {
      /* ignore storage errors */
    }

    // 2. If a cover image file was chosen, upload to /api/upload to obtain a permanent URL for instant preview
    if (coverImage) {
      try {
        const coverFormData = new FormData();
        coverFormData.append("file", coverImage);
        const coverUploadRes = await fetch("/api/upload", {
          method: "POST",
          body: coverFormData,
        });
        if (coverUploadRes.ok) {
          const coverUploadJson = await coverUploadRes.json();
          if (coverUploadJson?.url && typeof window !== "undefined" && bookId) {
            localStorage.setItem(`boekerello_cover_image_${bookId}`, coverUploadJson.url);
          }
        }
      } catch {
        /* continue */
      }
    }

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
      const targetHref = `${detailsHref}${detailsHref.includes("?") ? "&" : "?"}updated=${Date.now()}`;
      router.push(targetHref);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your book changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FCF8F5] px-4 text-sm text-gray-500">
        <Loader2 size={20} className="mr-2 animate-spin" /> {editBookT?.loadingBook || "Loading your book…"}
      </main>
    );
  }

  if (!book) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FCF8F5] px-4 text-center">
        <p className="text-sm text-[#a34259]">{error || editBookT?.bookUnavailable || "This book is unavailable for editing."}</p>
        <Link href="/setting/generated-books" className="mt-4 text-sm font-medium text-[#E3859A] underline">
          {editBookT?.backToGenerated || "Back to generated books"}
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF8F5] px-4 py-6 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="py-2 sm:py-4">
          <div className="relative z-10 mb-6">
            <Link href={detailsHref} className="mb-1 inline-flex items-center gap-2 text-gray-800 hover:text-gray-600">
              <ChevronLeft size={20} />
              <span className="font-serif text-xl">{editBookT?.backToBook || "Back to your book"}</span>
            </Link>
            <p className="ml-7 text-sm text-gray-500">{editBookT?.subtitle || "Edit your generated storybooks."}</p>
          </div>
          <div className="mb-6 flex flex-wrap gap-2.5 sm:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors sm:px-8 ${
                  activeTab === tab.id
                    ? "bg-[#E3859A] text-white shadow-sm"
                    : "border border-[#E3859A] bg-white text-[#E3859A] hover:bg-[#FFF0F2]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-[#F0A976] bg-white">
            {activeTab === "cover" && (
              <CoverTab
                coverImageUrl={book.coverImageUrl}
                coverPreviewUrl={coverPreviewUrl || undefined}
                title={book.title}
                titlePosition={book.titlePosition}
                creatorName={book.creatorName}
                backCoverText={book.backCoverText}
                onCoverImageChange={handleCoverImageChange}
                onChange={updateBook}
              />
            )}
            {activeTab === "preface" && (
              <PrefaceTab
                value={book.foreword}
                onChange={(value) => updateBook("foreword", value)}
                bookId={book._id}
                language={book.language}
                ageCategory={book.ageCategory}
                theme={book.theme}
                characters={book.characters}
              />
            )}
            {activeTab === "story" && (
              <StoryTab
                pages={book.pages}
                onChange={updatePage}
                onUpdateImage={updatePageImage}
                onReorderPages={reorderPages}
                bookId={book._id}
                language={book.language}
                ageCategory={book.ageCategory}
                theme={book.theme}
                illustrationStyle={book.illustrationStyle}
                characters={book.characters}
              />
            )}
            {activeTab === "font" && (
              <FontTab
                value={book.font}
                title={book.title}
                sampleText={book.pages.find((page) => page.kind === "story")?.text || book.foreword}
                onChange={(value) => updateBook("font", value)}
              />
            )}
          </div>
          {error && <p role="alert" className="mt-4 text-center text-sm text-[#a34259]">{error}</p>}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={saving}
            onClick={saveBook}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E3859A] px-10 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-[#d67288] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? (editBookT?.saving || "Saving…") : (editBookT?.saveAndView || "Save and View Book")}
          </button>
        </div>
      </div>
    </div>
  );
}
