import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getImoveis } from '../../../realm/services/imovelService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { ImovelContainer } from '../styles/Imovel.style';
import RenderItemImovel from '../ui-components/listaImoveis';


export interface ImoveisParam {
  localidadeId: number;
}


export const novoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  console.log('novoImovel', localidadeId)
 
  navigate('NovoImovel', {localidadeId})
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

 
  


  const  handleNovoImovel =  () =>{
    novoImovel(navigation.navigate, localidadeId );
  }




  return (
    <ImovelContainer>
            <View style={{  alignItems: 'center', 
            flexDirection: 'row',
           borderBottomWidth: 3, 
                          borderColor: theme.colors.blueTheme.blue1, 
                          marginBottom: 10 
                          }}>
           <Icon size={30} name='stack' color='#00008B'/>
          <Text 
          type={textTypes.TITLE_BOLD} 
          color={theme.colors.blueTheme.blue1}
          margin="0px 0px 0px 20px">
            LISTA DE IMÓVEIS
            </Text>
          
          </View>
          
          
          <TouchableOpacity onPress={() => handleNovoImovel()}>
                <View style={{  alignItems: 'center', 
                  flexDirection: 'row',
                borderBottomWidth: 3, 
                borderColor: theme.colors.mainTheme.black, 
                  marginBottom: 10, 
                  backgroundColor: 'orange',
                                }}>
                        <Icon size={15} name='plus' color='#030303'/>
                        <Text 
                        type={textTypes.BUTTON_REGULAR} 
                        color={theme.colors.mainTheme.black}
                        margin="0px 0px 0px 20px">
                        Adicionar Imóvel
                          </Text>
                </View>
          </TouchableOpacity>
          
          <FlatList
              data={imovel}
              extraData={imovel} 
              renderItem={({ item }) => <RenderItemImovel item={item} />}
              keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'fallbackId'}




             
          />
                
          
   
   </ImovelContainer>
  );
}

export default Imoveis;