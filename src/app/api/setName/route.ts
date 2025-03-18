import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import Users from "@/models/Usermodel";
import document from "@/models/documentmodel";

export async function POST(request:NextRequest){
    const {docName}=await request.json();
    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    
    console.log(session)
    console.log(user)
    if(!session||!user){
        return NextResponse.json({
            success:false,
            message:'User not authincated'
        },{status:401})
    }  
    try {
    const newDocument=await document.create({name:docName, data:{}})

    const dbuser=await Users.findByIdAndUpdate(user.id,{
        $push:{documents:newDocument._id}
    },{new:true})

    return NextResponse.json({
        success:true,
        message:newDocument._id.toString()
    })
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:error.message
        })
    }    
}