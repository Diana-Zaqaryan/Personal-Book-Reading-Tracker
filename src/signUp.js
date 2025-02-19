import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Регистрация
const handleSignUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
  }
};

// Вход
