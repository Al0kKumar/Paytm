import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export const Balance = () => {
    const [balance,setBalance] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3000/account/balance",{
            headers: {
                'Authorization':`Bearer ${localStorage.getItem("token")}`
            }
          }
        )
        .then(response => {
            setBalance(response.data.balance);
        })
        .catch(error => {
            console.error("Error fetching balance",error);
        })
    },[])

    return <div className="flex">
        <div className="font-bold text-lg">
            Balance 
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {balance}
        </div>
    </div>
}