'use client';
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    setLoading(true); // Set loading to true when the function starts
    try {
      const response = await axios.post("/api/users/login", user);
       
      // Store user data and token if needed
      localStorage.setItem("userData", JSON.stringify(response?.data));
      console.log("Data from backend:", response.data);

      // Show success toast
      toast.success("Login Successful");

      // Redirect after successful login
      router.push("/");
    } catch (error: any) {
      console.log("Login failed", error);
      const errorMessage = error.response?.data?.error || "An error occurred";
      toast.error(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false); // Set loading back to false
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <section className="relative py-20 bg-gray-100 overflow-hidden">
      <div className="relative container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              <div className="max-w-md">
                <span className="text-lg text-[#E62E2D] font-bold">Login to Your Account</span>
                <h2 className="mt-8 mb-12 text-5xl font-bold font-heading text-black">
                  Welcome back! Please log in to continue.
                </h2>
                <p className="text-lg text-gray-700">
                  <span>Access your personalized dashboard by logging in. </span>
                  <span className="text-gray-800">Stay connected, stay productive.</span>
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="px-6 lg:px-20 py-12 lg:py-24 bg-gray-300 rounded-lg">
                <form onSubmit={(e) => e.preventDefault()}>
                  <h3 className="mb-10 text-2xl text-black font-bold font-heading">Login</h3>
                  <div className="flex items-center pl-6 mb-3 bg-white rounded-full">
                    <input
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-900 rounded-r-full focus:outline-none"
                      type="text"
                      id="email"
                      placeholder="Email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center pl-6 mb-6 bg-white rounded-full">
                    <input
                      className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-900 rounded-r-full focus:outline-none hover:border-red-600"
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={onLogin}
                    className="w-full py-4 mb-4 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition duration-200"
                    disabled={buttonDisabled}
                  >
                    {loading ? "Processing" : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
