import { useEffect, useState } from 'react';
import { useRoute, RouteProp, NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, FlatList} from 'react-native';
import { imovelBody } from '../../../shared/types/imovelBody';
import { getImoveis } from '../../../realm/services/imovelService';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';
import { ImovelContainer } from '../styles/Imovel.style';



export interface ImoveisParam {
  localidadeId: number;
}

export const detalharImovel = (navigate: NavigationProp<ParamListBase>['navigate'], imovel: imovelBody)=>{
  navigate('ImovelDetail', {imovel})
}




const Imoveis = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ImoveisParam>, 'Imovel'>>();
  const { localidadeId } = route.params;


const [imovel, setImovel] = useState<imovelBody[]>()

  useEffect(()=>{
      if(localidadeId){
        const imovelRealm = getImoveis(localidadeId);
        setImovel(imovelRealm);
      }
  }, [localidadeId])

  
  const  handleGoToImovelDetail =  (imovel: imovelBody) =>{
       detalharImovel(navigation.navigate, imovel );
    
  }


  //renderizar listagem de imóveis
  const renderItem = ({ item }: { item: imovelBody}) => {
    return (
      <TouchableOpacity onPress={() => handleGoToImovelDetail(item)}>
         <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
                Rua: {item.rua}
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               
                Número: {item.numero}
               
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Bairro: {item.bairro}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Referencial: {item.referencial}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Latitude: {item.latitude}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               longitude: {item.longitude}
              </Text>

              
        </View>
      </TouchableOpacity>
    );
  };
 



  return (
    <ImovelContainer>
            <View style={{ borderBottomWidth: 3, borderColor: theme.colors.blueTheme.blue1, marginBottom: 10 }}>
              <Text 
                  type={textTypes.TITLE_BOLD} 
                  color={theme.colors.blueTheme.blue1}
                  margin="0px 0px 0px 20px">
                      LISTA DE IMÓVEIS
                </Text>
          </View>

          <FlatList
              data={imovel}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
          />
                
          
   
   </ImovelContainer>
  );
}

export default Imoveis;