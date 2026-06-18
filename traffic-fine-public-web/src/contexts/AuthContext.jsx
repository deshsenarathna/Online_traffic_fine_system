import { createContext, useContext, useState } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("driverToken"));
  const [driver, setDriver] = useState(() => {
    const saved = localStorage.getItem("driverInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;

  async function login(email, password) {
    const response = await apiClient.post("/driver-auth/login", {
      email,
      password,
    });

    const data = response.data;
    localStorage.setItem("driverToken", data.token);
    localStorage.setItem(
      "driverInfo",
      JSON.stringify({ fullName: data.fullName, email: data.email })
    );
    setToken(data.token);
    setDriver({ fullName: data.fullName, email: data.email });
  }

  async function signup(signupData) {
    const response = await apiClient.post("/driver-auth/signup", signupData);
    return response.data;
  }

  function logout() {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverInfo");
    setToken(null);
    setDriver(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, driver, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
