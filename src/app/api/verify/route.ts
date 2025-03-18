import Users from "@/models/Usermodel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {email,verificationCode}=await request.json();
    if(!email || !verificationCode){
        return NextResponse.json({
            success:false,
            message:'Please enter the verification code'
        },{status:401})
    }

    try {
        const user=await Users.findOne({email});
        if(!user){
            return NextResponse.json({
                success:false,
                message:'User does not exist'
            },{status:403})
        }

        const code=user.verificationCode
        if(code!==verificationCode){
            return NextResponse.json({
                success:false,
                message:'code is incorrect please enter the correct verificationcode'
            },{status:404})
        }

        user.isVerified=true;
        await user.save();

        return NextResponse.json({
            success:true,
            message:'User verified succefully'
        },{status:201})


    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:'Internal server error'
        },{status:500})
    }
}