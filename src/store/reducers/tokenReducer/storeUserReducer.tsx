import { getToken } from "../../../context/tokenStore";
import { useTokenReducer } from "./useTokenReducer";
import { useEffect, useState } from 'react';


////ESTE ARQUIVO  FOI FEITO PARA SALVAR O REDUZER QUANDO HOUVESSE UM TOKEN...
export const useStoreJWTUserReducer = () => {
  const { setToken } = useTokenReducer();
  const [userData, setUserData] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeUser = async () => {
      const token = await getToken();
    
      if (token) {
        setUserData(token);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    if (userData) {
      setToken(userData);
    }
  }, [userData, setToken]);
};
