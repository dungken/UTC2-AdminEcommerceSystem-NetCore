import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDSEXmGGPZ88nwFh-0lXkayDv8y04Eebps",
   authDomain: "webdemo2112.firebaseapp.com",
   projectId: "webdemo2112",
   storageBucket: "webdemo2112.appspot.com",
   messagingSenderId: "947854451360",
   appId: "1:947854451360:web:633b4a77ecf0b07a7a5fc5",
   measurementId: "G-0G0MF4JS6D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };