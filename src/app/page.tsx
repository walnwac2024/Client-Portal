"use client";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Highlight, HeroHighlight } from "@/components/ui/hero-highlight";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site.config";
import SortableTableforusers from "@/components/ui/table/Client-table"
import SortableTable from "@/components/ui/table/table"
// Lazy-loaded components
// const SortableTableforusers = dynamic(
//   () => import("@/components/ui/table/Client-table"),
//   { ssr: false, loading: () => <div>Loading table...</div> }
// );
// const SortableTable = dynamic(() => import("@/components/ui/table/table"), {
//   ssr: false,
//   loading: () => <div>Loading table...</div>,
// });

export const metadata = {
  title: `Client Management | ${siteConfig.title}`,
  description: "View and manage your clients efficiently",
};

export default function Home({ userDataFromServer }: { userDataFromServer: any }) {
  const router = useRouter();
  const [userData, setUserData] = useState(userDataFromServer || "");

  // Fetch user data from localStorage only on the client-side
  useEffect(() => {
    if (!userDataFromServer && typeof window !== "undefined") {
      const storedData = localStorage.getItem("userData");
      const parsedData = storedData ? JSON.parse(storedData) : null;
      const name =
        parsedData?.data?.firstname || parsedData?.data?.lastname
          ? `${parsedData?.data?.firstname || ""} ${parsedData?.data?.lastname || ""}`
          : "";
      setUserData(name);
    }
  }, [userDataFromServer]);

  // Callback functions to avoid re-renders
  const handleAddClient = useCallback(() => {
    router.push(routes.addclient);
  }, [router]);

  const handleAddUser = useCallback(() => {
    router.push(routes.addUser);
  }, [router]);

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Highlight Section */}
      <HeroHighlight>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-lg md:text-2xl lg:text-3xl font-bold text-neutral-700 dark:text-white text-center pt-24"
        >
          <Highlight className="text-white">
            Hi! {userData || ""} Welcome to the Client Portal
          </Highlight>
        </motion.h1>
      </HeroHighlight>

      {/* Buttons Section */}
      <div className="w-full flex justify-end mt-4">
        {userData?.isAdmin && (
          <button
            className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 mr-2"
            onClick={handleAddClient}
          >
            <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Add User
          </button>
        )}
        <button
          className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150"
          onClick={handleAddUser}
        >
          <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Add Client
        </button>
      </div>

      {/* Centered Table */}
      <div className="flex justify-center items-center w-full px-4 mt-12 md:mt-8">
        {userData?.isAdmin ? <SortableTable /> : <SortableTableforusers />}
      </div>
    </div>
  );
}
