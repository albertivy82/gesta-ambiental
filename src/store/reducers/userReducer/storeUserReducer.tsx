import { getAuthData } from "../../../context/authStore";
import { UserType } from "../../../shared/types/userType";
import { useUserReducer } from "./useUserReducer";
import { useEffect, useState } from 'react';

export const useStoreJWTUserReducer = () => {
  const { setUser } = useUserReducer();
  const [userData, setUserData] = useState<UserType | null>(null);
  
  useEffect(() => {
    const initializeUser = async () => {
      const data = await getAuthData();
    
      if (data) {
        setUserData(data);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);
};
