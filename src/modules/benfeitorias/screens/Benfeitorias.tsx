import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { getBenfeitorias } from '../../../realm/services/benfeitoriaService';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { BenfeitoriaContainer } from '../styles/benfeitoria.style';
import RenderItem from '../ui-components/listaBenfeitorias';

export interface benfeitoriasParam {
    imovelId: number; 
}


const Benfeitorias = ()=>{

  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, benfeitoriasParam>, 'Imovel'>>();
  const { imovelId } = route.params;
  

  const [benfeitoria, setBenfeitoria] = useState<BenfeitoriaType[]>()

  useEffect(()=>{
      if(imovelId){
        const benfeitoriaRealm = getBenfeitorias(imovelId);
        console.log(benfeitoria, 'effect?');
        setBenfeitoria(benfeitoriaRealm);
      }
  }, [imovelId])

  
 


    return(
       
            <BenfeitoriaContainer>
                  <View style={{ borderBottomWidth: 3, borderColor: theme.colors.blueTheme.blue1, marginBottom: 10 }}>
                    <Text 
                        type={textTypes.TITLE_BOLD} 
                        color={theme.colors.blueTheme.blue1}
                        margin="0px 0px 0px 20px">
                            LISTA DE BENFEITORIAS
                      </Text>
                </View>

                <FlatList
                    data={benfeitoria}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />

                      
                
           </BenfeitoriaContainer>
    )

}

export default Benfeitorias;