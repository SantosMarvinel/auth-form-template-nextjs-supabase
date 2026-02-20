"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import z from "zod";

import { useAuthForm } from "@/hooks/use-auth-form";
import { createClient } from "@/lib/supabase/client";
import { SignUpSchema } from "@/schema/form-schema";

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

export const SignUpForm = () => {
  // customize this depends of your needs (eg. background color, size, etc.)
  // you can add props if you want too

  const { signupform: form } = useAuthForm();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    console.log("This is the values of the form : ", values);
    const supabase = createClient();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            display_name: values.username,
          },
        },
      });

      if (error) throw error;

      router.push("/"); // TODO : customize this url depends on where do you want to redirect after a successful sign up
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to [app-name]</CardTitle>
        <CardDescription>
          Create your account below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email input */}
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
                    placeholder="m@example.com"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* username input */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="form-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your username"
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
                      type={open ? "text" : "password"}
                      autoComplete="off"
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
                </Field>
              )}
            />

            {/*confirm password input */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-confirm-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm your password"
                    type="password"
                    autoComplete="off"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        {/* This error message will show if the sign up process was not successful */}
        {error && <p className="mt-3 text-red-500">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          form="sign-up-form"
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner /> Signing up...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        <div>
          <span className="text-muted-foreground text-sm">
            Already have an account?
          </span>
          <Link
            href={"/login"}
            className="ml-1 text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
