import connectToDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await connectToDB();
  try {
    const { username, code } = await request.json();

    const isExistingUser = await UserModel.findOne({ username });
    if (!isExistingUser) {
      return Response.json({ success: false, message: "User not found" });
    }

    const isValidCode = isExistingUser.verifyOTP === code;
    const isCodeNotExpiry =
      new Date(isExistingUser.verifyOTPExpiry) > new Date();

    if (isValidCode && isCodeNotExpiry && !isExistingUser.isVerified) {
      isExistingUser.isVerified = true;
      await isExistingUser.save();

      return Response.json(
        {
          success: true,
          message: "Verified Code successfully",
        },
        { status: 200 }
      );
    } else if (!isValidCode) {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification Code",
        },
        { status: 400 }
      );
    } else if (isValidCode && isCodeNotExpiry && isExistingUser.isVerified) {
      return Response.json(
        {
          success: false,
          message: "You are already verified.",
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        success: false,
        message:
          "Verification code is Expired. Please sign in again to get new code.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error while verifing code", error);
    return Response.json(
      { success: false, message: "Failed to verify code" },
      { status: 500 }
    );
  }
}
