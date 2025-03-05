import { connectDb } from '@/app/lib/db';
import { NextResponse } from 'next/server';
import User, { generateVerificationToken } from '@/app/models/user';  // Import the function
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/app/util/sendEmail';

interface UserInput {
    username: string;
    email: string;
    password: string;
}

export async function POST(req: Request) {
    await connectDb(); 

    try {
        const { username, email, password }: UserInput = await req.json(); 

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({
                error:"User already exists"
            },{status:400});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate token before creating user
        const { verificationToken, hashedToken, tokenExpiry } = generateVerificationToken();

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            verifyToken: hashedToken,
            verifyTokenExpire: tokenExpiry
        });

        const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${verificationToken}&id=${newUser._id}`;

        const emailSent = await sendEmail(
            email,
            verificationLink,
            username
        );

        if (!emailSent) {
            return NextResponse.json({ 
                error: 'Failed to send verification email' 
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "User Created Successfully. Please check your email to verify your account.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isVerified: newUser.isVerified
            }
        },{status:201});

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}