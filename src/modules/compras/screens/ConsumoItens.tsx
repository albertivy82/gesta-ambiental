import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { buscaAlimentosDaBenfeitoria } from '../../../realm/services/alimentacaoService';
import { getCompras } from '../../../realm/services/comprasService';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AlimentacaoType } from '../../../shared/types/AlimentacaoType';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { UseConsumo } from '../../benfeitoriaDetails/hooks/UseConsumo';
import { ConsumoContainer } from '../styles/consumo.styles';
import RenderItem from '../ui-components/lista';




export interface BenfeitoriaParam {
 benfeitoria: number;
}


const ConsumoItens = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const {compras, benfeitoriaAlimentos} = UseConsumo(params.benfeitoria)
  const [alimentosRealm, setAlimentosReal] = useState<AlimentacaoType[]>();
  
 
  useEffect(() => {
    if(compras && benfeitoriaAlimentos){
      const comprasRealm = getCompras(params.benfeitoria);
      const alimentos = buscaAlimentosDaBenfeitoria(params.benfeitoria);
      setAlimentosReal(alimentos);
    }
  }, [params.benfeitoria, compras, benfeitoriaAlimentos]);



  return (
    
    <ConsumoContainer>
          <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
                Tipo de alimentação informado:
        </Text>
     
        <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                <FlatList
                    data={alimentosRealm}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                />
         </View>
         <Text>Local onde realiza as compras: </Text>
      
       </ConsumoContainer>
        
   
   
  );
}

export default ConsumoItens;