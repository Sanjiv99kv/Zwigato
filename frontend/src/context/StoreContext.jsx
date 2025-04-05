import axios from "axios";
import { createContext, useContext, useDebugValue, useEffect, useState } from "react";
import { toast } from 'react-hot-toast'

export const StoreContext = createContext();

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({})
    const backendUrl = "http://localhost:4000";
    const [token, setToken] = useState(localStorage.getItem('userToken') ? localStorage.getItem('userToken') : "");
    const [food_list, setFood_list] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(backendUrl + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(backendUrl + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }


    const fetchFoodList = async () => {
        const { data } = await axios.get(backendUrl + "/api/food/list");
        if (data.success) {
            setFood_list(data.data);
        }
    }

    const loadCartData = async () => {
        if (token) {
            const { data } = await axios.get(backendUrl + "/api/cart/get", { headers: { token } });
            setCartItems(data.cartData)
        }
    }

    useEffect(() => {
        fetchFoodList();
        if (localStorage.getItem('userToken')) {
            loadCartData();
        }
    }, [])


    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((e) => e._id === item)
                totalAmount += itemInfo?.price * cartItems[item]
            }
        }
        return totalAmount;
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        backendUrl,
        loadCartData
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;