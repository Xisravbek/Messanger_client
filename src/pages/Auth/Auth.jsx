import React, { useState } from 'react';
import { useInfoContext } from '../../context/Context';
import "./Auth.css";
import logo  from "../../images/pngegg.png"
import { toast } from 'react-toastify';
import { login, register } from '../../api/authRequest';

const Auth = () => {
    const {currentUser, setCurrentUser} = useInfoContext()
    const [isSignUp, setIsSignUp ] = useState(false);
    const [loading, setLoading ] = useState(false)
    const [confirmPass, setConfirmPass ] = useState(true);


    const Registeration = async (e) => {
        e.preventDefault()
        try {
            let formData = new FormData(e.target);
            setLoading(true);
            toast.loading('Please Wait');
            let res;
            if(isSignUp){
                res = await login(formData) 
                toast.dismiss()
            }else{
                const password = formData.get("password");
                const confirmPassword = formData.get("confirmPassword")
                if(password == confirmPassword ) {
                    setConfirmPass(true);
                    res = await register(formData)
                    toast.dismiss()
                }else{
                    setConfirmPass(false)
                    return toast.dismiss()
                }
            };
            localStorage.setItem('profile', JSON.stringify(res.data.user));
            localStorage.setItem('token', JSON.stringify(res.data.token));
            setCurrentUser(res.data.user)
            setLoading(false);
            
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message);
            console.log(error);
            setLoading(false);

        }
    }

  return (
    <div className='auth-comp'>
        <div className='auth'>
      <div className="left-auth">
        <img src={logo} className='logo-img' alt="logo" />
        <div className='app-name'>
            <h1>JS Media App</h1>
            <h6>Explore with Webstar IT Academy</h6>
        </div>
      </div>
      <div className="right-auth">
            <form action="#" onSubmit={Registeration} className="auth-form">
                <h3>{isSignUp ? "Login" : "Sign Up"}</h3>
                {
                    !isSignUp && <>
                     <div>
                        <input type="text" name='firstname' placeholder='Firstname' required className="info-input" />
                    </div>
                    <div>
                        <input type="text" name='lastname' placeholder='Lastname' required className="info-input" />
                    </div>
                    </>
                }
               
                <div>
                    <input type="email" name='email' placeholder='Email' required className="info-input" />
                </div>
                <div>
                    <input type="password" name='password' placeholder='Password' required className="info-input" />
                </div>
                {
                    !isSignUp && <div>
                                <input type="password" name='confirmPassword' placeholder='confirm password' required className="info-input" />
                            </div>
                }

                {
                    !confirmPass && <span className='confirm-span'>*Confirm password is not same</span>
                }    
                

                <div>
                    <span onClick={() => {setIsSignUp(!isSignUp) 
                    setConfirmPass(true)}} className='input-span'>{isSignUp ? "Don't have an account. SignUp" : "Already have an account. Login"}</span>
                </div>

                <button className='info-btn btn'>{isSignUp ? "Login" : "Sign Up"}</button>
            </form>
      </div>
    </div>
    </div>
  )
}

export default Auth
