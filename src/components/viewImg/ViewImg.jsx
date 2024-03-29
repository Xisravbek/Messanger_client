import React from 'react'
import "./ViewImg.css";
const serverURL = process.env.REACT_APP_SERVER_URL;

const ViewImg = ({images, setView, view}) => {
  return (
    <div className='viewImg'>
        <div className="close-view-box">
            <button onClick={() => setView(null)} className="btn close-view">Close</button>
        </div>
      <div className="view-img-box">
        <img className='show-img' src={serverURL + '/' + view} alt="img" />
      </div>
    </div>
  )
}

export default ViewImg
