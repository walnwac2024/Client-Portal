"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

interface ClientActionsProps {
  isAdmin?: any;
}

export default function ClientActions({ isAdmin }: ClientActionsProps) {
  const router = useRouter();

  const handleAddClient = useCallback(() => {
    router.push(routes.addclient);
  }, [router]);

  const handleAddUser = useCallback(() => {
                router.push(routes.addUser);
              }, [router]);
  const sendMessage = useCallback(() => {
                router.push(routes.whatsapp);
              }, [router]);

  return (
    <div className="w-full flex justify-end mt-4">
      {isAdmin && (
        <button
          className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 mr-2"
          onClick={handleAddClient}
        >
          <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Add User
        </button>
      )}
      <button
        className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 mr-2"
        onClick={handleAddUser}
      >
        <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Add Client
      </button>
      <button
        className="flex items-center justify-center rounded-xl bg-[#E62E2D] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150"
        onClick={sendMessage}
      >
        <span className="text-lg md:text-xl lg:text-2xl font-bold">+</span> Send Sms
      </button>
    </div>
  );
}