"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function ViewClientForm() {
  const [clientData, setClientData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve and parse data from query params
  useEffect(() => {
    const userString = searchParams.get("user");
    if (userString) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userString));
        setClientData(decodedUser);
      } catch (error) {
        console.error("Failed to parse user data from query:", error);
      }
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-6 md:p-12 shadow-lg bg-gray-900">
      <h2 className="font-bold text-2xl md:text-3xl text-white">View Client Details</h2>
      <p className="text-gray-300 text-base md:text-lg max-w-md mt-3">
        Here are the details of the selected client.
      </p>

      <div className="my-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="First Name" value={clientData.firstname} />
          <ReadOnlyField label="Last Name" value={clientData.lastname} />
        </div>
        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Username" value={clientData.username} />
          <ReadOnlyField label="Email Address" value={clientData.email} />
        </div>
        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Phone Number" value={clientData.phone} />
          <ReadOnlyField label="Address" value={clientData.address} />
        </div>
        <Divider />
      </div>

      <button
        className="bg-gradient-to-br from-gray-800 to-gray-700 w-full text-white rounded-lg h-12 font-semibold shadow-md transition hover:bg-gray-700"
        onClick={() => router.back()}
      >
        Back &larr;
      </button>
    </div>
  );
}

const ReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <Label className="text-gray-400 text-sm md:text-base">{label}</Label>
    <Input
      type="text"
      className="bg-gray-800 text-white text-lg md:text-xl rounded-md px-4 py-3"
      value={value || ""}
      readOnly
    />
  </div>
);

const Divider = () => (
  <div className="w-full border-t border-dashed border-gray-700 my-4"></div>
);
