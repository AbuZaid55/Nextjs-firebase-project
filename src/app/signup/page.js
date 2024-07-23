"use client"
import {auth} from '@/firebase-config'
import {createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const SignUp = () => {

  const router = useRouter()
  const submitForm = async(formData) => {
    const email = formData.get("email")
    const password = formData.get("password")
    createUserWithEmailAndPassword(auth,email,password) 
    .then((userCredentials)=>{
        userCredentials.user
        toast.success("Signup successfully")
        router.push("/login")
    }).catch((error)=>{
        let err = error?.message?.split("/")
        let er = err[1].slice(0,err[1].length-2)
        toast.error(er)
    })
    
  }

  return (
    <form action={submitForm}>
      <input type="text" name="email" placeholder="Enter your email" />
      <input type="text" name="password" placeholder="Enter your password" />
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default SignUp
