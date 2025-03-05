import { connectDb } from "@/app/lib/db";
import { log } from "console";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import User from "@/app/models/user";
export async function GET(req:NextRequest){
    try {
        await connectDb();
        const {searchParams}=new URL(req.url);
        const token=searchParams.get('token');
        const UserId=searchParams.get('id');


        if(!token || !UserId){
            return NextResponse.json({
                message:"Missing Token or UserId"
            },{status:400});
        }

        const hashedToken=crypto.createHash('sha256').update(token).digest('hex');

        const user= await User.findOne({
            _id:UserId,
            verifyToken:hashedToken,
            verifyTokenExpire:{$gte:Date.now()} 
        })

        if(!user){
            return NextResponse.json({
                message:"Invalid or Expired Token"
            },{status:400});
        }

        user.isVerified=true;
        user.verifyToken=undefined;
        user.verifyTokenExpire=undefined;
        await user.save();

        return NextResponse.json({
            message:"Email Verified Successfully"
        },{status:200});

    } catch (error) {
        
    }
}