"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Spinner } from "@/components/ui/spinner"
import { useTransition } from "react"
import { signup } from "@/db/auth-actions"

const signupSchema = z.object({
  code: z.string().length(14, "Code must be exactly 14 characters."),
  email: z.email("Invalid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
})

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      code: "",
      email: "",
      password: ""
    }
  })

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    startTransition(async () => {
      await signup(data)
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up for Superposition</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-signup" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="code">Access Code</FieldLabel>
                    <Input
                      {...field}
                      id="code"
                      aria-invalid={fieldState.invalid}
                      placeholder="A1B2-C3D4-E5F6"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )} />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" form="form-signup" disabled={isPending}>
              {isPending && <Spinner /> || "Sign up"}
            </Button>
            <FieldDescription className="text-center">
              Already have an account? <Link href="/login">Log in</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
