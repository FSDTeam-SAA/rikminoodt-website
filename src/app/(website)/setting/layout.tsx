import Sidebar from "@/components/setting/sidebar"

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-6 container h-screen   mx-auto  py-10">
      {/* Bam pasher fixed Sidebar */}
      <aside className=" flex-shrink-0">
        <Sidebar/> 
      </aside>

      {/* Dan pasher dynamic content */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  )
}