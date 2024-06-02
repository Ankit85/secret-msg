"use client";

import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export default function InputOTPControlled() {
  const [value, setValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const router = useRouter();

  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const verifyCode = async () => {
    setButtonDisabled(true);
    try {
      const result = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: value,
      });
      console.log("result", result);
      if (result.data.success) {
        toast({
          title: "Success",
          description: "Code verified successfully",
        });
        router.push("/signin");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log("axiosError", axiosError.response?.data.message);
      toast({
        title: "Verification Code Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setButtonDisabled(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4 w-fit  mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Verify Your Account</h1>
        <p className="text-sm text-gray-300">
          Enter Verification code sent to your email
        </p>
      </div>
      <Input
        maxLength={6}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {/* <InputOTP>
        <InputOTPGroup className="mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP> */}

      <Button
        onClick={verifyCode}
        // variant={"outline"}
        className={`text-center font-semibold  `}
        type="submit"
        disabled={buttonDisabled}
      >
        {buttonDisabled ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Verifying Code
          </>
        ) : (
          "Verify"
        )}
      </Button>
    </div>
  );
}
// 137512
