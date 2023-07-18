import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  Timestamp
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export enum CollectionNames {
  STOCK = "stock",
  PRODUCT_CATEGORIES = "product_categories",
  ORDERS = "orders",
}

export interface CustomTimestamp extends Timestamp {
  seconds: number,
  nanoseconds: number
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  // measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// function getSKU({ myFirstInput, mySecondInput }) {
//   var firstValue = String(myFirstInput).substring(0, 2);
//   var secondValue = String(mySecondInput).substring(0,2);
//   var num1 = document.getElementById('num1').value.substring(0,2);
//   var num2 = document.getElementById('num2').value.substring(0,2);
//   var sku = firstValue+secondValue+num1+num2;
//   var sku1 = sku.toUpperCase();
// 	document.getElementById('output').value = sku1;
//  	var cpyclipboard = document.getElementById("output");
//   cpyclipboard.select();
//   document.execCommand("copy");
//   document.getElementById('copymsg').innerHTML = "Copied!"
// }

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logout = () => {
  signOut(auth);
};
