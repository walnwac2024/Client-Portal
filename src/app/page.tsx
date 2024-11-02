"use client";
import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from "axios";
import { toast } from "react-hot-toast";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import SortableTable from "@/components/ui/table/table";
export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      
      <div className="absolute top-4 right-4">
        <button 
          className="flex items-center px-6 py-2 bg-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
          onClick={() => router.push(routes.addClient)}
        >
          <span className="mr-2 text-xl font-bold">+</span> Add Client
        </button>
      </div>
  
      {/* Centered SortableTable */}
      <div className="flex justify-center items-center w-full px-4">
        <SortableTable />
      </div>
    </div>
  );
}
