"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({messages, id}:{
    messages: {message:string}[],
    id:string
}){
    const {socket, loading} = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentMsg, setCurrentMsg] = useState("");
    useEffect(() => {
        if(socket && !loading){
            socket.send(JSON.stringify({
                type: 'join_room',
                roomId: id
            })) // Put this in separate hook
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === 'chat'){
                    setChats(c => [...c, {message:parsedData.message}]);
                }
            }
        }
    },[socket, loading]);

    return <div>
        {chats.map(c => <div key={c.message}>
            {c.message}
        </div>)}
        <input type="text" value={currentMsg} onChange={(e) => {
            setCurrentMsg(e.target.value);
        }} ></input>
        <button onClick={() => {
            socket?.send(JSON.stringify(
                {
                    type: "chat",
                    roomId: id,
                    message: currentMsg
                }
            ))
            setCurrentMsg("");
        }}>Send</button>
    </div>
}
