import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

export function useDbUser() {
  const { user, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn || !user) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/auth/me?clerkId=${user.id}`);
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
