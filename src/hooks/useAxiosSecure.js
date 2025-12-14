// src/hooks/useAxiosSecure.js

import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react"; // Explicitly import useContext
import { AuthContext } from "../Context/AuthContext"; // <-- CORRECTED PATH to match your structure
import { useNavigate } from "react-router-dom";

// 1. Create the Axios Instance
const axiosSecure = axios.create({
    // Uses the URL defined in your frontend .env file
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true,
});

const useAxiosSecure = () => {
    // 2. Access AuthContext using the correct variable names
    const { user, logOut } = useContext(AuthContext); 
    const navigate = useNavigate();

    useEffect(() => {
        
        // 3. Add Request Interceptor: Attach Firebase ID Token
        const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            try {
                // We only need to proceed if the user is authenticated
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            } catch (error) {
                console.error("Error getting Firebase ID Token:", error);
                // If token fetching fails, reject the request
                return Promise.reject(error);
            }
        });

        // 4. Add Response Interceptor: Handle 401/403 errors
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;

                // If token is expired or invalid (401/403), log the user out
                if (status === 401 || status === 403) {
                    console.warn(`Auth Error: Status ${status}. Logging user out.`);
                    await logOut(); 
                    navigate('/login'); 
                }
                return Promise.reject(error);
            }
        );

        // Cleanup function to remove interceptors when the component unmounts or dependencies change
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };

    }, [user, logOut, navigate]); // Dependencies for useEffect

    return axiosSecure;
};

export default useAxiosSecure;