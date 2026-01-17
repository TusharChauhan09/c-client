import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

export function useDbUser() {
  const { user, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn || !user) return;

      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await axios.get(
          `${API_URL}/api/auth/me?clerkId=${user.id}`
        );
        if (response.data.success) {
          setDbUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching DB user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isSignedIn, user]);

  return { dbUser, loading };
}
