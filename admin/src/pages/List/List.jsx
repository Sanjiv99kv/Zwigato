import React from 'react'
import './List.css'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import toast from 'react-hot-toast';

const List = ({url}) => {

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const { data } = await axios.get(url+"/api/food/list");
    if (data.success) {
      setList(data.data);
    }
  }

  const removeFood = async (foodId) => {
    const { data } = await axios.post(url+"/api/food/remove", { foodId });
    if (data.success) {
      toast.success("Item removed")
      fetchList();
    } else {
      toast.error("Error occured while removing Item")
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p onClick={() => { removeFood(item._id) }} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
