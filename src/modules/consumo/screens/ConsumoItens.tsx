import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { buscaAlimentosDaBenfeitoria } from '../../../realm/services/alimentacaoService';
import { getCompras } from '../../../realm/services/comprasService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AlimentacaoType } from '../../../shared/types/AlimentacaoType';
import { ComprasType } from '../../../shared/types/ComprasType';
import { UseConsumo } from '../../benfeitoriaDetails/hooks/UseConsumo';
import { AlterarRegistroButton, ConsumoContainer } from '../styles/consumo.styles';
import RenderItem from '../ui-components/lista';
import { ConfirmacaoModal } from '../ui-components/modal';





export interface BenfeitoriaParam {
 benfeitoria: number;
}


const ConsumoItens = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const {compras, benfeitoriaAlimentos} = UseConsumo(params.benfeitoria)
  const [alimentosRealm, setAlimentosReal] = useState<AlimentacaoType[]>();
  const [comprasRealm, setComprasRealm] = useState<ComprasType|null>();
  const [modalVisible, setModalVisible] = useState(false);
 
  useEffect(() => {
    if(compras && benfeitoriaAlimentos){
      const comprasDB = getCompras(params.benfeitoria);
      setComprasRealm(comprasDB)
      const alimentos = buscaAlimentosDaBenfeitoria(params.benfeitoria);
      setAlimentosReal(alimentos);
    }
  }, [compras, benfeitoriaAlimentos]);

  const comprasProcessadas = comprasRealm ? {
      ...comprasRealm,
      ondeFazCompras: comprasRealm.ondeFazCompras === "Na_Própria_Localidade"
        ? "Na própria localidade"
        : comprasRealm.ondeFazCompras === "Em_Outra_Localidade"
        ? "Em outra localidade"
        : comprasRealm.ondeFazCompras 
      }
  : null;
  
  const handleConfirm = () => {
    alimentosRealm

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
       
        <AlterarRegistroButton 
            onPress={() => setModalVisible(true)}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginTop: 80,
        }}>
            <Icon size={30} name='pencil' color='white' />
            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
              Alterar Registro
            </Text>
      </AlterarRegistroButton>
      
    
    </ConsumoContainer>
        
   
   
  );
}

export default ConsumoItens;