import axios from "axios";

const serverURL = process.env.REACT_APP_SERVER_URL;

const API = axios.create({baseURL: serverURL})

export const getAllUsers = () => {
    return API.get("/api/users" )
}
export const getUser = (id) => {
    return API.get(`/api/users/${id}`)
}
export const updateUser = (id, formData) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.put(`/api/users/${id}`, formData, {headers: {token}} )
} 
export const deleteUser = (id) => {
    const token = JSON.parse(localStorage.getItem('token'))
    return API.delete(`/api/users/${id}`, {headers: {token}} )
} 