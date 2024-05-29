import UserModel from "@/model/User";
import connectToDB from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import sendmail from "@/lib/sendmail";
import { error } from "console";

export async function POST(request: Request) {
  await connectToDB();
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    console.log({ username, email, password });

    //check if username is available
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsername) {
      return Response.json({
        success: false,
        message: "Username already taken",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      //if email exist in db and is verified
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exist with this email.",
        });
      } else {
        //if email exist in db and is not verified
        existingUserByEmail.password = await bcrypt.hash(password, 10);
        existingUserByEmail.verifyOTP = verifyCode;
        existingUserByEmail.verifyOTPExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      //if email does not exist onboard the user
      //hashed the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      //save user in db
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
        verifyOTP: verifyCode,
        verifyOTPExpiry: expiryDate,
      });
      await newUser.save();

      //send email verification code
      const emailResponse = await sendmail(username, email, verifyCode);
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "User registered successfully. Please verify your account.",
        },
        { status: 201 }
      );
    }
  } catch (e) {
    console.log("Error while sign up", e);
    return Response.json({
      status: false,
      message: "Something went wrong",
      error: e,
    });
  }
}
