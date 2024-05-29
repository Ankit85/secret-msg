import connectToDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { usernameValidation } from "@/schemas/SignupSchema";
import UserModel from "@/model/User";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await connectToDB();
  try {
    const searchParams = request.nextUrl.searchParams.get("username");
    const result = usernameQuerySchema.safeParse({ username: searchParams });

    if (!result.success) {
      const usernameError = result.error?.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          usernameError?.length > 0
            ? usernameError.join(",")
            : "Invalid Query Parameters",
      });
    }
    const username = result.data.username;
    const isExistingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isExistingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while checking username", error);
    return Response.json(
      { success: false, message: "Error while checking username" },
      { status: 400 }
    );
  }
}
