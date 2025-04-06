"use client"
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function login(email:string, password:string) {
    const response = await axios.post(`${BACKEND_URL}/auth/login`,{
      email,
      password
    });
    localStorage.setItem("token", response.data.token)
    router.push('/joinroom')
    console.log(response.data);
  }
  return (
    <div className={styles.page}>
      <div>
        <div>
          <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)}></input>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => {
            login(email, password);
          }}>Login</button>
        </div>
      </div>
   
    </div>
  );
}
