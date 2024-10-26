import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { getToken } from "../../../context/tokenStore";
import { ContainerSplash, ImagelogoSplash } from '../styles/splash.style';
import useScreenDimensions from '../hooks/useScreenDimensions';

const Splash = () =>{
    const {reset} = useNavigation<NavigationProp<ParamListBase>>();
    const { width, height } = useScreenDimensions();

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
            <ContainerSplash width={width} height={height}>
      <ImagelogoSplash
        resizeMode="contain"
        source={require('../../../assets/images/logo_2.png')}
        width={width * 0.6}
        height={height * 0.3}
      />
    </ContainerSplash>
          );
        
}

export default Splash;