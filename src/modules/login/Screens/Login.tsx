import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRequest } from '../../../context/Auth';
import pkceChallenge from 'react-native-pkce-challenge';
import qs from 'qs';
import {WebView, WebViewNavigation } from 'react-native-webview';
import { Icon } from '../../../shared/components/icon/Icon';
import { theme } from '../../../shared/themes/theme';
import { ContainerSplash, ImagelogoSplash } from '../../splash/styles/splash.style';

const generatePkceChallenge = () => {
  const challenge = pkceChallenge();
  return challenge;
};

const Login = () => {
  const { handleUrlRedirect } = useRequest();
  const [webViewVisible, setWebViewVisible] = useState(false);

  // Defina authorizationUrl fora da função handleAuthorization
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


  const extrairCodigoDaURL = (url:string) => {
    const partesDaURL = url.split('?');
    if (partesDaURL.length < 2) {
      return null; // URL não contém parâmetros
    }
  
    const parametros = partesDaURL[1].split('&');
    for (const parametro of parametros) {
      const [nome, valor] = parametro.split('=');
      if (nome === 'code') {
        return valor; // Encontrou o parâmetro 'code'
      }
    }
  
    return null; // 'code' não encontrado na URL
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    console.log('URL da WebView:', navState.url);
    if (navState.url.includes('gestambiental://oauthcallback')) {
      const code = extrairCodigoDaURL(navState.url); // Função para extrair o código da URL
      console.log(code);
      if (code) {
        // Certifique-se de que o código foi extraído com sucesso
        handleUrlRedirect(code, codeVerifier);
      }
      setWebViewVisible(false);
    }
  };
  
console.log(webViewVisible);
  return (
    <>
      {webViewVisible ? (
        <WebView
          javaScriptEnabled={true}
          source={{ uri: authorizationUrl }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      ) : (
        <View style={styles.container}>
         <ContainerSplash>
              <ImagelogoSplash resizeMode="contain" source={require('../../../assets/images/logo_2.png')} />
           
          <TouchableOpacity style={styles.button} onPress={() => setWebViewVisible(true)}>
            <Icon name='enter' size={70} color={theme.colors.blueTheme.blue1}/>
            <Text style={styles.buttonText}>Fazer Login</Text>
          </TouchableOpacity>
          </ContainerSplash>
      </View>
      )}
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  button: {
  padding: 2,
  marginTop: 10, 
  alignItems:'center',
  end:'auto'
  },
  buttonText: {
    color: theme.colors.blueTheme.blue1,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Login;
