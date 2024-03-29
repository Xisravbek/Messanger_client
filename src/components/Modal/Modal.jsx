import React, { useRef, useState } from 'react'
import { useInfoContext } from '../../context/Context';
import './Modal.css'
import DefaultImage from "../../images/24-248253_user-profile-default-image-png-clipart-png-download.png";
import importingCoverImg from "../../images/istockphoto-1354776457-612x612.jpg";
import ViewImg from '../viewImg/ViewImg';
import { updateUser } from '../../api/userRequest';
import { toast } from 'react-toastify';
import ConfirmModal from '../ConfirmModal/ConfirmModal';


const serverURL = process.env.REACT_APP_SERVER_URL;

const Modal = ({modal, setModal}) => {
    const [openConfirm, setOpenConfirm ] = useState(false)
    const {userInfo, setCurrentUser, setUserInfo } = useInfoContext();
    const [view, setView ] = useState(null);
    const [demoImg, setDemoImg ] = useState( userInfo.profilePicture ? serverURL + '/' + userInfo.profilePicture  : DefaultImage);
    const [coverDemoImg, setCoverDemoImg ] = useState(userInfo.coverPicture ? serverURL + "/" +  userInfo.coverPicture : importingCoverImg);
    const [upload, setUpload ] = useState(false)
    const profile_rf = useRef()
    const covver_rf = useRef();


    const changeImg = () => {
      if(profile_rf.current.files[0]){
        setDemoImg(URL.createObjectURL(profile_rf.current.files[0]));
      }
      if(covver_rf.current.files[0]){
        setCoverDemoImg(URL.createObjectURL(covver_rf.current.files[0]));
      }
    }

    const editUser = async(e) => {
      e.preventDefault();
      try {
        setUpload(true);
        let formdata = new FormData(e.target);
        profile_rf.current.files[0] && formdata.append('profilePicture', profile_rf.current.files[0]);
        covver_rf.current.files[0] && formdata.append('coverPicture' ,covver_rf.current.files[0])
        const {data} = await updateUser(userInfo._id, formdata);
        setCurrentUser(data.user);
        setUserInfo(data.user)
        localStorage.setItem('profile', JSON.stringify(data.user))
        toast.success(data.message);
        // setModal(null)
        setUpload(false)
      } catch (error) {
        setUpload(false)
        toast.error(error.response.data.message);
      }
    }
  return (
    <div className='info-modal'>

      {
        view && <ViewImg setView={setView} view={view} />
      }

      <div className='close-btn-box'>
          <button onClick={() => setModal(false)} className='close-btn btn'>X</button>
      </div>

      

      <div className="info-card">
        <div className="profile-imgs">
            <label htmlFor="profile-id">
              <img onClick={() => {
                if(modal == 'info' ){
                  setView(userInfo.profilePicture)
                }
              }} src={ demoImg} alt="profile-photo" className="profile-picture" />
              {
                modal !== "info" && <input onChange={changeImg} ref={profile_rf} name='profilePicture' type="file" id='profile-id' />
              }
            </label>
            <label htmlFor="cover-id">
              <img onClick={() => {
                if(modal == 'info'){
                  setView(userInfo.coverPicture)
                }
              }} src={   coverDemoImg} alt="cover-picture" className="cover-img" />

              {
                modal !== 'info'  && <input name='coverPicture' onChange={changeImg} ref={covver_rf} type="file" id='cover-id'  />
              }
              
            </label>

            
        </div>

        {
            modal == 'info' ? <div className='users-information'>
                <h3 className='name-user'>Name: {userInfo.firstname}</h3>
                <h3 className='name-user'>Surname: {userInfo.lastname}</h3>
                <h3 className='name-user'>Email: {userInfo.email}</h3>
                <h3 className='name-user'>About: {userInfo.about}</h3>
                <h3 className='name-user'>Country: {userInfo.country}</h3>
                <h3 className='name-user'>Relationship: {userInfo.realtionShip}</h3>
                <h3 className='name-user'>WorksAt: {userInfo.works}</h3>
                <h3 className='name-user'>LisvesIn: {userInfo.livesIn}</h3>
            </div> : <>
                <form onSubmit={editUser}  className='info-form edit-form'>
                    <input type="text" name='firstname' defaultValue={userInfo.firstname} placeholder='Firstname' required className="info-input" />
                    <input type="text" name='lastname' defaultValue={userInfo.lastname} placeholder='Lastname' required className="info-input" />
                    <input type="email" name='email' defaultValue={userInfo.email} placeholder='email' required className="info-input" />
                    <input type="text" name='about' defaultValue={userInfo.about} placeholder='Write about yourself'  className="info-input" />
                    <input type="text" name='country' defaultValue={userInfo.country} placeholder='Where are you from'  className="info-input" />
                    <input type="text" name='livesIn' defaultValue={userInfo.livesIn} placeholder='Address'  className="info-input" />
                    <input type="text" name='works' defaultValue={userInfo.works} placeholder='WorksAt'  className="info-input" />
                    <input type="text" name='realtionShip' defaultValue={userInfo.realtionShip} placeholder='Relationship'  className="info-input" />

                    

                    <button type='submit' className='btn update-btn'>{upload ? "Wait" : "Update"}</button>
                    <button type='button' onClick={() => setOpenConfirm(true)} className='delete-btn btn'>Delete Account</button>
                </form>
            </>
        }
      </div>

        {
          openConfirm && <ConfirmModal setOpenConfirm={setOpenConfirm} openConfirm={openConfirm}  />
        }
    </div>
  )
}

export default Modal
