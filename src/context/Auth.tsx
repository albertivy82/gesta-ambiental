
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import qs from 'qs';
import { storeAuthData } from './authStore';

const authServer = axios.create({
  //baseURL: 'http://177.74.56.24'
  baseURL: 'http://192.168.100.28:8080'
});

export interface OAuthAuthorizationTokenResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: 'bearer' | string;
  expires_in: number;
  [key: string]: string | number;
}



export const useRequest = () => {
  const { reset } = useNavigation<NavigationProp<ParamListBase>>();
  
  const handleUrlRedirect = async (code: any, codeVerifier: string) => {
    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'gestambiental://oauthcallback',
      code_verifier: encodeURIComponent(codeVerifier),
      state: 'abdef',
    };

    const encodedData = qs.stringify(data);
    try {
      console.log(encodedData)
      const response = await authServer.post<OAuthAuthorizationTokenResponse>(
        '/oauth2/token',
        encodedData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: 'gestambiental',
            password: 'abcef',
          },
        }
      );

    await storeAuthData(response.data); 
    //await storeToken(response.data.access_token)
    console.log(response.data);
    reset({
      index: 0,
      routes: [{ name: 'Home' }]
    });

    } catch (error) {
      console.error('Error Handling url redirect:', error);
    }
  };

        
  return {
    handleUrlRedirect
  };
 };


    