"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, LoaderIcon, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { acceptSchema } from "@/schemas/AcceptMessageSchema";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const { data: session } = useSession();
  const { toast } = useToast();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(acceptSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const result = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Message acceptance status updated successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMsg = (msgId: String) => {
    setMessages(messages.filter((msg) => msg._id != msgId));
  };

  //get All messages
  const getAllMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoadingMessages(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message,
          variant: "destructive",
        });
      } finally {
        setLoadingMessages(false);
        setIsSwitchLoading(false);
      }
    },
    [toast]
  );

  //getAcceptingMessage
  const getAcceptingMessage = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const result = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", result.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to get message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    getAllMessages();
    getAcceptingMessage();
    console.log("Useeffect render");
  }, [getAllMessages, session, getAcceptingMessage]);

  if (!session || !session.user) {
    return;
  }

  const profileUrl = `${window.location.origin}/u/${session?.user.username}`;

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    if (ref.current !== null) {
      ref?.current?.select();
      ref.current.style.backgroundColor = "white";
      ref.current.style.color = "black";
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Reset the background and text color after a delay
      const newTimeoutId = setTimeout(() => {
        if (ref.current !== null) {
          ref.current.style.backgroundColor = "black";
          ref.current.style.color = "white";
          setTimeoutId(null);
        }
      }, 900);

      setTimeoutId(newTimeoutId);
    }
    toast({
      title: "Url copied Successfully",
    });
  };
  return (
    <div className="mt-6  container ">
      {/* title */}
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      {/* Copy Profile link   */}
      <div className="mt-4 my-4 ">
        <p className="font-semibold text-lg ">Copy Your Unique link</p>
        <div className=" flex flex-col gap-2 md:flex-row items-center ">
          <input
            ref={ref}
            className="w-full bg-transparent text-gray-400"
            type="text"
            value={profileUrl}
            disabled
          />
          <Button
            className=" w-full md:ml-2 md:w-fit"
            size={"default"}
            onClick={copyProfileUrl}
          >
            Copy
          </Button>
        </div>
      </div>
      {/* Accepting message toggle */}

      <div className="flex gap-4 mb-6  items-center  ">
        <Switch
          id="acceptMessages"
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <p>Accept Messages</p>
      </div>
      {/* Refresh message btn */}
      <div>
        <Button
          className=""
          size={"icon"}
          onClick={(e) => {
            e.preventDefault();
            getAllMessages(true);
          }}
        >
          {loadingMessages ? (
            <>
              <Loader2 className="animate-spin  h-4 w-4" />
            </>
          ) : (
            <>
              <RefreshCcw className=" h-4 w-4" />
            </>
          )}
        </Button>

        {/* {loading skeleton} */}
        {session.user && loadingMessages && (
          <div className="flex flex-col space-y-3 mt-6">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}

        {/* all messages */}
        <div className="grid grid-row md:grid-cols-2 mt-4">
          {messages.length > 0 &&
            messages.map((msg) => (
              <MessageCard
                key={String(msg._id)}
                message={msg}
                onMessageDelete={handleDeleteMsg}
              />
            ))}

          {messages.length === 0 && !loadingMessages && (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
