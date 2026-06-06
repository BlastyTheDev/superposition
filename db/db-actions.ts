"use server"

import { db } from "@/db/db"
import { accessCodesTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

export async function isAccessCodeValid(code: string) {
  const [dbCode] = await db
    .select()
    .from(accessCodesTable)
    .where(eq(accessCodesTable.code, code))
    .limit(1)
  if (!dbCode) {
    return false
  }
  return !dbCode.user
}

export async function createAccessCode() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      success: false,
      status: 401,
    }
  }

  if (!session.user.admin) {
    return {
      success: false,
      status: 403,
    }
  }

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  let code = ""

  for (let i = 0; i < 3; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
    code += chars[Math.floor(Math.random() * chars.length)]
    code += chars[Math.floor(Math.random() * chars.length)]
    code += chars[Math.floor(Math.random() * chars.length)]
    if (i < 2) {
      code += "-"
    }
  }

  const codeToInsert: typeof accessCodesTable.$inferInsert = {
    code: code,
    createdBy: session.user.email,
  }

  await db.insert(accessCodesTable).values(codeToInsert)

  return {
    success: true,
    status: 201,
    data: code,
  }
}
