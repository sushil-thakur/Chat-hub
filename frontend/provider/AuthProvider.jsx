import { createContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext({});
export default function AuthProvider({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    //setup axios interceptor
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          if (
            error.message?.includes("auth") ||
            error.message?.includes("token")
          ) {
            toast.error("AUthentication issue. Please refresg the page.");
          }
          console.log("error getting token:", error);
        }
        return config;
      },
      (error) => {
        console.error("Axios request error:", error);
        return Promise.reject(error);
      }
    );
    //cleanup function to remove intereptor, thi sis important or eaviod memeory leaks
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}
