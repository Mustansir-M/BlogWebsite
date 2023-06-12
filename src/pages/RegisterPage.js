import { useState } from "react"
import Post from "../post";

export default function RegisterPage(){
    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');


    async function register(event){
        event.preventDefault();
        
            const response=await fetch('http://localhost:4000/register',{
            method:'POST',
            body:JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
        
    });
    if(response.status===200){
        alert("Registration Successful!");
    }
    else{
        alert("Registration Failed: Username already in use");
    }
}
    return(
        <>
        <div className="background">
            <div className="shape"></div>
            <div className="shape"></div>
        </div>
        <form className="register" onSubmit={register} action="">
            <h1>Register</h1>
            <label for="username">Username</label>
            <input type="text" 
                   placeholder="username"
                   value={username}
                   onChange={event=>setUsername(event.target.value)}/>
            <label for="password">Password</label>
            <input type="password" 
                   placeholder="password"
                   value={password}
                   onChange={event=>setPassword(event.target.value)}/>
            <button>Register</button>
        </form>
        </>
    )
}