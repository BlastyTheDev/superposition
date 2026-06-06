"use server"

import { auth } from "@/lib/auth"
import { isAccessCodeValid } from "@/db/db-actions"
import { db } from "@/db/db"
import { accessCodesTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export async function signup(data: {
  code: string
  email: string
  password: string
}) {
  const accessCodeValid = await isAccessCodeValid(data.code)

  if (!accessCodeValid) {
    return {
      success: false,
      error: "Invalid access code.",
    }
  }

  await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.email,
    },
  })

  await db.transaction(async (tx) => {
    await tx
      .update(accessCodesTable)
      .set({ user: data.email })
      .where(eq(accessCodesTable.code, data.code))
  })

  redirect("/dashboard")
}
