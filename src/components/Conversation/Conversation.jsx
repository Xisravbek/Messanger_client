import React, { useEffect, useState } from 'react'
import "./Conversation.css"
import { useInfoContext } from '../../context/Context';
import { getUser } from '../../api/userRequest';
import DefaultImage from "../../images/24-248253_user-profile-default-image-png-clipart-png-download.png";


const serverURL = process.env.REACT_APP_SERVER_URL;


const Conversation = ({chat}) => {
    const {currentUser, exit, onlineUsers } = useInfoContext();
    const [userData , setUserData ] = useState({});

    const userId = chat.members.find(id => id !== currentUser._id);


    const online = () => {
        const onlineUser = onlineUsers.find(user => user.userId == userId);
        return onlineUser ? true : false
      }

    useEffect(() => {
        const getUserData = async () => {
            try {
                const {data } = await getUser(userId);
                setUserData(data.user);
                
            } catch (error) {
                console.log(error);
                if(error.response.data.message == "jwt expired"){
                    exit()
                }
            }
        }

        getUserData()
    },[userId])
  return (
    <div>
      <div className='user-card chat-card'>
        <div className='user-info-box'>
            <div className="user-image">
                <img  className='user-profileImage' src={userData.profilePicture ? serverURL  + "/" +  userData.profilePicture : DefaultImage} alt="user-photo" />
                {
                    online() && <div className="online-dot"></div>
                }
            </div>
            <div className="user-info">
                <h3 className='user-title'>
                {userData.firstname + " " + userData.lastname}
                </h3>
                <span className={online() ? "status" : ''}>{
                    online() ? "online" : "offline"
                  }</span>
            </div>
        </div>
        
        
        </div>
    </div>
  )
}

export default Conversation
