"use client";
import React, { useCallback, useEffect, useState } from "react";
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

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const { data: session } = useSession();
  const { toast } = useToast();

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
      toast({ title: "", description: result.data.message });
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
  const getAllMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      if (response.data.messages) {
        setMessages(response.data.messages);
        toast({
          title: "Latest messages Fetched",
          // description: "Message fetched.",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed message",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  }, [toast]);

  //getAcceptingMessage
  const getAcceptingMessage = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const result = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", result.data.isAcceptingMessage);
      toast({
        title: "Fetched Accept Message status",
        description: result.data.message,
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
    toast({
      title: "Url copied Successfully",
    });
  };
  return (
    <div className="mt-6  container">
      {/* title */}
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      {/* Copy Profile link   */}
      <div className="mt-4 my-4 ">
        <p className="font-semibold text-lg">Copy Your Unique link</p>
        <div className=" flex flex-row items-center">
          <input
            className="w-full input input-bordered bg-transparent"
            type="text"
            value={profileUrl}
            disabled
          />
          <Button className="ml-2" size={"default"} onClick={copyProfileUrl}>
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
        <Button className="" size={"icon"} onClick={getAllMessages}>
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
        {/* all messages */}
        <div className="grid grid-row md:grid-cols-2 mt-4">
          {messages.length > 0 ? (
            messages.map((msg, i) => (
              <MessageCard
                key={String(msg._id)}
                message={msg}
                onMessageDelete={handleDeleteMsg}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
