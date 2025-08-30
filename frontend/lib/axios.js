//https://slack-backend-mu.vercel.app/api

import axios from "axios";

const BASE_URL = import.meta.env.MODE ==='development'
? 'https://localhost:5001/api': 'https://slack-backend-mu.vercel.app/api';
export const axiosInstance = axios.create({
    baseURL:BASE_URL,
    withCredentials:true,
})