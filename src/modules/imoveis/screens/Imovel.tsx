import { Button, FlatList, TouchableOpacity, View } from 'react-native';
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
import { imovelBody } from '../../../shared/types/imovelBody';





export const inserirImovel = (navigate: NavigationProp<ParamListBase>['navigate']) =>{
    navigate('Localidade');
}

export const gerirImovel = (navigate: NavigationProp<ParamListBase>['navigate'], localidade:LocalidadeType) =>{
   navigate('Localidade_Detalhada', {localidade});
}



const Imovel = () =>{
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {isPresent} = useLocalidades();
 
  useEffect(() => {
    if (isPresent) {
      const localidadesFromDB = getLocalidades(); 
      setLocalidade(localidadesFromDB);
    }
  }, [isPresent]);
  
  const renderItem = ({ item }: { item: imovelBody }) => {
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
export default Imovel;