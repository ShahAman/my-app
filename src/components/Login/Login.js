import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";

firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email} = res.user;
      const signedInUser ={
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(signedInUser);
      setLoggedInUser(signedInUser);
      history.replace(from);
      console.log(displayName, email);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false
      }
      setUser(signedOutUser);
    }).catch((err) => {
      console.log(err);
      console.log(err.message);
    });
    
  }

  const handleBlur = (e) => {
    console.log(e.target.name , e.target.value);
    let isValidForm = true;
    if(e.target.name === 'email'){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      isValidForm = re.test(e.target.value);

      console.log(isValidForm);
    }
    if(e.target.name === 'password'){
      const isValidPassword = e.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(e.target.value);
      isValidForm = passwordHasNumber && isValidPassword;
      console.log(isValidForm);
    }

    if(isValidForm){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }

  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if(newUser && user.email && user.password){
    //  console.log(user.email, user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        // Signed in 
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        
       // var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
        // ..
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        setLoggedInUser(newUserInfo);
        history.replace(from);
  }
  )
  .catch((error) => {
    const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
    
  });

    }
  }

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? 
        <button onClick={handleSignOut}>Sign Out</button>
        :
        <button onClick={handleSignIn}>Sign In</button>
      }
      
      {
        user.isSignedIn &&
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div> 
         
      }
      <h1>Our Own Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}

      <input type="checkbox" onChange={() => setNewUser(!newUser)}
       name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <br/>
      <form onSubmit={handleSubmit}>
        { newUser &&  <input type="text" name="name" onBlur={handleBlur} placeholder="Name" required/>
      }
        <br/> 
        <input type="text" name="email" onBlur={handleBlur} placeholder="Email Address" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" id="" placeholder="Password" required/>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      {
        user.success ? <p style={{color:"green"}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p> 
        :
        <p style={{color:"red"}}>{user.error}</p>
      }
      
    </div>
  );
}

export default Login;
