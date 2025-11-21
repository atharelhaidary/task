"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";
type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
          lat: string;
          lng: string;
      };
  };
  phone: string;
  website: string;
  company: {
      name : string
  };
}

type TPosts = {
    userId: number
    id: number,
    title: string,
    body : string
}
export default function LandingPage() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [dark, setDark] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [post, setPost] = useState<TPosts| null>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  //fetch users
  const getUsersDate = async () => {
          const data = await axios.get("https://jsonplaceholder.typicode.com/users")
          setTimeout(() => { 
            setUsers(data.data);
            setLoading(false);
            }, 2000);
  }
  // fetch posts
  const fetchPosts = async (userId : number) => {
    setPostsLoading(true);
    setSelectedUserId(userId);
    const data = await axios.get(`https://jsonplaceholder.typicode.com/posts/${userId}`)
    setTimeout(() => { setPost(data.data); setPostsLoading(false); }, 500);
  };
  useEffect(()=>{
        getUsersDate()
  },[])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${dark ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-8 relative`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Landing Page</h1>
        <Button onClick={() => setDark(!dark)}>{dark ? "🌞 Light Mode" : "🌙 Dark Mode"}</Button>
      </div>

      {loading ? (
         <div className="flex justify-center items-center h-80  h-[70vh]">
                      <div className="w-40 h-40 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
      ) : (
        <Card className={`shadow-xl rounded-2xl ${dark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}  h-[80vh]`}>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <React.Fragment key={u.id}>
                    <TableRow onClick={() => fetchPosts(u.id)} className="cursor-pointer hover:bg-gray-700">
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.address.city}</TableCell>
                      <TableCell>{u.phone}</TableCell>
                      <TableCell>{u.website}</TableCell>
                      <TableCell>{u.company.name}</TableCell>
                    </TableRow>
                    {selectedUserId === u.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-700 text-white">
                          {postsLoading ? (
                            <div className="flex justify-center py-4">
                              <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <div className="p-4 space-y-4">
                                <h2 className="text-red-500 text-[15px]">Posts</h2>
                                <div className="border-b border-gray-600 pb-2  -mt-2">
                                  <h3 className="font-bold">Post Ttile : {post?.title}</h3>
                                  <p>Post Body : {post?.body}</p>
                                </div>
                               
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}