import "./Login.css"

import handleLogin from "../services/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


// SIGN IN 

const Login = () =>
{

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const navigate=useNavigate();


    return (
        <div className="flex flex-col h-full w-full">
           {/* title */}
            <div className="flex flex-row justify-between h-20 bg-white
            border-b border-[#DDE2E4] text-2xl text-black p-9">
                <h1 className="text-4xl text-[#4F5580]">◈  TXNORA</h1>
                <h1 className=" text-[#4F8076]">● Secure access</h1>
            </div>

            {/* actual login  */}
            <div className="bg-[#F7F8F8] min-h-screen w-full">
                <div className="flex flex-col lg:flex-row">
                {/* left side */}
            <div className="bg-white flex flex-col min-h-[600px] w-full lg:w-2/5 justify-center items-center gap-3">

                {/* welcome sec */}
                <div className="p-7">
                <h1 className="text-3xl lg:text-4xl text-[#20242A]">Welocome Back</h1>
                <p className="text-lg text-[#68717A]">Sign in to your Txnora workspace.</p>
                </div>

                {/* form */}
                <h1 className="text-sm font-medium w-full max-w-[280px] text-[#20242A]">Work Email</h1>
                <input  
                onChange={(e)=>
                {
                    setEmail(e.target.value);
                }
                }
                className="border border-[#556A8A] bg-white rounded px-2 h-10 w-full max-w-[280px]" type="text" 
                placeholder="you@company.com"/>
                 <h1 className="text-sm font-medium w-full max-w-[280px] text-[#20242A]" 
                 >Password</h1>
                <input 
                onChange={(e)=>
                {
                    setPassword(e.target.value);
                }
                }
               className="border border-[#556A8A] rounded bg-white px-2 h-10 w-full max-w-[280px]" type="password" 
                placeholder="•••••••••••••"/>
                <button 
                onClick={async()=>
                {
                    //call login in handle function from authApi.js
                    const userLoggedIn= await handleLogin(email,password);
                    if(userLoggedIn==true)
                    {
                        navigate("/dashboard");
                    }
                }
                }
                className="border border-black bg-[#4F5580] m-4 text-white h-8 w-35 hover:bg-[#556A8A]">
                Sign in
                </button>
            </div>


            {/* right side */}
            <div className="hidden lg:block p-8 w-3/5">
            {/* heading */}
            <div className="flex flex-col items-center">
                <h1 className="text-4xl text-[#20242A]">Transaction lifecycle</h1>
                <p className="text-lg text-[#68717A]">Follow every transaction through its journey.</p>
                </div>

                {/* mid part */}
                <div className="flex flex-row justify-center items-start px-8 py-25">
                    <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4F5580] mb-2 txn-dot txn-dot1"></div>
                    <p>Initiated</p>
                    </div>

                    <div className="h-px flex-1 bg-[#556A8A] mt-1"></div>
                  
                    <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4F5580]  mb-2 txn-dot txn-dot2"></div>
                    <p>Processing</p>
                    </div>
                  
                  <div className="h-px flex-1 bg-[#556A8A] mt-1"></div>

                    <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-[#4F5580]  mb-2 txn-dot txn-dot3"></div>
                    <p>Authorised</p>
                    </div>

                  <div className="h-px flex-1 bg-[#556A8A] mt-1"></div>

                    <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4F5580]  mb-2 txn-dot txn-dot4"></div>
                    <p>Settlement <br/>Pending</p>
                    </div>

                    <div className="h-px flex-1 bg-[#556A8A] mt-1"></div>
                  
                   <div className="flex flex-col items-center">
                   <div className="w-3 h-3 rounded-full bg-[#4F5580]  mb-2 txn-dot txn-dot5"></div>
                    <p>Settled</p>
                    </div>
                  
                </div>

            </div>

            </div>
            {/* bottom */}
            <div className="flex flex-row px-9 border-t border-[#DDE2E4] justify-center ">
            <p className="text-[#68717A] text-2xl">Secure internal operations platform</p>
            </div>

            </div>   
        </div>
    )
}

export default Login