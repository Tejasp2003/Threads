import * as z from "zod";

export const threadValidation = z.object({
  thread: z
    .string()
    .min(3, {
      message: "Thread must be at least 3 characters long",
    })
    .max(1000, {
      message: "Thread must be less than 1000 characters long",
    })
    .nonempty(),
  accountId: z.string(),
});
export const commentValidation = z.object({
  thread: z
    .string()
    .min(3, {
      message: "Thread must be at least 3 characters long",
    })
    .max(1000, {
      message: "Thread must be less than 1000 characters long",
    })
    .nonempty(),
});
