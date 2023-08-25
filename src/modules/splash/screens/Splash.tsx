import React, { useEffect} from 'react';
import { Text } from "react-native";
import { getToken } from "../../../context/tokenStore";
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { ContainerSplash, ImagelogoSplash } from '../styles/splash.style';

const Splash = () =>{
    const {reset} = useNavigation<NavigationProp<ParamListBase>>();

useEffect(()=>{
    const redirect = async ()=>{
      
      setTimeout(async () => {
            const token = await getToken();
            
            if(token){
              reset({
                  index: 0,
                  routes: [{ name: 'Home' }]
              })
            }else{
              reset({
                  index: 0,
                  routes: [{ name: 'Login' }]
            })
          }
        }, 5000);
}
    redirect();

}, []);




        
          return (
            <ContainerSplash>
              <ImagelogoSplash resizeMode="contain" source={require('../../../assets/images/logo_2.png')} />
            </ContainerSplash>
          );
        
}

export default Splash;