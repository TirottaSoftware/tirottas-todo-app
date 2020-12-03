import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBiobh1uVfG9YVqXWESNesKbNzQ_oCnTgg",
  authDomain: "auth-practice-c0698.firebaseapp.com",
  databaseURL: "https://auth-practice-c0698.firebaseio.com",
  projectId: "auth-practice-c0698",
  storageBucket: "auth-practice-c0698.appspot.com",
  messagingSenderId: "910917842471",
  appId: "1:910917842471:web:d8c5f0c37ee9a799b58002",
  measurementId: "G-HFGND6G616",
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
