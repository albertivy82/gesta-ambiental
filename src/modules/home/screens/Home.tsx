import { Button, FlatList, TouchableOpacity, View } from 'react-native';
import { removeAuthData} from '../../../context/authStore';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { HomeContainer } from '../styles/Home.style';
import { removeToken } from '../../../context/tokenStore';
import { useLocalidadeRducer } from '../../../store/reducers/localidadeReducer/useLocalidadeReducer';
import { useEffect } from 'react';
import { connectionAPIGet } from '../../../shared/functions/connection/connectionAPI';
import Text from '../../../shared/components/text/Text';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { getUser } from '../../../context/userStore';



const removetokens = async () => {
  
  await removeAuthData();
  await removeToken();
 
  
};

export const gestaLocalidades = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
 
  navigate('Localidade');
  

}

export const detalhaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidade:LocalidadeType) =>{
 
  navigate('Localidade_Detalhada', {localidade});
  

}



const Home = () =>{
  const {localidade, setLocalidade} = useLocalidadeRducer();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const currentUser = getUser();

  const renderItem = ({ item }: { item: LocalidadeType }) => {
    return (
      <TouchableOpacity onPress={() => handleGoTolocalidade(item)}>
         <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
                Nome: {item.nome}
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               
                Município: {item.municipio}
               
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Iniciativa: {item.esfera}
              </Text>
        </View>
      </TouchableOpacity>
    );
  };
 

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
  
 
  
       const handleLocalidades =() => {
          gestaLocalidades(navigation.navigate);
      };
      
      const handleGoTolocalidade =  (localidade: LocalidadeType) =>{
          detalhaLocalidade(navigation.navigate, localidade);
      }
    
    return (
        

        <HomeContainer>
           <View style={{ borderBottomWidth: 3, borderColor: theme.colors.blueTheme.blue1, marginBottom: 10 }}>
          <Text 
          type={textTypes.TITLE_BOLD} 
          color={theme.colors.blueTheme.blue1}
          margin="0px 0px 0px 20px">
            LISTA DE LOCALIDADES
            </Text>
          </View>
         <FlatList
          data={localidade}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          />
               
         <Button
              title="Inserir Nova Localidade"
              onPress={handleLocalidades}
            />
          
        </HomeContainer>
      );
}
export default Home;