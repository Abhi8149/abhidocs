import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "../../../../lib/dbconnect";
import User from "@/models/Usermodel";
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "../../../../helper/sendVerificationEmail";

export async function POST(request:NextRequest){
    await dbconnect();
    try {
        const {username,email,password}=await request.json();
        if(username==='' || password==='' || email===''){
            console.log('Username and password is empty')
            return NextResponse.json({
                success:false,
                message:'Username or password cannot be empty'
            },{status:403})
        }
    
        const checkuserExist=await User.findOne({email})
        if(checkuserExist){
            return NextResponse.json({
                success:false,
                message:'email already registed please use another email'
            }, {status:404})
        }
        
        const hashedpassword=await bcrypt.hash(password,10)
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let expiryDate=new Date();
        expiryDate.setHours(expiryDate.getHours()+1)
    
        const user = await User.create({
            name:username,
            email:email,
            password:hashedpassword,
            isVerified:false,
            verificationCode:verifyCode,
            verificationCodeExpires:expiryDate,
            documents:[]
        });
    
        await user.save();
    
        const emailresponse=await sendVerificationEmail(email,username,verifyCode)
    
        if(!emailresponse){
            return NextResponse.json({
                success:false,
                message:'Error in sending the verification email'
            },{status:401})
        }
    
        console.log('Sended the verification succefully')
    
        return NextResponse.json({
            success:true,
            message:'User registed succefully'
        })  
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
            success:false,
            message:error.message
        },{status:500})
    }

}