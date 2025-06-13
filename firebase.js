// firebase.js (optional: separate file to keep clean)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAfASez0BnqEkEMxTLqJuE_bsmagV_IH_Y",
  authDomain: "helpdesk-smit.firebaseapp.com",
  projectId: "helpdesk-smit",
  storageBucket: "helpdesk-smit.appspot.com",
  messagingSenderId: "516701942489",
  appId: "1:516701942489:web:a8ae8e55eb4125571b84c8",
  measurementId: "G-JHSVEX88NW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
