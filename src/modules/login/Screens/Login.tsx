import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { ContainerLogin, ImagelogoLogin } from '../styles/login.style';
import { useRequest } from '../../../context/Auth';
import { useStoreJWTUserReducer } from '../../../store/reducers/userReducer/storeUserReducer';






const Login = () => {
  const { handleAuthorization } = useRequest();
   useStoreJWTUserReducer()
  
 const handleOnPress = async () => {
    await handleAuthorization();

  };

  
      
  return (
    <View>
        <ContainerLogin>
        <ImagelogoLogin resizeMode="contain" source={require('../../../assets/images/1.png')} />
        <Button
          title=">>>>Fazer Login>>>>"
          onPress={handleOnPress}
        />
      </ContainerLogin>
    </View>
  );
};

export default Login;
