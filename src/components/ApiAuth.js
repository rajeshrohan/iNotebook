
//import { useNavigate } from 'react-router-dom'

  //let navigate = useNavigate
  
 
  export const handleLogout = (navigate) =>{
    localStorage.removeItem('token')
    navigate("/");
  }