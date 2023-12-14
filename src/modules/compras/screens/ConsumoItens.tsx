import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { buscaAlimentosDaBenfeitoria } from '../../../realm/services/alimentacaoService';
import { getCompras } from '../../../realm/services/comprasService';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AlimentacaoType } from '../../../shared/types/AlimentacaoType';
import { UseConsumo } from '../../benfeitoriaDetails/hooks/UseConsumo';
import { ConsumoContainer } from '../styles/consumo.styles';
import RenderItem from '../ui-components/lista';
import { ComprasType } from '../../../shared/types/ComprasType';
import { Icon } from '../../../shared/components/icon/Icon';
import { ConfirmacaoModal } from '../ui-components/modal';





export interface BenfeitoriaParam {
 benfeitoria: number;
}


const ConsumoItens = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const {compras, benfeitoriaAlimentos} = UseConsumo(params.benfeitoria)
  const [alimentosRealm, setAlimentosReal] = useState<AlimentacaoType[]>();
  const [comprasRealm, setComprasRealm] = useState<ComprasType[]>();
  const [modalVisible, setModalVisible] = useState(false);
 
  useEffect(() => {
    if(compras && benfeitoriaAlimentos){
      const comprasDB = getCompras(params.benfeitoria);
      setComprasRealm(comprasDB)
      const alimentos = buscaAlimentosDaBenfeitoria(params.benfeitoria);
      setAlimentosReal(alimentos);
    }
  }, [compras, benfeitoriaAlimentos]);

  const comprasProcessadas = comprasRealm && comprasRealm.length > 0
    ? {
      ...comprasRealm[0],
      ondeFazCompras: comprasRealm[0].ondeFazCompras === "Na_Própria_Localidade"
        ? "Na própria localidade"
        : comprasRealm[0].ondeFazCompras === "Em_Outra_Localidade"
        ? "Em outra localidade"
        : comprasRealm[0].ondeFazCompras 
      }
  : null;
  
  const handleConfirm = () => {
    // Lógica para alterar registros
    setModalVisible(false);
  };

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
         <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
                Local onde realiza as compras: 
        </Text>
       
        {comprasProcessadas && (
        <Text type={textTypes.TITLE_REGULAR} color={theme.colors.blueTheme.blue1}>
          {comprasProcessadas.ondeFazCompras}
        </Text>
      )}

       {comprasProcessadas?.detalheLocalDeCompras && (
        <Text type={textTypes.TITLE_REGULAR} color={theme.colors.blueTheme.blue1}>
         Isto é: {comprasProcessadas.detalheLocalDeCompras}
        </Text>
       )}

        <ConfirmacaoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onConfirm={handleConfirm}
         />
       
        <TouchableOpacity onPress={()=>setModalVisible(true)}>
              <View style={{ 
              alignItems: 'center',  
              flexDirection: 'row', 
              
              padding: 10, 
              borderWidth: 1, 
              borderColor: theme.colors.blueTheme.blue2}}>
                    <Icon size={30} name='tab' color='red' />
                    <Text type={textTypes.BUTTON_BOLD} color={theme.colors.redTheme.red}>
                          Alterar Registro
                    </Text>
               </View>
          </TouchableOpacity>
      
       </ConsumoContainer>
        
   
   
  );
}

export default ConsumoItens;