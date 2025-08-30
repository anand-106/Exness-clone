import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export function Signin(){

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const navigate  = useNavigate();

    const handleSignIn  =()=>{
        axios.post("http://localhost:3000/api/v1/user/signin",{
            username,
            password
        }).then(res=>{
            localStorage.setItem("token",res.data.token)
            navigate('/')
        }).catch(err=>{
            console.error(err)
        })
    }

    return <div>
        <h1>SignIn</h1>
        <input placeholder="username" value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
        <input placeholder="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button onClick={handleSignIn} >SignIn</button>
    </div>
}