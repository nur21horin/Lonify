

import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react"; 
import { AuthContext } from "../Context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
    
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true,
});

const useAxiosSecure = () => {
    
    const { user, logOut } = useContext(AuthContext); 
    const navigate = useNavigate();

    useEffect(() => {
        
       
        const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            try {
               
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            } catch (error) {
                console.error("Error getting Firebase ID Token:", error);
                
                return Promise.reject(error);
            }
        });

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;

               
                if (status === 401 || status === 403) {
                    console.warn(`Auth Error: Status ${status}. Logging user out.`);
                    await logOut(); 
                    navigate('/login'); 
                }
                return Promise.reject(error);
            }
        );

        
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };

    }, [user, logOut, navigate]); 

    return axiosSecure;
};

export default useAxiosSecure;