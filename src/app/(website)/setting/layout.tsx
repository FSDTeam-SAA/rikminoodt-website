import Sidebar from "@/components/setting/sidebar"

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto flex min-h-screen gap-6 py-10">
      {/* Bam pasher fixed Sidebar */}
      <aside className=" flex-shrink-0">
        <Sidebar/> 
      </aside>

      {/* Dan pasher dynamic content */}
      <main className="min-w-0 flex-grow">
        {children}
      </main>
    </div>
  )
}
