import connectToDB from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
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

  const messageId = params.messageid;
  console.log("Delete mesg id", messageId);

  //check if message exist
  //   if not return
  //else delete
  const updatedMessage = await UserModel.updateOne(
    { _id: _user._id },
    {
      $pull: {
        messages: {
          _id: messageId,
        },
      },
    }
  );

  console.log("updateMessage", updatedMessage);

  if (updatedMessage.modifiedCount == 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Message does not exist or already deleted",
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      success: true,
      message: "Message does not exist or already deleted",
    },
    { status: 200 }
  );
}
