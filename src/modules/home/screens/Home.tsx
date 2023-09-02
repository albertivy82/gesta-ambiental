import { Button, FlatList, TouchableOpacity } from 'react-native';
import { removeAuthData} from '../../../context/authStore';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { HomeContainer } from '../styles/Home.style';
import { removeToken } from '../../../context/tokenStore';
import { useLocalidadeRducer } from '../../../store/reducers/localidadeReducer/useLocalidadeReducer';
import { useEffect } from 'react';
import { connectionAPIGet } from '../../../shared/functions/connection/connectionAPI';
import Text from '../../../shared/components/text/Text';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';


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

export const gestaLocalidades = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
 
  navigate('Localidade');
  

}

export const detalhaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidade:LocalidadeType) =>{
 
  navigate('Localidade_Detalhada', {localidade});
  

}



const Home = () =>{
  const {localidade, setLocalidade} = useLocalidadeRducer();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  
 

  useEffect(() => {
    const fetchLocalidade = async () => {
      try {
        const localidadeData = await connectionAPIGet('http://192.168.100.28:8080/localidade');
        if (typeof localidadeData === 'object' && localidadeData !== null) {
          setLocalidade(localidadeData as LocalidadeType[]); // Faz o casting explícito para LocalidadeType
        } else {
          console.error('Dados de localidade inválidos:', localidadeData);
        }
      } catch (error) {
        console.error('Erro ao obter dados de localidade:', error);
      }
    };
    fetchLocalidade();
  }, []);
  
      
  
      const handleOnPrix =() => {
          logout(navigation.reset);
      };
      const handleLocalidades =() => {
          gestaLocalidades(navigation.navigate);
      };
      
      const handleGoTolocalidade =  (localidade: LocalidadeType) =>{
          detalhaLocalidade(navigation.navigate, localidade);
      }
    
    return (
        

        <HomeContainer>
          {/*
         <FlatList
          data={localidade}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          />
         */}
        {localidade.map((localidade)=>(
          <TouchableOpacity onPress={
            ()=> handleGoTolocalidade(localidade)
          }><Text 
              type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue}>
                {localidade.nome}
            </Text></TouchableOpacity>
        ))}

           <Button
              title="Sair"
              onPress={handleOnPrix}
            />
           
           <Button
              title="Gerenciar Localidades"
              onPress={handleLocalidades}
            />
          
        </HomeContainer>
      );
}
export default Home;