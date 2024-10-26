"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NextResponse } from 'next/server';




export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            // setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success", response.data);
            router.push("/login");
            
        } catch (error:any) {
            console.log("Signup failed", error.message);
            alert(error.NextResponse.message)
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <section className="relative py-20 2xl:py-40 bg-gray-800 overflow-hidden">
          <img className="hidden lg:block absolute inset-0 mt-32" src="zospace-assets/lines/line-mountain.svg" alt="" />
          <img className="hidden lg:block absolute inset-y-0 right-0 -mr-40 -mt-32" src="zospace-assets/lines/line-right-long.svg" alt="" />
          <div className="relative container px-4 mx-auto">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap items-center -mx-4">
                <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
                  <div className="max-w-md">
                    <span className="text-lg text-blue-400 font-bold">Register Account</span>
                    <h2 className="mt-8 mb-12 text-5xl font-bold font-heading text-white">Start your journey by creating an account.</h2>
                    <p className="text-lg text-gray-200">
                      <span>The brown fox jumps over</span>
                      <span className="text-white">the lazy dog.</span>
                    </p>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 px-4">
                  <div className="px-6 lg:px-20 py-12 lg:py-24 bg-gray-600 rounded-lg">
                    <form>
                      <h3 className="mb-10 text-2xl text-white font-bold font-heading">Register Account</h3>
      
                      <div className="flex items-center pl-6 mb-3 bg-white rounded-full">
                        <span className="inline-block pr-3 py-2 border-r border-gray-50">
                          {/* SVG for icon */}
                        </span>
                        <input 
                          className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-900 rounded-r-full focus:outline-none" 
                          type="text" 
                          id="username" 
                          placeholder="Username" 
                          value={user.username} 
                          onChange={(e) => setUser({ ...user, username: e.target.value })}
                        />
                      </div>
      
                      <div className="flex items-center pl-6 mb-3 bg-white rounded-full">
                        <span className="inline-block pr-3 py-2 border-r border-gray-50">
                          {/* SVG for icon */}
                        </span>
                        <input 
                          className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-900 rounded-r-full focus:outline-none" 
                          type="email" 
                          id="email" 
                          placeholder="example@domain.com" 
                          value={user.email} 
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                      </div>
      
                      <div className="flex items-center pl-6 mb-6 bg-white rounded-full">
                        <span className="inline-block pr-3 py-2 border-r border-gray-50">
                          {/* SVG for icon */}
                        </span>
                        <input 
                          className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-900 rounded-r-full focus:outline-none" 
                          type="password" 
                          id="password" 
                          placeholder="Password" 
                          value={user.password} 
                          onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                      </div>
      
                      <button
                        onClick={onSignup}
                        className="w-full py-4 mb-4 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-200"
                        disabled={buttonDisabled}
                      >
                        {buttonDisabled ? "No Signup" : "Signup"}
                      </button>
      
                      <div className="text-center mt-4">
                        Already have an account?
                        <Link href="/login" className="text-blue-400 hover:text-blue-600">Login</Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
      

}