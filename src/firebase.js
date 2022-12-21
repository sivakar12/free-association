import React, { useState, useEffect } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB79ISi0aNIfkcypDAFK5Q7oI34dyAjFkY",
  authDomain: "free-association-5ffc4.firebaseapp.com",
  projectId: "free-association-5ffc4",
  storageBucket: "free-association-5ffc4.appspot.com",
  messagingSenderId: "312943250102",
  appId: "1:312943250102:web:1351ad19b99a10eb0e3417",
  measurementId: "G-XCH9DNCPSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth();

const db = getFirestore();
const AuthContext = React.createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);


  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider, db };
