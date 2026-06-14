import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const UserSync = () => {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;

    const syncUser = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/sync`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
      } catch (error) {
        console.error(
          "User sync failed:",
          error?.response?.data?.message || error.message
        );
      }
    };

    syncUser();
  }, [getToken, isLoaded, isSignedIn, userId]);

  return null;
};

export default UserSync;
