import { useState,useContext } from "react";
import { Navigate } from "react-router-dom";
import {UserContext} from "../UserContext";

export default function LoginPage(){

    const [username, setUsername]=useState('');
    const [password, setPassword]=useState('');
    const [redirect,setRedirect]=useState(false);  // to redirect after logged in successfuly
    const {setUserInfo} = useContext(UserContext);

    async function login(event){
        event.preventDefault();
        
            const response=await fetch('http://localhost:4000/login',{
            method:'POST',
            body:JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'},
            credentials:"include",  //with this if there are any cookies , it will be set as credentials and be inlcuded
        
    });
    if (response.ok) {
        response.json().then(userInfo => {
          setUserInfo(userInfo);
          setRedirect(true);
        });
    }else{
        alert("Wrong credentials")
    }
    
    
}
if(redirect){
    return <Navigate to={"/"}/>
}


    return(
        <>
        <div className="background">
            <div className="shape"></div>
            <div className="shape"></div>
        </div>
        <form className="login" onSubmit={login} action="">
            <h1>Login</h1>
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
            <button>Log In</button>
        </form>
        </>
    )
}