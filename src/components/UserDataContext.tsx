"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

interface UserDataContextType {
  userData: any;
  setUserData: (data: any) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode;
  initialData: any;
}) {
  const [userData, setUserData] = useState(initialData || "");
  const [Admin, setAdminData] = useState(initialData || "");

  useEffect(() => {
    if (!initialData && typeof window !== "undefined") {
      const storedData = localStorage.getItem("userData");

      const parsedData = storedData ? JSON.parse(storedData) : null;
      const name =
        parsedData?.data?.firstname || parsedData?.data?.lastname
          ? `${parsedData?.data?.firstname || ""} ${parsedData?.data?.lastname || ""}`
          : "";
      setUserData(name);
      setAdminData(parsedData)
    }
  }, [initialData]);

  return (
    <UserDataContext.Provider value={{Admin, userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};