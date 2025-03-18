import { Server } from "socket.io";
import { findDocOrCreate, updateDoc } from "./controllers";

const io = new Server();

io.on('connection', socket => {
    socket.on('get-document', async ({ documentId, documentName }) => {
        socket.join(documentId);
        const Document=await findDocOrCreate({documentId,documentName});

        if(document){
            socket.emit('load-document',Document.data)
        }

        socket.on('send-changes',delta=>{
            socket.broadcast.to(documentId).emit('recive-changes',delta);
        });

        socket.on('save-document', async(data)=>{
            await updateDoc({documentId,data});
        })
    });
});