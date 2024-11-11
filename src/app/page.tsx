"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Highlight, HeroHighlight } from "@/components/ui/hero-highlight";
import SortableTable from "@/components/ui/table/table";
import { routes } from "@/config/routes";
import SortableTableforusers from "@/components/ui/table/Client-table";
import Image from 'next/image';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
export default function Home() {
  const router = useRouter();
  let userData;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage?.getItem("userData"));
  }
  
  return (
    <>
    
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Highlight Section */}
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-lg md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-white text-center pt-24"
        >
          <Highlight className="text-white">
            Hi!
            {userData?.data?.firstname || userData?.data?.lastname
              ? ` ${userData?.data?.firstname || ""} ${userData?.data?.lastname || ""}, `
              : ""}
            Welcome to the Client Portal
          </Highlight>
        </motion.h1>
      </HeroHighlight>

      {/* Buttons Section */}
      <div className="w-full flex justify-end mt-4">
      {userData?.data?.isAdmin ? (
          <button
            className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 mr-2"
            onClick={() => router.push(routes.addclient)}
          >
            <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Add User
          </button>
        ) : null}
        <button
          className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150"
          onClick={() => router.push(routes.addUser)}
        >
          <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Add Client
        </button>
      </div>

      {/* Centered Table */}
      <div className="flex justify-center items-center w-full px-4 mt-12 md:mt-8">
        {userData?.data?.isAdmin ? (
          <SortableTable />
        ) : (
          <SortableTableforusers />
        )}
      </div>
    </div>
    </>
  );
}
