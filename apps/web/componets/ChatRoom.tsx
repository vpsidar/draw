import axios from "axios"
import { BACKEND_URL } from "../config"
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(roomId:string){
    const response = await axios.get(`${BACKEND_URL}/rooms/${roomId}/chats`, {
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMTFlYTZkZS0xNTc3LTQyODktOTc4Mi03ZDlkNzhkMGJkMGQiLCJlbWFpbCI6InZwbXNpZGFyMUBnbWFpbC5jb20iLCJpYXQiOjE3NDM5MTk2NzgsImV4cCI6MTc0MzkzNDA3OH0.Idlh4qyj8bYnebbCq_wdGkb6tW6Vz-uOfh8fg3o2Sw8"
        }
    });
    console.log(response)
    return response.data.messages;
}
export async function ChatRoom({id}: {
    id:string
}) {
    const messages = await getChats(id);
    return <div>
        <ChatRoomClient messages={messages} id={id}></ChatRoomClient>
    </div>
}