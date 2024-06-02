"use client";
import React from "react";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Message } from "@/model/User";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./ui/use-toast";

type MessageProps = {
  message: Message;
  onMessageDelete: (messageid: String) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageProps) {
  const handleDelete = async () => {
    try {
      const result = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      onMessageDelete(message._id as String);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Something went wrong",
      });
    }
  };

  return (
    <Card className="mr-2 mb-2">
      <CardHeader>
        <div className="flex flex-row  justify-between">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="ml-2" variant={"destructive"}>
                <X />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription>
          {dayjs(message.createdAt).format("MMM-DD-YYYY hh:mm A")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
