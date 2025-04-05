import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const { data } = await axios.get(url + "/api/order/list");
    if (data.success) {
      setOrders(data.data);
    }
  }

  const statusHandler = async (e, orderId) => {
    const { data } = await axios.post(url + "/api/order/status", { status: e.target.value, orderId });
    if (data.success) {
      toast.success(data.message)
      fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + "x " + item.quantity
                    } else {
                      return item.name + "x " + item.quantity + ", "
                    }
                  })}
                </p>
                <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                <div className='order-item-address'>
                  <p>{order.address.street + ", "}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select onChange={(e) => { statusHandler(e, order._id) }} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
