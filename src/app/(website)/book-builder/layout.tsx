import { BookBuilderProvider } from "./_components/BookBuilderProvider";

export default function BookBuilderLayout({ children }: { children: React.ReactNode }) {
  return <BookBuilderProvider>{children}</BookBuilderProvider>;
}
