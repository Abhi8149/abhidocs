import {Schema,models,model} from 'mongoose'
import document from './documentmodel'
import doc from './documentmodel'
interface IUser{
    name:String,
    email:String,
    password:String,
    isVerified:Boolean,
    verificationCode:String,
    verificationCodeExpires:Date,
    documents:typeof doc
}
const UserSchema=new Schema<IUser>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
    },
    verificationCode:{
        type:String,
        required:true
    },
    verificationCodeExpires:{
        type:Date,
        default:Date.now
    },
    documents:[{
        type:Schema.Types.ObjectId,
        ref:'document'
    }]
})

const Users=models?.User || model<IUser>('User',UserSchema)

export default Users