import "@/app/globals.css"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Navbar from "@/components/blocks/navbar";

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
      <Navbar user={session?.user} />
      {children}
    </>
  )
}
