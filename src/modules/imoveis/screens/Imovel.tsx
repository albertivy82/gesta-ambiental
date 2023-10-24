import { useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { TouchableOpacity, View, FlatList} from 'react-native';
import { imovelBody } from '../../../shared/types/imovelBody';
import { getImoveis } from '../../../realm/services/imovelService';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';
import { ImovelContainer } from '../styles/Imovel.style';

export const handleGoToImovel = () => {
  
};

export interface ImoveisParam {
  localidadeId: number;
}




const Imoveis = () => {
  const route = useRoute<RouteProp<Record<string, ImoveisParam>, 'Imovel'>>();
  const { localidadeId } = route.params;


const [imovel, setImovel] = useState<imovelBody[]>()

  useEffect(()=>{
      if(localidadeId){
        const imovelRealm = getImoveis(localidadeId);
        setImovel(imovelRealm);
      }
  }, [localidadeId])


  //renderizar listagem de imóveis
  const renderItem = ({ item }: { item: imovelBody}) => {
    return (
      <TouchableOpacity onPress={() => handleGoToImovel()}>
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

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Situação Fundiária: {item.situacaoFundiaria}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Documentação do Imóvel: {item.documentacaoImovel}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Data de chegada no local: {item.dataChegada}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Pretende se mudar do local: {item.pretendeMudar }
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Motivo para querer mudar-se: {item.motivoVontadeMudanca }
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Sobre a relação que possui com a localidade: {item.relacaoArea }
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Sobre a relação com a vizinhança: {item.relacaoVizinhos }
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Material principal dos limites do Imóvel: {item.limites }
              </Text>

              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Principal meio de transporte utilizado: {item.transporte }
              </Text>

              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Existem linhas de barco no Local: {item.linhasDeBarco }
              </Text>

              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Tratamento do solo no imóvel: {item.tipoSolo }
              </Text>
              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={theme.colors.blueTheme.blue1}
              >
               Estrutura de esporte e lazer na área: {item.esporteLazer }
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