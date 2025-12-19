import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://lonify-server-side.onrender.com/",
  withCredentials: true,
});
export default axiosPublic;
