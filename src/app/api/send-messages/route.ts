//check user is authenticated
//get message from post body
// check if user exist
//if not return err
//else add/update message to user messages[]

import connectToDB from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
  await connectToDB();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting message" },
        { status: 400 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while sending message", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
