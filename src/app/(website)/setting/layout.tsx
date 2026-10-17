import Sidebar from "@/components/setting/sidebar"

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto flex flex-col gap-6 py-10 md:flex-row md:items-start">
      {/* Bam pasher fixed Sidebar */}
      <aside className="w-full shrink-0 md:w-[280px]">
        <Sidebar /> 
      </aside>

      {/* Dan pasher dynamic content */}
      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  )
}
