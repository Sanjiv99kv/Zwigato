import React, { useContext, useDebugValue, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId')
    const success = searchParams.get('success')
    const {backendUrl} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async()=>{
        const {data} = await axios.post(backendUrl+"/api/order/verify",{success,orderId});
        if(data.success){
            navigate("/myorders")
        }else{
            navigate("/");
        }
    }

    useEffect(()=>{
        verifyPayment();
    },[])

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
