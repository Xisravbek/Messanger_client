import React from 'react'
import "./ConfirmModal.css"
import { toast } from 'react-toastify';
import { useInfoContext } from '../../context/Context';
import { deleteUser } from '../../api/userRequest';

const ConfirmModal = ({setOpenConfirm, openConfirm , confExit}) => {
    const {currentUser, exit} = useInfoContext()
    const deleteAccount = async() => {
        try {
            const {data} = await deleteUser(currentUser._id);
            toast.success(data.message);
            exit()
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
  return (
    <div className='confirm-modal'>
      <div className="confirm-box">
        <h3>{
          confExit ? "Do you want to exit?" : "Do you want to delete"}</h3>
        {
          confExit ? <div className='confirm-btns'>
            <button onClick={exit} className='btn yes-btn'>Yes</button>

          <button onClick={() => setOpenConfirm(false)} className='btn no-btn'>No</button>


          </div> :
           <div className='confirm-btns'>
          <button onClick={deleteAccount} className='btn yes-btn'>Yes</button>
          <button onClick={() => setOpenConfirm(false)} className='btn no-btn'>No</button>
      </div>
        }
      </div>
    </div>
  )
}

export default ConfirmModal
