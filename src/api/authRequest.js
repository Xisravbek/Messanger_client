import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

const API = axios.create({baseURL: serverURL})

export const register = async (formData) => {
    let res= await API.post("/api/auth/signup", formData)
    return res;
}
export const login = (formData) => {
    return API.post("/api/auth/login", formData)
}