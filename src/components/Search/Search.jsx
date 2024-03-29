import React, { useEffect, useState } from 'react';
import {UilSearch} from "@iconscout/react-unicons"
import Logo from "../../images/pngegg.png"
import Users from '../Users/Users';
import { toast } from 'react-toastify';
import "./Search.css"
import { getAllUsers } from '../../api/userRequest';

const Search = ({setModal, setUsersMedia}) => {
    const [users, setUsers ] = useState([]);
    const [storage, setStorage ] = useState([])
    const getUsers = async() => {
      try {
          toast.loading('please wait');
          const res = await getAllUsers();
          setUsers(res?.data?.users);
          setStorage(res?.data?.users)
          toast.dismiss()
      } catch (error) {
          toast.dismiss()
          toast.error(error?.response?.data?.message)
      }
    }
    useEffect(() => {
        getUsers()
    }, [])

    const searchUser = (e) =>  {
      
      let {value} = e.target;
      value = value.toLowerCase()
      let arr = storage.filter(item => {
        if(item.firstname?.toLowerCase().includes(value) || item.lastname?.toLowerCase().includes(value)){
          return item;
        }
      })
      setUsers(arr)
      
      
    }

  return (
    <div className='search-user'>
      <div className="search-box">
        {/* <img src={Logo} className='logo-app' alt="logo" /> */}
        <div className="search-input-box">
            <input onChange={(e) =>searchUser(e)} type="text" name='name' placeholder='Search...' className="search-input" />
            <UilSearch className="search-icon" />
            
        </div>
      </div>
      <hr />
      <h1 className='users-title'>All Users</h1>
      <Users setModal={setModal} setUsersMedia={setUsersMedia} users={users} />
    </div>
  )
}

export default Search
