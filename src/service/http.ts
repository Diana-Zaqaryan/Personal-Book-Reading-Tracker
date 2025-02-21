import { deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";

import { collection } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, googleProvider } from "../../firebase.ts";
import { User } from "../type/type.ts";
import toast from "react-hot-toast";

export async function getBooks() {
  try {
    const booksRef = collection(db, "book");
    const snapshot = await getDocs(booksRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export async function getGenres() {
  try {
    const genresRef = collection(db, "genres");
    const snapshot = await getDocs(genresRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}
export async function getBookStatuses() {
  try {
    const statusRef = collection(db, "bookStatus");
    const snapshot = await getDocs(statusRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching book statuses:", error);
    return [];
  }
}
export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("User logged in:", userCredential.user);
    return true;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw new Error("Failed to log in with email and password.");
  }
}

export const logout = async () => {
  try {
    const authInstance = getAuth();
    await signOut(authInstance);
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Error logging out!");
  }
};
export async function signupWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("User signed up:", userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error("Sign-up Error:", error.message);
    throw new Error(error.message);
  }
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result.user);
    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error.message);
    throw new Error("Failed to sign in with Google.");
  }
}

export async function updateUserData(
  userId: string | undefined,
  updatedData: any,
) {
  const userRef = doc(db, "user", userId as string);
  try {
    await updateDoc(userRef, updatedData);
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

export async function updateUserBookList(user: { user: User }) {
  const userRef = doc(db, "user", user.user?.uid as string);
  try {
    await updateDoc(userRef, user);
    console.log("User data updated successfully");
  } catch (error) {
    console.error("Error updating user data:", error);
  }
}

export async function getCurrentUser() {
  // try {
  //   const user = auth.currentUser;
  //   if (user) {
  //     const userRef = collection(db, "user");
  //     const snapshot = await getDocs(userRef);
  //
  //     const res = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //
  //     console.log(res.filter((d) => d.id !== user.uid));
  //
  //     return res.filter((d) => d.id == user.uid)[0];
  //   }
  // } catch (error) {
  //   console.error("Error fetching user:", error);
  //   return [];
  // }
  return new Promise<any>((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "user", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            resolve(userDoc.data());
          } else {
            reject(new Error("No such user document!"));
          }
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("No user is signed in"));
      }
    });
  });
}

export async function deleteAccount(currentPassword: string) {
  const user = auth.currentUser;

  if (window.confirm("Are you sure you want to delete your account?")) {
    try {
      const credential = EmailAuthProvider.credential(
        user?.email as string,
        currentPassword,
      );
      const userRef = doc(db, "user", user?.uid as string);
      await deleteDoc(userRef);

      toast("Account deleted successfully!");

      // @ts-ignore
      await reauthenticateWithCredential(user, credential);
      // @ts-ignore
      await deleteUser(user);

      return true;
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast(`Failed to delete account: ${error.message}`, {});
    }
  }
}
