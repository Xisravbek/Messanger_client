import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import DefaultImage from "../../images/24-248253_user-profile-default-image-png-clipart-png-download.png";
import "./Users.css"
import { useInfoContext } from '../../context/Context';
import MessageImg from "../../images/pngegg.png"
import { findChat } from '../../api/chatRequest';


const serverURL = process.env.REACT_APP_SERVER_URL;

const Users = ({users, setModal, setUsersMedia}) => {
  const {currentUser, setUserInfo, setChats, setCurrentChat, onlineUsers } = useInfoContext();

  const online = (userId) => {
    const onlineUser = onlineUsers.find(user => user.userId == userId);
    return onlineUser ? true : false
  }


  const openNewChat = async (id) => {
    try {
      const {data} = await findChat(currentUser._id, id);
      setCurrentChat(data.chat);
      setChats(prev => {
        if(!prev.some(chat => chat._id == data.chat._id)){
          return [...prev, data.chat]
        }else{
          return prev
        }
      })
      setUsersMedia(false)
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error);
    }
  }

    
  return (
    <div className='all-users'>
      {
        users && users.map((user) => {
          if(user._id !== currentUser._id){
            return(
              <div key={user._id} className='user-card'>
               <div className='user-info-box'>
               <div className="user-image">
                  <img onClick={() => {
                    setModal("info")
                    setUserInfo(user)
                  }} className='user-profileImage' src={user.profilePicture ?  serverURL + "/" + user.profilePicture  : DefaultImage} alt="user-photo" />
                  {
                    online(user._id) && <div className="online-dot"></div>
                  }
                </div>
                <div className="user-info">
                  <h3 className='user-title'>
                    {user.firstname + " " + user.lastname}
                  </h3>
                  <span className={online(user._id) ? "status" : ''}>{
                    online(user._id) ? "online" : "offline"
                  }</span>
                </div>
               </div>
                <button onClick={() => openNewChat(user._id)} className="msg-btn btn">
                  <img className='message-img' src={MessageImg} alt="" />
                </button>
                
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default Users
