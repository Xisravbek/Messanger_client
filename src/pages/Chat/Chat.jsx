import React, { useEffect, useState } from 'react'
import { useInfoContext } from '../../context/Context'
import "./Chat.css"
import {UilSetting} from "@iconscout/react-unicons"
import Search from '../../components/Search/Search'
import { Route, Routes } from 'react-router-dom'
import MyProfile from '../MyProfile/MyProfile'
import { toast } from 'react-toastify'
import { getUserChats } from '../../api/chatRequest'
import Conversation from '../../components/Conversation/Conversation'
import Modal from '../../components/Modal/Modal'
import ChatBox from '../../components/ChatBox/ChatBox'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import { io } from 'socket.io-client'

const serverURL = process.env.REACT_APP_SERVER_URL;

const socket = io(serverURL);

const Chat = () => {
  const {exit, currentUser, chats, setChats, setUserInfo, currentChat, setCurrentChat,onlineUsers, setOnlineUsers } = useInfoContext();
  const [modal, setModal] = useState(null);
  const [openConfirm , setOpenConfirm ] = useState(false);
  const [sendMessaage, setSendMessage ] = useState(null)
  const [answerMessage, setAnswerMessage ] = useState(null);
  const [usersMedia , setUsersMedia ] = useState(false);
  const [chatMedia, setChatMedia ] = useState(false)

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await getUserChats();
        setChats(res.data.chats)
      } catch (error) {
        toast.error(error?.response?.message)
        console.log(error);
      }
    }
    getChats()
  }, [currentUser])

  useEffect(() => {
    socket.emit("new-user-add" , currentUser._id);
    socket.on('get-users' , (users) => {
      setOnlineUsers(users)
    } )
  }, [])

  //send message -to spcket server
  useEffect(() => {
    if(sendMessaage !== null){
      socket.emit('send-message', sendMessaage)
    }
  }, [sendMessaage])

  useEffect(() => {
    socket.on("answer-message", (data)=> [
      setAnswerMessage(data)
    ])
  }, [])


  return (
    <div className='chat'>
      <div className="container">
        <div className="chat-page">
              {/* user-list and search */}
              <div>
              <button onClick={() => setUsersMedia(prev => !prev)} className="btn open-users">
                All Users
              </button>
              <button onClick={() => setChatMedia(prev => !prev)} className='btn open-chats'>
                My Chats
              </button>
              </div>
              <div className={usersMedia ? "left-side users-media" : "left-side"} >
                {usersMedia && <button onClick={() => setUsersMedia(false)} className='btn users-close-btn'>
                  X</button>}
                <Search setModal={setModal} setUsersMedia={setUsersMedia} />
              </div>
              {/* conversation */}

              <div className="middle-side">
                <ChatBox setSendMessage={setSendMessage} answerMessage={answerMessage} setModal={setModal} />
              </div>

              {/* chat-list */}
              <div className={chatMedia ? "right-side chat-media" : "right-side"}>
                {
                  chatMedia && <button onClick={() => setChatMedia(false)} className='btn users-close-btn'>
                  X</button>
                }
                <div className="rigth-side-top">
                  <h1>Chat</h1>
                  <button className='btn setting-btn' onClick={() => {
                    setModal('edit');
                    setUserInfo(currentUser)
                  }}><UilSetting /></button>
                  <button className='exit btn' onClick={() => setOpenConfirm(true)}>exit</button>
                </div>

                <div className="chat-list">
                  {
                    chats.length > 0 ? chats.map((chat) => {
                      return(
                        <div onClick={() => {
                          setCurrentChat(chat)
                          setChatMedia(false)
                          }} key={chat._id} className="chat-item">
                          <Conversation  chat={chat} />
                        </div>
                      )
                    }) : <h3 className='not-found'>Chats not found</h3>
                  }
                </div>
                <div className="right-side-bottom">

                </div>
               

              </div>
        </div>
        
      </div>

      {modal && <Modal modal={modal} setModal={setModal} />}
      {openConfirm && <ConfirmModal openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} confExit={true} />}
    </div>
  )
}

export default Chat
