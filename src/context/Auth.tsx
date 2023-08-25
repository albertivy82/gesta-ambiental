import qs from 'qs';
import axios from 'axios';
import { Linking } from 'react-native';
import pkceChallenge from 'react-native-pkce-challenge';
import { storeAuthData } from './authStore';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

const authServer = axios.create({
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

const generatePkceChallenge = () => {
  const challenge = pkceChallenge();
  return challenge;
};

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

  const handleAuthorization = async () => {
    const challenge = generatePkceChallenge();
    const codeChallenge = challenge.codeChallenge;
    const codeVerifier = challenge.codeVerifier;

    const config = qs.stringify({
      response_type: 'code',
      client_id: 'gestambiental',
      state: 'abdef',
      redirect_uri: 'gestambiental://oauthcallback',
      scope: 'READ WRITE',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authorizationUrl = `http://192.168.100.28:8080/oauth2/authorize?${config}`;

    try {
      const url = await new Promise<string>((resolve, reject) => {
        const handleUrlRedirect = (event: { url: string }) => {
          resolve(event.url);
        };

        Linking.addEventListener('url', handleUrlRedirect);

        Linking.openURL(authorizationUrl).catch((error) => {
          reject(error);
        });
      });

      const parsedUrl = qs.parse(url.replace(/^[^\?]+\??/, ''));
      const code = parsedUrl.code;

      await handleUrlRedirect(code, codeVerifier);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return {
    handleAuthorization, // Expose the function
  };

  
};
