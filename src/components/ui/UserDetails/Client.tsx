"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import {useRouter} from "next/navigation";

import { toast } from "react-hot-toast";
export default function AdduserForm() {
  const router=useRouter()
  const [formData, setFormData] = useState<any>({
    firstname: "",
    lastname: "",
    cnic: "",
    email: "",
    phone: "",
    office_name: "",
    office_address: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send formData to the backend API
    try {
      
      const response:any = await axios.post("/api/users/addnewuser",formData);
     
        console.log("Client added successfully");
        toast.success("Client added successfully!");
        // Optionally, reset form or show success message
        if (response.status === 201){
          router.back()
        }
    } catch (error) {
      console.error("Error",error)
      toast.error(error?.response?.data?.error)
      
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gray-100">
      <h2 className="font-bold text-xl text-black">Add New User</h2>
      <p className="text-black text-sm max-w-sm mt-2">
        Please provide the information for the new user.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname" className="text-black">First Name</Label>
            <Input
              id="firstname"
              placeholder="Tyler"
              type="text"
              className="bg-white text-black"
              value={formData.firstname}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname" className="text-black">Last Name</Label>
            <Input
              id="lastname"
              placeholder="Durden"
              type="text"
              className="bg-white text-black"
              value={formData.lastname}
              onChange={handleChange}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="cnic" className="text-black">CNIC</Label>
          <Input
            id="cnic"
            placeholder="XXXXX-XXXXXXX-X"
            type="text"
            className="bg-white text-black"
            value={formData.cnic}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-black">Email Address</Label>
          <Input
            id="email"
            placeholder="client@example.com"
            type="email"
            className="bg-white text-black"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
       

        <LabelInputContainer className="mb-4">
          <Label htmlFor="phone" className="text-black">Phone Number</Label>
          <Input
            id="phone"
            placeholder="03xx-xxxxxxx"
            type="tel"
            className="bg-white text-black"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="office_name" className="text-black">Office Name</Label>
          <Input
            id="office_name"
            placeholder="Gulberg Green Islamabad"
            type="text" // Use 'password' type for hiding input
            className="bg-white text-black"
            value={formData.office_name} // Make sure to manage password in the state
            onChange={handleChange}
            
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="office_address" className="text-black">Office Address</Label>
          <Input
            id="office_address"
            placeholder="GulBerg Green Islamabad"
            type="text"
            className="bg-white text-black"
            value={formData.office_address}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-red-800 to-red-700 block w-full text-white rounded-md h-10 font-medium shadow-md transition hover:bg-gray-700"
          type="submit"
          
        >
          Save Client &rarr;
          
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
