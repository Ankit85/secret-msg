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

function Signup() {
  const [username, setUsername] = useState("");
  const [usernameMesssage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 300);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      console.log("response", response);
      toast({
        title: "Sign up Successfull",
        description: response.data.message,
        variant: "default",
      });
      router.push(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg =
        axiosError.response?.data.message ??
        "There was a problem while sign up. Please try again.";
      toast({
        title: "Sign up failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const result = await axios.get<ApiResponse>(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(result.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Failed to fetch username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && (
                      <div>
                        <Loader2 className="animate-spin" />
                      </div>
                    )}
                    {!isCheckingUsername && usernameMesssage && (
                      <p
                        className={`text-sm font-semibold
                      ${
                        usernameMesssage == "Username is available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                      >
                        {usernameMesssage}
                      </p>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
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
                  "Create Account"
                )}
              </Button>
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
