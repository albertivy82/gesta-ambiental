import React, { useEffect, useState } from 'react';
import { View, Button, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { ContainerLogin, ImagelogoLogin } from '../styles/login.style';
import { useRequest } from '../../../context/Auth';
import pkceChallenge from 'react-native-pkce-challenge';
import qs from 'qs';
import {WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { Icon } from '../../../shared/components/icon/Icon';
import { theme } from '../../../shared/themes/theme';

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
        <ImageBackground
          source={require('../../../assets/images/1.png')} // Substitua pelo caminho da sua imagem
          style={styles.imageBackground}
        >
          <TouchableOpacity style={styles.button} onPress={() => setWebViewVisible(true)}>
            <Icon name='enter' size={200} color='yellow'/>
            <Text style={styles.buttonText}>Iniciar Autenticação</Text>
          </TouchableOpacity>
        </ImageBackground>
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
  imageBackground: {
    width: '95%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
  backgroundColor: theme.colors.blueTheme.blue2, // Cor de fundo azul
  padding: 15,
  borderRadius: 10,
  marginTop: 270, 
  },
  buttonText: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default Login;
