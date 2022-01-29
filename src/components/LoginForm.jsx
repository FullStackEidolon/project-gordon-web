import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = ({ Login, error }) => {
  const [details, setDetails] = useState({name: '', email: '', password: ''});
  const [newUser, setNewUser] = useState(false);

  const submitHandler = e => {
    e.preventDefault();
    Login(details);
  }
  return (
    <>
      {newUser === false ? (<><div>
        <form onSubmit={submitHandler}>
          <div className="form-inner">
            <h2>Login</h2>
            {(error !==  "") ? (<div className="error">{error}</div>) : ""}
            <div className="form-group">
              <label htmlFor="email">Email: </label>
              <input type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label>
              <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
            </div>
            <input type="submit" value="Login" />
          </div>
        </form>
      </div> <div>
        <button onClick={e => setNewUser(true)}>Sign Up</button>
      </div></>) : (<><div>
        <form onSubmit={submitHandler}>
          <div className="form-inner">
            <h2>Sign Up</h2>
            {(error !==  "") ? (<div className="error">{error}</div>) : ""}
            <div className="form-group">
              <label htmlFor="name">Name: </label>
              <input type="name" name="name" id="name" onChange={e => setDetails({...details, name: e.target.value})} value={details.name}/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email: </label>
              <input type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password: </label>
              <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
            </div>
            <input type="submit" value="Sign Up" />
          </div>
        </form>
      </div></>)}
    </>
  )
}

export default LoginForm;