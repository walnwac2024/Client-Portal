"use client";
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from "axios";
import { routes } from "@/config/routes";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  let userData;
  

  try {
      const storedData = localStorage?.getItem("userData");
      console.log("The user data is:",storedData)
      
      // Check if storedData exists and is not null
      if (storedData) {
          userData = JSON.parse(storedData);
      } else {
          userData = null; // Or handle as needed if no data exists
      }
  } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      userData = null; // Default value in case of error
  }
  
  const hideNavbarRoutes = ['/login', '/signup'];
  

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      if (response) {
        // Successfully logged out
        toast.success("You have been logged out.");
        localStorage.removeItem('userData');
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  // Corrected JSX return
  if (hideNavbarRoutes.includes(pathname)) {
    return null; // If route matches, return nothing
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-lg border border-[#E62E2D] bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl">
      <div className="px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a aria-current="page" className="flex items-center" href="/">
              <Image className="h-7 w-auto" src="/images/Elaan-logo.png" alt="Elaan Logo" height={100} width={100} />
              <p className="sr-only">Website Title</p>
            </a>
          </div>
          {/* Links */}
          <div className="md:flex md:items-center md:justify-center md:gap-5">
            <a aria-current="page" className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:text-red-900" href="#">Elaan Marketing</a>
            <a className="hidden md:inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:text-red-900" href="#">Client Portal</a>
          </div>
          {/* Sign Out and Show All Clients Buttons */}
          <div className="flex items-center justify-end gap-2">
            {userData?.data?.isAdmin ? (
              <button className="items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150" onClick={() => { router.push(routes.allclients); }}>
                + Clients
              </button>
            ):null}
            <button className="items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
