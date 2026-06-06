import "@/app/globals.css"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/blocks/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <SidebarProvider>
        <Navbar user={session?.user} />
      </SidebarProvider>
      {children}
    </>
  )
}
