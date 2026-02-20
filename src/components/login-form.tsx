"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import z from "zod";

import { useAuthForm } from "@/hooks/use-auth-form";
import { createClient } from "@/lib/supabase/client";
import { LogInSchema } from "@/schema/form-schema";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Spinner } from "./ui/spinner";

export const LogInForm = () => {
  const { loginform: form } = useAuthForm();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  async function onSubmit(values: z.infer<typeof LogInSchema>) {
    setLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Login to your account
        </CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="log-in-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* email input */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* password input */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="off"
                      type={open ? "text" : "password"}
                    />

                    <InputGroupAddon align="inline-end">
                      {!open ? (
                        <Button
                          onClick={handleToggle}
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="hover:text-muted-foreground hover:bg-transparent"
                        >
                          <EyeOffIcon />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleToggle}
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="hover:text-muted-foreground hover:bg-transparent"
                        >
                          <EyeIcon />
                        </Button>
                      )}
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <Link
                    href={"/resetpassword"}
                    className="flex justify-end text-sm text-neutral-800 underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        {/* This error message will show if the sign up process was not successful */}
        {error && <p className="mt-3 text-red-500">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button
          size="lg"
          className="mb-2 w-full"
          type="submit"
          form="log-in-form"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
        <div>
          <span className="text-muted-foreground text-sm">
            Don&apos;t have an account?
          </span>
          <Link
            href={"/signup"}
            className="ml-1 text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
