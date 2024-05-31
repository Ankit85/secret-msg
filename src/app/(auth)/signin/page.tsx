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
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/schemas/SignupSchema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleSlash, Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/SignInSchema";
import { signIn } from "next-auth/react";

function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      console.log("Respine", response);

      if (response?.url) {
        router.push(`/dashboard`);
      } else {
        toast({
          title: "Sign in Failed",
          description: response?.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Sign in error", error);
      /*  const axiosError = error as Nex;
      const errorMsg =
        axiosError.response?.data.message ??
        "There was a problem while sign in. Please try again.";
      toast({
        title: "Sign in failed",
        description: errorMsg,
        variant: "destructive",
      }); */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center
     min-h-screen "
    >
      <div className=" space-y-6  ">
        <div className="text-center lg:text-start lg:px-6">
          <CircleSlash
            className="mx-auto lg:mx-0 my-4 "
            size={40}
            color="#ffffff"
            strokeWidth={2.5}
            absoluteStrokeWidth
          />
          <h1 className="text-xl p-1 font-semibold ">Create a Anon account </h1>
          <p className="text-sm ">Send anonymous message to your friends</p>
        </div>
        <div className="  px-6 w-screen  max-w-lg">
          {/* form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                // variant={"outline"}
                className={`text-center w-full font-semibold  `}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Please wait
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              {/* <p className="text-xs mt-4">
                By signing up, you agree to our terms, acceptable use, and
                privacy policy.
              </p> */}
              <p className="text-xs mt-4">
                By signing up, you agree to our terms, acceptable use, and
                privacy policy.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
