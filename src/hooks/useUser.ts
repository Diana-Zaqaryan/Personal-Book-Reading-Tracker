import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../service/http.ts";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.ts";

export function useUser() {
  const [userTheme, setUserTheme] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getCurrentUser();
    },
    staleTime: 600000,
  });

  useEffect(() => {
    const fetchUserTheme = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "user", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserTheme(userDoc.data()?.theme);
        }
      }
    };

    fetchUserTheme();
  }, []);

  return { data, isLoading, error, refetch, userTheme };
}
