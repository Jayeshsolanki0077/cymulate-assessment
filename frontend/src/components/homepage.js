import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = ( ) => {
    const [ emailaddress , setEmailAddress] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/api/email", {
        emailaddress
      });
      if(res.status === 200) {
        toast(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container">
      <ToastContainer />
      <h1> Email Template </h1>
      <input type="email" name="email" value={emailaddress} onChange={(e) => setEmailAddress(e.target.value)}/> <br/>
      <button onClick={handleSubmit}> Send Email </button>
    </div>
  );
};
export default HomePage;
