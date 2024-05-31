//get current user from session
//accept isAcceptingMessages from post body
//check if user exist
//if exist update the toggle
//else return err

import connectToDB from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await connectToDB();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not an Authenticated User",
        },
        { status: 400 }
      );
    }

    const { acceptMessages } = await request.json();
    const userId = user._id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating acceptance message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update Acceptance message",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not an Authenticated User",
      },
      { status: 400 }
    );
  }
  try {
    const userId = user._id;
    const foundUser = await UserModel.findById({ _id: userId });

    if (!foundUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating acceptance message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update Acceptance message",
      },
      { status: 400 }
    );
  }
}
