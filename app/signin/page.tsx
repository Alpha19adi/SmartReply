"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from 'axios'
export default function SignInPage() {
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [error, setError] = useState("")
 const router = useRouter()
 const [loading,setLoading]=useState(false);

 const handleSignIn = async(e: React.FormEvent) => {
   e.preventDefault()
  try {
    setLoading(true);
    setError("")
    const response = await axios.post('/api/auth/signin',{
     email,
     password
    })

    console.log(response.data);

    if(response.status===200){
      router.push("/chat")
    }
  } catch (error:any) {
    if (error.response?.status === 401) {
      setError(error.response?.data?.error || "Invalid email or password");
    } else {
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    }
  }finally{
    setLoading(false);
  }
 }

 return (
   <div className="flex items-center justify-center min-h-screen bg-gray-100">
     <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
       <div className="mb-6">
         <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
         <p className="text-gray-600">Welcome back to Smart Reply</p>
       </div>
       
       <form onSubmit={handleSignIn} className="space-y-4">
         <div className="space-y-2">
           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
             Email
           </label>
           <input
             id="email"
             type="email"
             placeholder="Shiv@example.com"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>
         
         <div className="space-y-2">
           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
             Password
           </label>
           <input
             id="password"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
         </div>
         
         {error && (
           <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
             {error}
           </div>
         )}
         
         <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
       </form>

       {/* <div className="mt-6 text-center">
         <p className="text-sm text-gray-600">
           Forgot your password?{" "}
           <Link href="/reset-password" className="text-blue-600 hover:text-blue-700 font-medium">
             Reset it here
           </Link>
         </p>
       </div> */}
       
       <div className="mt-4">
         <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-300"></div>
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="px-2 bg-white text-gray-500">New to Smart Reply?</span>
           </div>
         </div>
         
         <Link href="/signup">
           <button
             className="mt-4 w-full py-2 px-4 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
           >
             Create an account
           </button>
         </Link>
       </div>

       {/* <div className="mt-4">
         <Link href="/app">
           <button
             className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
           >
             Continue without logging in
           </button>
         </Link>
       </div> */}
     </div>
   </div>
 )
}