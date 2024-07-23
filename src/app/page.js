"use client"
import style from '@/CSS/homepage.module.css'
import { auth } from '@/firebase-config';
import { onAuthStateChanged ,signOut} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function Home() {
  const router = useRouter()
  const [user,setUser]=useState({email:""})
  const LogOut = () => {
    signOut(auth)
    .then(()=>{
      setUser({email:""})
      toast.success("Log out successfully")
    }).catch((error)=>{
      console.log(error)
    })
  }
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
      if(user){
        setUser({email:user.email})
      }else{
        setUser({email:""})
      }
    })
    return () => unsubscribe();
  },[])
  return (
    <div className={style.home}>
      <h3>Home Page</h3>
      <p>{user.email? `${user.email} is logged in`:''}</p>
      <div>{user.email?<button onClick={LogOut}>Log Out</button>:<button onClick={()=>{router.push("/login")}}>LogIn</button>}</div>
    </div>
  );
}
