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
import axios from "axios";

type MessageProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageProps) {
  const handleDelete = async () => {
    const response = await axios.delete(`/api/delete-message/${message.id}`);
    console.log("response", response);
    if (onMessageDelete) {
      onMessageDelete(message?.id);
    }
  };

  return (
    <Card className="m-2">
      <CardHeader>
        <div className="flex flex-row  justify-between">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>
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
