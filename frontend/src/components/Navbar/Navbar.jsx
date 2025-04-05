import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import toast from 'react-hot-toast';

const Navbar = ({ setShowLogin }) => {

    const { token, setToken } = useContext(StoreContext);

    const [menu, setMenu] = useState("Home")
    const navigate = useNavigate();
    const { getTotalCartAmount } = useContext(StoreContext);

    const logoutHandler = () => {
        setToken("");
        localStorage.removeItem('userToken')
        navigate('/')
        toast.success("Successfully logged out")
    }

    return (
        <div className='navbar'>
            <img onClick={() => { navigate('/') }} className='logo' src={assets.logo} alt="" />
            <ul className='navbar-menu'>
                <Link to='/' onClick={() => { setMenu("Home") }} className={menu === "Home" ? 'active' : ''}>Home</Link>
                <a href='#explore-menu' onClick={() => { setMenu("Menu") }} className={menu === "Menu" ? 'active' : ''}>Menu</a>
                <a href='#app-download' onClick={() => { setMenu("Mobile-app") }} className={menu === "Mobile-app" ? 'active' : ''}>Mobile-app</a>
                <a href='#footer' onClick={() => { setMenu("Contact us") }} className={menu === "Contact us" ? 'active' : ''}>Contact us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="" />
                <div className='navbar-search-icon'>
                    <img onClick={() => { navigate("/cart") }} src={assets.basket_icon} alt="" />
                    <div className={getTotalCartAmount() ? "dot" : ""}></div>
                </div>
                {
                    !token
                        ? <button onClick={() => { setShowLogin(true) }}>Sign in</button>
                        : <div className='navbar-profile'>
                            <img src={assets.profile_icon} alt="" />
                            <ul className='navbar-profile-dropdown'>
                                <li onClick={()=>{navigate("/myorders")}}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                                <hr />
                                <li onClick={()=>{logoutHandler()}}><img src={assets.logout_icon} alt="" />Logout</li>
                                <hr />
                            </ul>
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar
