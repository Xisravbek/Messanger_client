import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";


const serverURL = process.env.REACT_APP_SERVER_URL;
const socket = io(serverURL);

const InfoContetxt = createContext();

export const useInfoContext = () => useContext(InfoContetxt);

export const InfoProvider =  ({children}) =>{
    const [currentUser ,setCurrentUser ] = useState(JSON.parse(localStorage.getItem("profile")));
    const [chats, setChats] = useState([]);
    const [ userInfo , setUserInfo ] = useState(null);
    const [onlineUsers, setOnlineUsers ] = useState([])
    const [currentChat, setCurrentChat ] = useState(null);

    const exit = () => {
        socket.emit('exit', currentUser._id)
        setCurrentUser(null);
        setCurrentChat(null)
        localStorage.clear();
    }

    const value = {
        currentUser, setCurrentUser,
        exit, chats, setChats,
        userInfo, setUserInfo, 
        onlineUsers, setOnlineUsers,
        currentChat, setCurrentChat
    }
    return (
        <InfoContetxt.Provider value={value}>
            <InfoContetxt.Consumer>
                {() => children}
            </InfoContetxt.Consumer>
        </InfoContetxt.Provider>
    )
}