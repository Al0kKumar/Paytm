import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const  Login =  () => {

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const Handlelogin = async () => {
    
    console.log("Login button clicked");

    try {

      const response = await axios.post("http://localhost:3000/user/login",{
        username,
        password
      });
  
      const token = response.data.token;
  
      localStorage.setItem("token",token);
      
      navigate("/dashboard");
    } catch (error) {

      console.error("Login failed:", error.response?.data?.msg || error.message);
      // You can show an error message to the user here, like a toast or a modal
      alert("Login failed. Please check your credentials.");
      
    }
  }    

return (
   <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Log in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="alok_12" label={"Username"} />
        <InputBox onChange={(e) => setPassword(e.target.value)}  placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={Handlelogin} label={"Log in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
)

}