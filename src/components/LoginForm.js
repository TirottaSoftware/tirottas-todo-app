import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { Link, useHistory } from "react-router-dom";
import "./login.css";

//auth.SignOut()
//auth.OnAuthStateChanged(() =>{})

const LoginForm = () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [username, setUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmSignupPassword, setConfirmPasswordValue] = useState("");

  const [loginError, setLoginMessage] = useState("");
  const [signupError, setSignupMessage] = useState("");
  const history = useHistory();

  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     console.log(user);
  //   } else {
  //     console.log("no current user");
  //   }
  // });

  const handleLoginChange = (e) => {
    if (e.target.name === "emailInput") {
      setLoginEmail(e.target.value);
    } else if (e.target.name === "passwordInput") {
      setLoginPassword(e.target.value);
    }
  };
  const handleSignupChange = (e) => {
    if (e.target.name === "emailInput") {
      setSignupEmail(e.target.value);
    } else if (e.target.name === "passwordInput") {
      setSignupPassword(e.target.value);
    }
    else if (e.target.name === "confirmPasswordInput") {
      setConfirmPasswordValue(e.target.value);
    }
    else if (e.target.name === "username") {
      setUsername(e.target.value);
    }
  };

  const signUpUser = (e) => {

    if (username === "") {
      return setSignupMessage("Please provide a username")
    }
    if (signupPassword != confirmSignupPassword) {
      return setSignupMessage("Passwords do not match")
    }

    auth
      .createUserWithEmailAndPassword(signupEmail, signupPassword)
      .then((cred) => {
        db
          .collection("users")
          .doc(cred.user.uid)
          .collection("todos")
          .add({ description: "Start adding todos...", completed: false })

        cred.user.updateProfile({ displayName: username, photoURL: "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255626-stock-illustration-avatar-male-profile-gray-person.jpg" });
      }
      )
      .then(() => {
        auth.signInWithEmailAndPassword(signupEmail, signupPassword);
        history.push("/home");
      })
      .catch((error) => {
        setSignupMessage(error.message);
      });
    setSignupEmail("");
    setUsername("");
    setSignupPassword("");
    setConfirmPasswordValue("");
  };

  const loginUser = (e) => {
    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return auth.signInWithEmailAndPassword(loginEmail, loginPassword).then(() => history.push("/home"))
          .catch((error) => {
            setLoginEmail("");
            setLoginPassword("");
            return setLoginMessage("Invalid Credentials. Please try again");
          });
      })
      .catch(function (error) {
        setLoginMessage(error)
      });

    // auth
    //   .signInWithEmailAndPassword(loginEmail, loginPassword)
    //   .then(() => history.push("/home"))
    //   .catch((error) => {
    //     return setLoginMessage("Invalid Credentials. Please try again");
    //   });
    // setLoginEmail("");
    // setLoginPassword("");
  };

  return (
    <>
      <h1 className="title">Tirotta's Todo App</h1>
      <div className="login-container">
        <div className="login-form">
          <h1>Log In</h1>
          <input
            name="emailInput"
            onChange={handleLoginChange}
            type="email"
            placeholder="E-mail"
            value={loginEmail}
          />
          <input
            name="passwordInput"
            onChange={handleLoginChange}
            type="password"
            placeholder="Password"
            value={loginPassword}
          />
          <button id="btn-login" onClick={loginUser}>
            Log in
        </button>
          <p id="error-message">{loginError && loginError}</p>
        </div>
        <div className="signup-form">
          <h1>Sign Up</h1>
          <input
            name="emailInput"
            onChange={handleSignupChange}
            type="email"
            placeholder="E-mail"
            value={signupEmail}
          />
          <input
            name="username"
            onChange={handleSignupChange}
            type="text"
            placeholder="Username"
            value={username}
          />
          <input
            name="passwordInput"
            onChange={handleSignupChange}
            type="password"
            placeholder="Password"
            value={signupPassword}
          />
          <input
            name="confirmPasswordInput"
            onChange={handleSignupChange}
            type="password"
            placeholder="Confirm Password"
            value={confirmSignupPassword}
          />
          <button id="btn-signup" onClick={signUpUser}>
            Sign up
        </button>
          <p id="error-message">{signupError && signupError}</p>
        </div>
      </div>
    </>
  );
};
export default LoginForm;
