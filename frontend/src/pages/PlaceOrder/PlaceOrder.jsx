import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PlaceOrder = () => {

  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, backendUrl,loadCartData } = useContext(StoreContext);
  const [paymentMode, setPaymentMode] = useState("");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 49,
      paymentMode: paymentMode
    }

    let response = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } })
    if (response.data.paymentMode) {
      navigate("/myorders");
      loadCartData();
    } else {
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error");
      }
    }

  }


  useEffect(() => {
    if (!token) {
      navigate("/cart")
      toast.error("You are not logged In")
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart")
      toast.error("Cart is empty")
    }
  }, [token])

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' value={data.firstName} onChange={onChangeHandler} type="text" placeholder='First Name' />
          <input required name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' value={data.email} onChange={onChangeHandler} type="text" placeholder='Email address' />
        <input required name='street' value={data.street} onChange={onChangeHandler} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' value={data.city} onChange={onChangeHandler} type="text" placeholder='City' />
          <input required name='state' value={data.state} onChange={onChangeHandler} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' value={data.zipcode} onChange={onChangeHandler} type="text" placeholder='Zipcode' />
          <input required name='country' value={data.country} onChange={onChangeHandler} type="text" placeholder='Country' />
        </div>
        <input required name='phone' value={data.phone} onChange={onChangeHandler} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fees</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 49}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 49}</b>
            </div>
          </div>
          <div className="payment-options">
            <div className='payment-option-box'>
              <input onChange={() => { setPaymentMode("Cash") }} required value="Cash" type="radio" name='payment-mode'></input> CASH ON DELIVERY
            </div>
            <div className='payment-option-box'>
              <input onChange={() => { setPaymentMode("online") }} required value="online" type="radio" name='payment-mode'></input> ONLINE(CREDIT/DEBIT)
            </div>
          </div>
          <button type='submit' onSubmit={()=>{scrollTo(0,0)}}>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
