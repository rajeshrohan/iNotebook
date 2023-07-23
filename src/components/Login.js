import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'  //useHistory is now useNavigate


const Login = (props) => {
  const [credentials, setCredentials] = useState({email:"", password:""})
  let navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({email: credentials.email, password: credentials.password})
  });
  const json = await response.json();
  console.log(json);
  if(json.success){
    // save the auth token and redirect 
    localStorage.setItem('token', json.authtoken);
    navigate("/")    
    props.showAlert("Logged in Successfully", "success") 
  }
  else{
    props.showAlert("Invalid Details", "danger")
  }

}

const onChange = (e) => {       //e-Events are objects with properties, target returns element
  setCredentials({ ...credentials, [e.target.name]: e.target.value })   //spread operator/ rest operator all prev are copied from notes
}


  return (
    <div className='mt-3'>
      <h2>Login to continue to iNotebook</h2>
      <form  onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className='form-label'>Email address</label>
          <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" autoComplete='on'/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className='form-label'>Password</label>
          <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name='password' placeholder="Password"  autoComplete='on'/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login