import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { getBenfeitoriaAlimentos } from '../../../realm/services/alimentacaoService';
import { getCompras } from '../../../realm/services/comprasService';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AlimentacaoType } from '../../../shared/types/AlimentacaoType';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { ConsumoContainer } from '../styles/consumo.styles';
import RenderItem from '../ui-components/lista';
import { UseConsumo } from '../../benfeitoriaDetails/hooks/UseConsumo';




export interface BenfeitoriaParam {
 benfeitoria: BenfeitoriaType;
}


const ConsumoItens = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const {compras, benfeitoriaAlimentos} = UseConsumo(params.benfeitoria.id)
  const [alimentosRealm, setAlimentosReal] = useState<AlimentacaoType[]>();
  
  
 if(compras && benfeitoriaAlimentos){
   const comprasRealm = getCompras(params.benfeitoria.id);
   const alimentos = getBenfeitoriaAlimentos(params.benfeitoria.id);
   setAlimentosReal(alimentos);
 }




  return (
    
    <ConsumoContainer>
          <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
                Tipo de alimnetação informado:
        </Text>
     
                
       <Text>Local onde realiza as compras: </Text>
               <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                <FlatList
                    data={alimentosRealm}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
                </View>
      
       </ConsumoContainer>
        
   
   
  );
}

export default ConsumoItens;