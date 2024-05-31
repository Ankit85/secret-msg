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

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const { data: session } = useSession();
  const { toast } = useToast();

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

  useEffect(() => {
    if (!session || !session.user) return;
    getAllMessages();
    console.log("Useeffect render");
  }, [getAllMessages, session]);

  if (!session || !session.user) {
    return;
  }

  return (
    <div className="  container ">
      {/* <MessageCard message={message} onMessageDelete={() => {}} /> */}
      {/* <MessageCard /> */}
      {/* <MessageCard /> */}
      {/* Middle Profile section */}
      {/* Suggest Message */}
      {/* Accepting message toggle */}
<div>Hellow my head ki </div>
      {/* Refresh message btn */}
      <Button className="ml-2" size={"icon"} onClick={getAllMessages}>
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
      <div className="grid grid-row md:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <MessageCard
              key={msg._id}
              message={msg}
              onMessageDelete={(id) => {
                console.log("Messga id to delet");
              }}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
