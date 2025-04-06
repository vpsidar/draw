"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinRoom() {
      const [roomId, setRoomId] = useState("");
      const router = useRouter()
  return  <div>
      <div>
        <div>Join Room</div>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" placeholder="Room Id"></input>
         <button onClick={() => router.push(`/room/${roomId}`)}>Join</button>
      </div>
    </div>
}