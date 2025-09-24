import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from ".";







interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra token khi khởi tạo app
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - Replace với actual API
      setIsLoading(true);
      
      // Mock authentication - thay thế bằng API thực tế
      if (email && password) {
        const mockUser: User = {
          id: "1",
          email: email,
          name: email.split("@")[0],
          avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=026AA7&color=fff`,
        };

        const mockToken = "mock-jwt-token-" + Date.now();
        
        // Lưu vào localStorage
        localStorage.setItem("authToken", mockToken);
        localStorage.setItem("userData", JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock registration - thay thế bằng API thực tế
      if (name && email && password) {
        const mockUser: User = {
          id: Date.now().toString(),
          email: email,
          name: name,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=026AA7&color=fff`,
        };

        const mockToken = "mock-jwt-token-" + Date.now();
        
        localStorage.setItem("authToken", mockToken);
        localStorage.setItem("userData", JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Register error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};