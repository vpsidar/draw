import axios from "axios"
import { BACKEND_URL } from "../../../config"
import { ChatRoom } from "../../../componets/ChatRoom";
async function getRoomId(slug:string) {
    console.log(slug)
    const response = await axios.get(`${BACKEND_URL}/rooms/${slug}`,{
        headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMTFlYTZkZS0xNTc3LTQyODktOTc4Mi03ZDlkNzhkMGJkMGQiLCJlbWFpbCI6InZwbXNpZGFyMUBnbWFpbC5jb20iLCJpYXQiOjE3NDM5MTk2NzgsImV4cCI6MTc0MzkzNDA3OH0.Idlh4qyj8bYnebbCq_wdGkb6tW6Vz-uOfh8fg3o2Sw8`
          }
    });
    return response.data.room.id;
}
export default async function ChatRoom1({params}: {params: {
    slug:string
}}) {
    const slug = (await params).slug;
    const roomId = await getRoomId(slug);
    return <ChatRoom id={roomId} ></ChatRoom>
}