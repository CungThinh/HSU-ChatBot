import { PrivategptApiClient } from "privategpt-sdk-node";
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Cấu hình lại nếu cần
    methods: ["GET", "POST"]
  }
});

const client = new PrivategptApiClient({
  environment: "http://localhost:8001",
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async (msg) => {
    try {
      const stream = await client.contextualCompletions.promptCompletionStream({
        systemPrompt: 
        'Only answer in Vietnamese, you are an AI assistance of Hoa Sen University, only answer question about provided context',
        prompt: msg,
        includeSources: true,
        useContext: true,
        contextFilter: {docsIds: ["15476ccb-1b4e-46c0-bfda-83e50e5bfc19"]}
      });

      for await (const chunk of stream) {
        if (chunk) {
          const content = chunk?.choices[0]?.delta?.content;
          socket.emit('botResponse', content);
        }
      }
    } catch (error) {
      console.error('Error in getResponse:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});