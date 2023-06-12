import { useContext, useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "./UserContext";
import Bloglogo from "../src/assets/BlogIt4.png";

export default function Header(){
  const {setUserInfo,userInfo}=useContext(UserContext);
  useEffect(()=>{
    fetch("http://localhost:4000/profile",{
      credentials:"include",
 
    }).then(response=>{
      response.json().then(userInfo=>{
        setUserInfo(userInfo)
      });
    });
  },[])

  function logout(){
     fetch("http://localhost:4000/logout",{
      credentials:"include",
      method:'POST'

     });
     setUserInfo(null);
  }



  const username = userInfo?.username;



        return(
        <header>
        {/* <Link to="/" className="logo">BlogIt</Link> */}
        <Link to="/" className="logo">
          <img src={Bloglogo}/>
        </Link>
        <nav>
          {username && (
            <>
              {/* <span>Hello, {username}</span> */}
              <Link className="login-btn" to="/create">Create new post</Link>
              <a className="login-btn" onClick={logout}>Logout</a>
            </>
          )}
          {!username && (
            <>
              <button className="login-btn"><Link to="/login">Login</Link></button>
              <button className="register-btn"><Link to="/register">Register</Link></button>
            </>
          )}
        </nav>
      </header>
        )
}