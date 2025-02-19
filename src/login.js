import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

// Вход
const handleLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
  }
};
