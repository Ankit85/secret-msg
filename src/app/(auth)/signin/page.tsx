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

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleSlash, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/SignInSchema";
import { SignInResponse, signIn } from "next-auth/react";
import Link from "next/link";

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
      console.log("sigin respobnse rtto", response);
      if (response?.url) {
        router.push(`/dashboard`);
      } else {
        toast({
          title: "Sign innn Failed",
          description: response?.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Sign in error", error);
      const axiosError = error as SignInResponse;
      const errorMsg =
        axiosError.error ??
        "There was a problem while sign in. Please try again.";
      toast({
        title: "Sign  failed",
        description: errorMsg,
        variant: "destructive",
      });
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
          <h1 className="text-xl font-semibold ">
            Create a SecretSender account{" "}
          </h1>
          <p className="text-md text-gray-400 my-1">
            {" "}
            Don&apos;t have an account?{" "}
            <Link className="text-blue-500" href="/signup">
              Sign up
            </Link>
          </p>
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
            </form>
          </Form>

          <p className="text-xs mt-4">
            By signing up, you agree to our terms, acceptable use, and privacy
            policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
