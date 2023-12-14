import { Button, FlatList, TouchableOpacity, View } from 'react-native';
import { removeAuthData} from '../../../context/authStore';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { HomeContainer } from '../styles/Home.style';
import { removeToken } from '../../../context/tokenStore';
import Text from '../../../shared/components/text/Text';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { useLocalidades } from '../hook/useLocalidades';
import { useEffect } from 'react';
import { useLocalidadeRducer } from '../../../store/reducers/localidadeReducer/useLocalidadeReducer';
import { getLocalidades } from '../../../realm/services/localidadeServices';
import { Icon } from '../../../shared/components/icon/Icon';




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
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {localidade, setLocalidade} = useLocalidadeRducer();
  const { isPresent, fetchLocalidadeFromAPI, fetchLocalidadeFromDB} = useLocalidades();
 
  useEffect(() => {
    if (isPresent) {
      const localidadesFromDB = getLocalidades(); 
      setLocalidade(localidadesFromDB);
    }
  }, [isPresent]);
  
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
 

  
  
 
  
       const handleLocalidades =() => {
          gestaLocalidades(navigation.navigate);
      };
      
      const handleGoTolocalidade =  (localidade: LocalidadeType) =>{
          detalhaLocalidade(navigation.navigate, localidade);
      }
    
    return (
        

        <HomeContainer>
           <View style={{  alignItems: 'center', 
            flexDirection: 'row',
           borderBottomWidth: 3, 
                          borderColor: theme.colors.blueTheme.blue1, 
                          marginBottom: 10 
                          }}>
           <Icon size={30} name='map2' color='#00008B'/>
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
        
          <TouchableOpacity onPress={handleLocalidades}>
              <View style={{ 
              alignItems: 'center',  
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              padding: 10, 
              borderWidth: 1, 
              borderColor: theme.colors.blueTheme.blue2}}>
                    <Icon size={40} name='point-right' color='blue' />
                    <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>
                      Inserir Nova Localidade
                    </Text>
               </View>
          </TouchableOpacity>
                       
        </HomeContainer>
      );
}
export default Home;