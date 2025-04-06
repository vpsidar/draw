import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket ] = useState<WebSocket>();
    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMTFlYTZkZS0xNTc3LTQyODktOTc4Mi03ZDlkNzhkMGJkMGQiLCJlbWFpbCI6InZwbXNpZGFyMUBnbWFpbC5jb20iLCJpYXQiOjE3NDM5MTk2NzgsImV4cCI6MTc0MzkzNDA3OH0.Idlh4qyj8bYnebbCq_wdGkb6tW6Vz-uOfh8fg3o2Sw8`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws)
        }
    },[])
    return {
        socket,
        loading
    }
}