import { View, Button } from 'react-native';
import { removeAuthData} from '../../../context/authStore';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { HomeContainer } from '../styles/Home.style';
import { getToken, removeToken } from '../../../context/tokenStore';
import { useEffect, useState } from 'react';
import userReducer from '../../../store/reducers/userReducer';


const removetokens = async () => {
  
  await removeAuthData();
  await removeToken();
 
  
};

export const logout = (reset: NavigationProp<ParamListBase>['reset']) =>{
    removetokens();
    reset({
        index: 0,
         routes: [{ name: 'Login' }]
    })

}


export const dadosPessoais = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
  
 navigate('EditUser');

}

export const User= (navigate: NavigationProp<ParamListBase>['navigate']) =>{
 
  navigate('User');
  

}

export const gestaLocalidades = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
 
  navigate('Localidade');
  

}



const Home = () =>{
  const [disabled, setDisabled] = useState<boolean>(true)
 
  useEffect (()=>{
    if(getToken()!==null){
      setDisabled(false)
    }else{
      setDisabled(true)
    }

  },[]);


  const navigation = useNavigation<NavigationProp<ParamListBase>>();
    
  
  const handleOnPrix =() => {
      logout(navigation.reset);
    };
    
     
    const handleAlterarDados =() => {
      dadosPessoais(navigation.navigate);
    };
      
    const handlegestUser =() => {
      User(navigation.navigate);
    };

    const handleLocalidades =() => {
      gestaLocalidades(navigation.navigate);
    };
    
    
    return (
        <HomeContainer>
           <Button
              title="Sair"
              onPress={handleOnPrix}
            />
            <Button
              title="Alterar Senha"
              onPress={handleAlterarDados}
            />
            <Button
              disabled={disabled}
              title="Gerenciar Usuários"
              onPress={handlegestUser}
            />
            <Button
              title="Gerenciar Localidades"
              onPress={handleLocalidades}
            />
          
        </HomeContainer>
      );
}
export default Home;