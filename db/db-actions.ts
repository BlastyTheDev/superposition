"use server"

import { db } from "@/db/db"
import { accessCodesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

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
