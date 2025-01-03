"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditUser() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    cnic: "",
    email: "",
    phone: "",
    office_name: "",
    office_address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve and parse data from query params
  useEffect(() => {
    const userString = searchParams.get("user");
    if (userString) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userString));
        setFormData(decodedUser); // Set the parsed object as formData
      } catch (error) {
        console.error("Failed to parse user data from query:", error);
      }
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/api/users/updateuser", formData);
      if (response.status === 200) {
        toast.success(response.data.message)
        setIsEditing(false); // Disable editing after saving
        router.back(); // Navigate back on success
      }
    } catch (error) {
      console.error("Failed to update client data:", error);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-6 md:p-12 shadow-lg bg-gray-200">
      <h2 className="font-bold text-2xl md:text-3xl text-black">Client Details</h2>
      <p className="text-black text-base md:text-lg max-w-md mt-3">
        {isEditing ? "Edit the details below." : "View the client's details below."}
      </p>

      <div className="my-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <EditableField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        </div>
        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label="CNIC"
            name="cnic"
            value={formData.cnic}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <EditableField
            label="Email Address"
            name="email"
            value={formData.email}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        </div>
        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <EditableField
            label="Office Name"
            name="office_name"
            value={formData.office_name}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
          <EditableField
            label="Office Address"
            name="office_address"
            value={formData.office_address}
            isEditing={isEditing}
            onChange={handleInputChange}
          />
        </div>
        <Divider />
      </div>

      <button
        className="bg-gradient-to-br from-red-800 to-red-700 w-full text-white rounded-lg h-12 font-semibold shadow-md transition hover:bg-gray-700 mb-4"
        onClick={isEditing ? handleSave : handleEditToggle}
      >
        {isEditing ? "Save Changes" : "Edit"}
      </button>

      <button
        className="bg-[#E62E2D] w-full text-white rounded-lg h-12 font-semibold shadow-md transition hover:bg-red-600"
        onClick={() => router.back()}
      >
        Back &larr;
      </button>
    </div>
  );
}

const EditableField = ({ label, name, value, isEditing, onChange }) => (
  <div className="flex flex-col space-y-1">
    <Label className="text-black text-sm md:text-base">{label}</Label>
    <Input
      type="text"
      name={name}
      className={`bg-white text-gray-800 text-lg md:text-xl rounded-md px-4 py-3 ${
        isEditing ? "bg-whitefocus:bg-red-600" : "bg-white"
      }`}
      value={value}
      readOnly={!isEditing}
      onChange={isEditing ? onChange : undefined}
    />
  </div>
);

const Divider = () => (
  <div className="w-full border-t border-dashed border-[#E62E2D] my-4"></div>
);
