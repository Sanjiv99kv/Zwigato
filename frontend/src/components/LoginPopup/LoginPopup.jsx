import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const LoginPopup = ({ setShowLogin }) => {

    const [currentState, setCurrentState] = useState("Sign up");
    const { setToken, backendUrl } = useContext(StoreContext)

    const [loginData, setLoginData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const onInputChangeHandler = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (currentState === "Sign up") {
            console.log(loginData);
            
            const { data } = await axios.post(backendUrl + "/api/user/register",loginData);
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('userToken',data.token)
                setShowLogin(false);
                toast.success("Registered Successfully")
            } else {
                toast.error(data.message)
            }
        } else {
            const { data } = await axios.post(backendUrl + "/api/user/login", loginData);
            if (data.success) {
                setToken(data.token);
                localStorage.setItem('userToken',data.token)
                setShowLogin(false);
                toast.success("Logged in Successfully")
            } else {
                toast.error(data.message)
            }
        }
    }

    return (
        <div className='login-popup'>
            <form className="login-popup-container" onSubmit={onSubmitHandler}>
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={() => { setShowLogin(false) }} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {
                        currentState === "Sign up" && <input type="text" onChange={onInputChangeHandler} name='name' value={loginData.name} placeholder="Your name" required />
                    }
                    <input onChange={onInputChangeHandler} name='email' value={loginData.email} type="email" placeholder='Your email' required />
                    <input onChange={onInputChangeHandler} name='password' value={loginData.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>
                    {currentState === "Sign up" ? "Create account" : "Login"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {
                    currentState === "Sign up"
                        ? <p>Already have an account? <span onClick={() => { setCurrentState("Login") }}>Login here</span></p>
                        : <p>Create a new account? <span onClick={() => { setCurrentState("Sign up") }}>Click here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
