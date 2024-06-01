//check if user is authenticated
//if not return error
//get all message for user from user id
//if no message return error
//else return msg with new msg on top

import connectToDB from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await connectToDB();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    console.log("user", user);
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while getting messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
