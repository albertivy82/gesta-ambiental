import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataType } from '../shared/types/DataType'
import { storeToken } from './tokenStore';
import { storeRefreshToken } from './refreshTokenStore';


export const storeAuthData = async (data: DataType) => {
    try {
      await AsyncStorage.setItem('authData', JSON.stringify(data));
      await storeToken(data.access_token);
      await storeRefreshToken(data.refresh_token);
      } catch (error) {
      console.log('Error storing auth data:', error);
    }
  };

 
 
 export const getAuthData = async (): Promise<DataType | null> => {
    try {
      const data = await AsyncStorage.getItem('authData');
      
      if (data) {
        return JSON.parse(data);
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error getting auth data:', error);
      return null;
    }
  };
   

export const removeAuthData = async () => {
  try {
    await AsyncStorage.removeItem('authData');
  } catch (error) {
    console.log('Error removing auth data:', error);
  }
};






