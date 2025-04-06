import { WebSocket, WebSocketServer } from 'ws';
import {verifyToken} from '@repo/backend-common/utils'
import { prisma } from '@repo/db/client';

const wss = new WebSocketServer({ port: 8080 });
interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}
const users: User[] = []
function checkUser(token: string) {
  const decoded = verifyToken(token);
  try {
    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url
  if(!url){
    return
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') ?? "";
  const userId= checkUser(token);

  if(userId==null){
      ws.close();
      return;
  }
  users.push({
    ws,
    rooms:[],
    userId
  })
  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user?.rooms.push(parsedData.roomId);
    }
    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter(x => x !== parsedData.roomId)   // current room ko leave krne ke liye
    }
    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      // await pris
      await prisma.chat.create({
        data: {
          message,
          roomId,
          userId
        }
      });
      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))

        }
      })

    }
  });

  ws.send('something');
});