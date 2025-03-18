import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { findDocOrCreate, updateDoc } from "../helper/controllers";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', socket => {
    socket.on('get-document', async ({ documentId, documentName }) => {
      socket.join(documentId);
      const Document = await findDocOrCreate({ documentId, documentName });
      console.log(Document)
      if (Document) {
        socket.emit('load-document', Document.data);
      }

      socket.on('send-changes', delta => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
      });

      socket.on('save-document', async (data) => {
        await updateDoc({ documentId, data });
      });
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});