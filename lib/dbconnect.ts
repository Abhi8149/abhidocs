import mongoose from "mongoose";

type connectionObject={
    isConnected?:number,
}

const connection:connectionObject={};

export async function dbconnect():Promise<void>{
    if(connection.isConnected){
        console.log('Database is already connected');
        return;
    }

    try{
        const conn=await mongoose.connect(process.env.MONGO_URI! || '');
        connection.isConnected=conn.connection.readyState;
        console.log('Database is connected')
    }catch(error){
        console.log('Error in connecting database');
    }
}