import { AuthContextType } from "@/interfaces/auth";
import { User } from "@/interfaces/auth";
import { getMe } from "@/lib/api";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
  
      if (!parsedUser.token) {
        console.error("Token is missing in stored user:", parsedUser);
      }
  
      setUser(parsedUser);
    }
  }, []);
    // Gọi API lấy user khi component mount
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user", error);
          setUser(null);
        }
      };
  
      fetchUser();
    }, []);



  const login = (userData: { user: User }) => {
    if (!userData.user || !userData.user.token) {
      console.error("🚨 User data is missing or invalid!", userData);
      return;
    }
  
    console.log("✅ User data received:", userData);
  
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.user.token);
    setUser(userData.user);
  };
  const register = (userData: { user: User }) => {
    if (!userData.user || !userData.user.token) {
      console.error("🚨 User data is missing or invalid!", userData);
      return;
    }
  
    console.log("✅ User data received:", userData);
  
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.user.token);
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login,register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
