"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";

import { Textarea } from "../ui/textarea";
import { z } from "zod";

import { usePathname, useRouter } from "next/navigation";

// import { updateUser } from "@/lib/actions/user.action";
import { threadValidation } from "@/lib/validations/threads";
import { createThread } from "@/lib/actions/thread.action";
import { useOrganization } from "@clerk/nextjs";
interface PostThreadProps {
  user: User;
  btnTitle: string;
}
interface User {
  id: string;
  objectId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

const PostThread = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const form = useForm({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof threadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });
    router.push("/");
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10 mt-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content of the thread
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                  {...field}
                  style={{
                    whiteSpace: "pre-line",
                    overflowWrap: "break-word", // Add this line to allow text to wrap
                    wordWrap: "break-word",    // Add this line for additional compatibility
                  }}
                />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Create Thread
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
