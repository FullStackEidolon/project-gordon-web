import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = ({ Login, error, SignUp, handleClose }) => {
  const [details, setDetails] = useState({name: '', email: '', password: ''});
  const [newUser, setNewUser] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
    Login(details);
    handleClose();
  }
  return (
    <>
      {newUser === false ? (<>
        <form className="signinform" onSubmit={submitHandler}>
          <div className="form-inner">
            <h2>Login</h2>
            {(error !==  "") ? (<div className="error">{error}</div>) : ""}
            <div className="form-group">
              <label htmlFor="email">Email: </label><br></br>
              <input type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label><br></br>
              <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
            </div><br></br>
            <input type="submit" className="loginsubmit" value="Login" />
          </div>
        </form>
      <div>
      <br></br>
        <button onClick={e => setNewUser(true)} className="signinbutton" >Sign Up</button>
      </div></>) : (<>
        <form  className="signinform" onSubmit={submitHandler}>
          <div className="form-inner">
            <h2>Sign Up</h2>
            {(error !==  "") ? (<div className="error">{error}</div>) : ""}
            <div className="form-group">
              <label htmlFor="name">Name: </label><br></br>
              <input type="name" name="name" id="name" onChange={e => setDetails({...details, name: e.target.value})} value={details.name}/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email: </label><br></br>
              <input type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label><br></br>
              <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
            </div>
            <br></br>
            <input type="submit" className="signupsubmit" value="Sign Up" />
          </div>
        </form>
      </>)}
    </>
  )
}

export default LoginForm;