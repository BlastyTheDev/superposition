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
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.email("Invalid email."),
  password: z.string()
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(formData: z.infer<typeof loginSchema>) {
    await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    }, {
      onRequest: () => {
        setPending(true)
      },
      onSuccess: () => {
        setPending(false)
        router.push("/")
      },
      onError: () => {
        setPending(false)
        form.setError("password", {
          type: "server",
          message: "Incorrect email or password."
        })
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Log in to Superposition</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
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
                      <Link
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
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
            <Button type="submit" form="form-login" disabled={pending}>
              {pending && <Spinner /> || "Log in"}
            </Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
