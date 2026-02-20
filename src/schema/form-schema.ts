import z from "zod";

export const SignUpSchema = z
  .object({
    email: z
      .email("Enter your valid email!")
      .min(1, "Please enter your email!"),
    username: z
      .string()
      .min(1, "Please enter your username!")
      .max(20, "Username must be at most 25 characters!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters!")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter!")
      .regex(/[0-9]/, "Password must contain at least one number!")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character!"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your password don't match!",
    path: ["confirmPassword"],
  });

export const LogInSchema = z.object({
  email: z.email("Enter your valid email!").min(1, "Please enter your email!"),
  password: z.string().min(1, "Please enter your password!"),
});
