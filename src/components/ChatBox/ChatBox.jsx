import React, { useEffect, useRef, useState } from 'react';
import DefaultImage from "../../images/24-248253_user-profile-default-image-png-clipart-png-download.png";
import { useInfoContext } from '../../context/Context'
import { getUser } from '../../api/userRequest';
import './ChatBox.css'
import { addMessage, getMessages } from '../../api/messageRequest';
import InputEmoji from 'react-input-emoji'
import {format } from "timeago.js"

const serverURL =  process.env.REACT_APP_SERVER_URL;

const ChatBox = ({setModal, setSendMessage, answerMessage}) => {

    const {currentChat, setCurrentChat, exit, currentUser, setUserInfo , onlineUsers} = useInfoContext(null);


    const [userData , setUserData ] = useState({});
    const [messages, setMessages ] = useState([])
    const [textMessage, setTextMessage ] = useState('');

    const scroll = useRef();
    const userId = currentChat?.members.find(id => id !== currentUser._id);
    const sendImg_rf = useRef()
    
    const online = () => {
        const onlineUser = onlineUsers.find(user => user.userId ==userId );
        return onlineUser ? true : false
      }

    useEffect(() => {
        scroll.current?.scrollIntoView({behovier: "smooth"})
    }, [messages])

  
   


    useEffect(() => {
        const getUserData = async () => {
            try {
                const {data } = await getUser(userId);
                
                setUserData(data.user)
            } catch (error) {
                console.log(error);
                if(error.response.data.message == "jwt expired"){
                    exit()
                }
            }
        }

        userId && getUserData()
    },[userId]);

    useEffect(() => {
        const fetchMessages = async() => {
            try {
                const {data} = await getMessages(currentChat._id);
                setMessages(data.messages)
                
            } catch (error) {
                console.log(error);
            }
        }

        if(currentChat){
            fetchMessages()
        }
    }, [currentChat]);


    useEffect(() => {
        if(currentChat && answerMessage?.chatId == currentChat?._id){
            answerMessage && setMessages([...messages, answerMessage])
            
        }else{
        }
    }, [answerMessage])

    const handleSend = async () => {

        if(sendImg_rf.current.value !== ""){{
            
        }}
        const message = {
            senderId: currentUser._id,
            text: textMessage,
            chatId: currentChat._id,
            createdAt: new Date().getTime()
        }

        if(textMessage === "" ) {
            return
        }
        setSendMessage({...message, receivedId: userId});

        try {
            const {data} = await addMessage(currentChat._id ,message);
            setMessages([...messages, data.message]);
            setTextMessage('')
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleText = (e) => {
        setTextMessage(e)
    }


  return (
    <div className='chat-box'>
        {
            currentChat ? <>

                <div className='user-info'>
                    <div className="user-image">
                    <img onClick={() => {
                        setModal('info');
                        setUserInfo(userData)
                    }} className='user-profileImage' src={userData.profilePicture ?  serverURL + "/" + userData.profilePicture  : DefaultImage} alt="user-photo" />
                    {
                        online() && <div className="online-dot"></div>
                    }
                </div>
                <div className="user-info">
                    <h3 className='user-title'>
                    {userData.firstname + " " + userData.lastname}
                    </h3>
                    <span className="status" style={online() ? {color: "dodgerblue"}: {color: "black"}}>
                        {
                            online() ? "online" : "offline"
                        }   
                    </span>
                </div>
                </div>
                <hr />

                <div className='chat-body'>
                    
                     {
                        messages.map(message => {
                            return(
                                <div ref={scroll} key={message._id} className={message.senderId === currentUser._id ? "message own": 'message'} >
                                    {
                                        message.file && <img src={serverURL +'/' + message.file} className='users-message-img' alt="Img" />
                                    }
                                    <span className='message-text'>{message.text}</span>
                                    <span className='message-date'>{format(message.createdAt)}</span>
                                </div>
                            )
                        })
                     }
                </div>

                <div className="chat-sender">
                    <div className="sender-file-btn btn">
                        <label htmlFor="send-file-id"><i className="fa-solid fa-image"></i></label>
                    </div>
                     <InputEmoji onEnter={handleSend} value={textMessage} onChange={handleText}  />
                    <button onClick={handleSend} className='send-btn btn'>Send</button>
                    <input ref={sendImg_rf} type="file" name='image' id= "send-file-id"className='message-file-input' />
                </div>
            </> : <div>
                <h2>Tap on a chat to start conversation...</h2>
            </div> 
            
        }
      
    </div>
  )
}

export default ChatBox
