import document from "../src/models/documentmodel";
const defaultData=''
export const findDocOrCreate=async({documentId,documentName}:{documentId:string, documentName:string})=>{
   
    if(!documentId){
        return;
    }
    const Document=await document.findById(documentId);
    if(Document){
        return Document;
    }

    const newDocument=await document.create({_id:documentId, name:documentName, data:defaultData})

    await newDocument.save();

    return newDocument;
}

export const updateDoc=async({documentId,data}:{documentId:string, data:Object})=>{
   if(!documentId){
    return;
   }

   const Document=await document.findByIdAndUpdate(documentId, {data});

   return;
}