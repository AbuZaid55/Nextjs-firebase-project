"use client"
import { useEffect, useState } from "react"
import { db } from "@/firebase-config"
import { addDoc, collection, deleteDoc, doc, getDocs , query, updateDoc, where} from "firebase/firestore"
import { toast } from "react-toastify"

const Dashboard = () => {
    const userCollectionRef = collection(db,"curd")
    const [users,setUser]=useState([])
    const getUser = async()=>{
        try {
            const res = await getDocs(userCollectionRef)
            const data = res.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id
            }))
            setUser(data)
        } catch (error) {
            console.log(error)
        }
    }
    const addUser = async(formdata)=>{
        const name = formdata.get("name")
        const email = formdata.get("email")
        const isAdmin = formdata.get("isAdmin")
        const address = formdata.get("address")
        try {
            const q = query(userCollectionRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot)
            if (!querySnapshot.empty) {
                toast.error("User with this email already exists");
            }else{
                await addDoc(userCollectionRef,{name,email,isAdmin,address})
                toast.success("User added successfully")
                getUser()
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const updateUser = async(id,name)=>{
        const userDoc = doc(db,"curd",id)
        const newName = {name:name+" updated"}
        try {
            await updateDoc(userDoc,newName)
            toast.success("User updated successfully")
            getUser()
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const deleteUser = async(id)=>{
        const userDoc = doc(db,"curd",id)
        try {
            await deleteDoc(userDoc)
            toast.success("User deleted successfully")
            getUser()
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        getUser()
    },[])   
  return (
    <div>
        <form action={addUser}>
            <input type="text" name="name" placeholder="Enter your name"/>
            <input type="text" name="email" placeholder="Enter your email"/>
            <select name="isAdmin">
                <option value="true">isAdmin</option>
                <option value="false">Not Admin</option>
            </select>
            <textarea name="address" placeholder="Enter your address"></textarea>
            <button type="submit">Add User</button>
        </form>
        {
            users.map((user)=>{
                return <div key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>{user.isAdmin}</p>
                    <p>{user.address}</p>
                    <button onClick={()=>{updateUser(user.id,user.name)}}>Update</button>
                    <button onClick={()=>{deleteUser(user.id)}}>Delete</button>
                </div>
            })
        }
    </div>
  )
}

export default Dashboard
