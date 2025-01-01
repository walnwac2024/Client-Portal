"use client";
import { motion } from "framer-motion";
import { Highlight, HeroHighlight } from "@/components/ui/hero-highlight";
import { useUserData } from "./UserDataContext";
import ClientActions from "./ClientActions";
import SortableTableforusers from "@/components/ui/table/Client-table";
import SortableTable from "@/components/ui/table/table";

export default function ClientContent() {
  const { userData } = useUserData();

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-4">
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

      <ClientActions isAdmin={userData?.isAdmin} />

      <div className="flex justify-center items-center w-full px-4 mt-12 md:mt-8">
        {userData?.isAdmin ? <SortableTable /> : <SortableTableforusers />}
      </div>
    </div>
  );
}