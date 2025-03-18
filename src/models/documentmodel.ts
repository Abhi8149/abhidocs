import{Schema,model,models} from 'mongoose'

export interface doc{
    name:String;
    data:Object;
    time:Date
}

const documentSchema=new Schema<doc>({
    name: { type: String, required: true },
    data: { type: Object, default: {} },
},{timestamps:true})

const document=models?.document || model<doc>('document', documentSchema)

export default document