import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA90H2321hzKPRH1-GbRjdPuKUB_MDOT78",
  authDomain: "construction-5cf93.firebaseapp.com",
  projectId: "construction-5cf93",
  storageBucket: "construction-5cf93.firebasestorage.app",
  messagingSenderId: "763659190295",
  appId: "1:763659190295:web:5b69bbc235f899df19dc52",
  measurementId: "G-V6PR6ZMPNX"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, RecaptchaVerifier };