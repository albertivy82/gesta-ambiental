import { View, Button } from 'react-native';
import { removeAuthData} from '../../../context/authStore';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { HomeContainer } from '../styles/Home.style';
import { removeToken } from '../../../context/tokenStore';


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

export const gestaUser = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
 
  navigate('GestaUser');
  

}

export const gestaLocalidades = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
 
  navigate('Localidade');
  

}


const Home = () =>{
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
    
  
  const handleOnPrix =() => {
      logout(navigation.reset);
    };
    
     
    const handleAlterarDados =() => {
      dadosPessoais(navigation.navigate);
    };
      
    const handlegestUser =() => {
      gestaUser(navigation.navigate);
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
              title="Gerenciar Usuários"
              onPress={handlegestUser}
            />
            <Button
              title="Gerenciar Usuários"
              onPress={handleLocalidades}
            />
          
        </HomeContainer>
      );
}
export default Home;