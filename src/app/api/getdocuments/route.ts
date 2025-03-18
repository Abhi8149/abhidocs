import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "../../../../lib/dbconnect";
import { getServerSession,User} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Users from "@/models/Usermodel";
import path from "node:path";

export async function GET(request:NextRequest){
    await dbconnect();

    const session=await getServerSession(authOptions);
    const user:User=session?.user as User;
    console.log(user);
    try {
        if(!session || !user){
            console.log('Session or user does not exist')
            return NextResponse.json({
                sucess:false,
                message:'Not authinticated'
            },{status:401})
        }
        const getuser=await Users.findOne({email:session.user?.email}).populate({
           path:'documents',
           select:'name _id',
           options:{strictPopulate:false}
        }).sort({created:-1});
        if(!getuser){
            return NextResponse.json({
                success:false,
                message:'User does not exist'
            },{status:403})
        }
    
        const document=getuser.documents;
        //  console.log(getuser)
        // console.log(document)
        return NextResponse.json({
            success:true,
            message:document
        },{status:201}) 
    } catch (error:any) {
        console.log(error.message)
        return NextResponse.json({
            success:false,
            message:error.message
        },{status:500})
    }
}