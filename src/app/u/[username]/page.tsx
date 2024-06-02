"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { messageSchema } from "@/schemas/MessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SendMessagePage() {
  const params = useParams();
  const username = params.username;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const { watch } = form;
  const contentMesg = watch("content");
  console.log("form.getValues(content)", form.getValues("content"));
  console.log("contentMesg", contentMesg.length);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await axios.post<ApiResponse>("/api/send-messages", {
        username,
        ...data,
      });
      console.log("result.", result.data.message);
      toast({
        title: "Message sent successfully",
      });
      form.setValue("content", "");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errMsg =
        axiosError.response?.data.message ?? "Something went wrong";
      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 container flex flex-col mx-auto space-y-6 max-w-3xl h-screen">
      <div className="text-center">
        <p className="text-4xl font-bold mb-6">Public Profile Link</p>
      </div>

      <div className="flex ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            {" "}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to {username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Write your anonymous message to ${username}.`}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <div className="flex justify-center">
              <Button
                variant={"default"}
                className="text-center  font-semibold "
                type="submit"
                disabled={contentMesg.trim().length == 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Please wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {/* line */}
      <Separator />
      <div className="flex justify-center items-center flex-col gap-4 text-gray-400">
        What to receive anonymous message?
        <Link href={"/signup"}>
          {" "}
          <Button className="font-bold text-md">Create your own Account</Button>
        </Link>
      </div>
    </div>
  );
}
