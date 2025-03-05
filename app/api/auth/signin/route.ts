import { connectDb } from "@/app/lib/db";
import user from "@/app/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface User {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SC || "";

export async function POST(req: Request) {
  await connectDb();

  try {
    const { email, password }: User = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const signInUser = await user.findOne({ email });
    if (!signInUser) {
      return NextResponse.json({ error: "User does not exist" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, signInUser.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    if(signInUser.isVerified===false){
        return NextResponse.json({ error: "Please verify your email" }, { status: 401 });
    }

    const token = jwt.sign({ id: signInUser._id }, JWT_SECRET, { expiresIn: "1d" });
    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    (await cookies()).set("username", signInUser.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
