import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbconnect } from "../../../../../lib/dbconnect";
import bcrypt from 'bcrypt'
import Users from "@/models/Usermodel";
export const authOptions:NextAuthOptions={
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email"},
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any):Promise<any> {
            // Add logic here to look up the user from the credentials supplied
            await dbconnect()

            try {
                if(!credentials.email || !credentials.password){
                    return;
                }
                const user=await Users.findOne({
                    email:credentials.email
                })
                if(!user){
                    return new Error('No user found')
                }

                const checkpassword=bcrypt.compareSync(credentials.password, user.password)
                if(!checkpassword){
                    return new Error('Password is incorrect')
                }

                return user;
            } catch (error:any) {
                return new Error('Error in signin',error)
            }
            
          }
        })
      ],
      callbacks: {  
        async jwt({token,user}:any){
          if(user){
            token._id=user._id.toString();
            token.isVerified=user.isVerified;
            token.email=user.email
          }

          return token;
        },

        async session({session,token}:any){
          if(token){
            session.user.id=token._id;
            session.user.isVerified=token.isVerified;
            session.user.email=token.email;
          }

          return session
        }
    },
    session:{
      strategy:'jwt'
    },
    secret:process.env.AUTH_SECRET,
    pages:{
      signIn:'/login'
    }
}

export default NextAuth(authOptions)
