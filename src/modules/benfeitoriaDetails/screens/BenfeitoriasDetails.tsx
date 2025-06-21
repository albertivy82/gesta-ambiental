import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { BenfeitoriaDetailContainer, Icones } from '../styles/BenfeitoriaDetails.style';
import { useMoradores } from '../hooks/useMorador';
import { useAtividadesProdutivas } from '../hooks/useAtividadeProdutiva';
import { useServicosComunicacao } from '../hooks/useSevicoComunicacao';
import { useAguas } from '../hooks/useAgua';
import { useCreditos } from '../hooks/useCredito';
import { useRendasOutrasFontes } from '../hooks/useRendaOutrasfontes';
import { usePescaArtesanal } from '../hooks/usePescaArtesanal';
import { renderField } from '../../../shared/components/input/renderFilds';
import EditConfirmation from '../ui-components/UseEditBenfeitoria';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';


export const handleNavigation = <T,>(
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  data: T | T[]
) => {
  navigate(route, { data });
};

export const handleNewEntry = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  benfeitoria: BenfeitoriaType
) => {
  navigate(route, { benfeitoria });
};

export interface BenfeitoriaParam {
 benfeitoria: BenfeitoriaType;
}

  const temporario = () => {
       
          Alert.alert(
            "Atenção!",
            "Esta categoria ainda não está disponível para edição."
          );
       
      };

const BenfeitoriaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const benfeitoria = params.benfeitoria;
  const {moradores} = useMoradores(benfeitoria.id);
  const {aguas} = useAguas(benfeitoria.id);
  const {atividades} = useAtividadesProdutivas(params.benfeitoria.id);
  const {creditos} = useCreditos(params.benfeitoria.id);
  const {pescaArtesanal} = usePescaArtesanal(params.benfeitoria.id);
  const {rendasOF} = useRendasOutrasFontes(params.benfeitoria.id);
  const {servicos} = useServicosComunicacao(params.benfeitoria.id);

  console.log(params.benfeitoria)

   const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, data);
      } else {
        handleNewEntry(navigation.navigate, newRoute, params.benfeitoria);
      }
    };
  
  return (
    
<ScrollView style={{ flex: 1 }}>
<BenfeitoriaDetailContainer>
<View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Tipo', params.benfeitoria.tipoBenfeitoria)}
                {renderField('Função', params.benfeitoria.funcao)}
                {renderField('Tipo do Solo', params.benfeitoria.impermeabilizacaoSolo)}
                {renderField('Área aproximada', params.benfeitoria.areaBenfeitoria.toString()+' km²')}
                {renderField('Pavimentos', params.benfeitoria.pavimentos.toString())}
                {renderField('Tipo de construção', params.benfeitoria.paredes)}
                {renderField('Origem dos materiais de construção', params.benfeitoria.origemAreiaDaConstrucao)}
                {renderField('Cobertura', params.benfeitoria.tipoCobertura)}
                {renderField('Esquadrias', params.benfeitoria.tipoEsquadrias)}
                {renderField('Alagamentos', params.benfeitoria.alagamentos)}
                {renderField('Época de alagamentos', params.benfeitoria.epocaOcorrencia)}
                {renderField('Efluentes', params.benfeitoria.efluentes)}
                {renderField('Resíduos', params.benfeitoria.residuos)}
                {renderField('Fonte de Energia', params.benfeitoria.fonteEnergia)}
                {renderField('Fonte de Enrgia para preparar alimentos', params.benfeitoria.energiaAlimentos)}
                {renderField('Informativo predominante', params.benfeitoria.informativoPredominante)}
              
</View>


<View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: "#808080", 
                      backgroundColor: '#000000'
                    }}>                     
                     <EditConfirmation 
                      benfeitoria={params.benfeitoria} 
                      destino="NovaBenfeitoria" 
                      onEditSuccess={() => {
                       
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.benfeitoria.id} 
                      idLocal={params.benfeitoria.idLocal}
                      deleteEndpoint="benfeitoria" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
                
                </View>

                <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                 
                 </View>
                
       <TouchableOpacity onPress={() => handleDecision(moradores, "MoradorDetails", "NovoMorador")}>
                <View style={{
                  alignItems: 'stretch',
                  flexDirection: 'row',
                  padding: 10,
                  borderWidth: 2,
                  borderColor: theme.colors.grayTheme.gray100
                }}>
                  <Icones resizeMode="contain" source={require('../../../assets/images/moradores.png')} />
                  <Text
                    type={textTypes.BUTTON_BOLD}
                    color={moradores.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                    style={{ marginLeft: 10 }}
                  >
                    {moradores.length > 0
                      ? `Moradores cadastrados: ${moradores.length}`
                      : 'Moradores'}
                  </Text>
                </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => handleDecision(aguas, "AguaLista", "NovaAgua")}>
              <View style={{
                alignItems: 'stretch',
                flexDirection: 'row',
                padding: 10,
                borderWidth: 2,
                borderColor: theme.colors.grayTheme.gray100
              }}>
                <Icones resizeMode="contain" source={require('../../../assets/images/agua.png')} />
                <Text
                  type={textTypes.BUTTON_BOLD}
                  color={aguas.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                  style={{ marginLeft: 10 }}
                >
                  {aguas.length > 0
                    ? `Fontes de água registradas: ${aguas.length}`
                    : 'Água'}
                </Text>
              </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => handleDecision(atividades, "Atividades", "NovaAtividade")}>
              <View style={{
                alignItems: 'stretch',
                flexDirection: 'row',
                padding: 10,
                borderWidth: 2,
                borderColor: theme.colors.grayTheme.gray100
              }}>
                <Icones resizeMode="contain" source={require('../../../assets/images/producao.png')} />
                <Text
                  type={textTypes.BUTTON_BOLD}
                  color={atividades.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                  style={{ marginLeft: 10 }}
                >
                  {atividades.length > 0
                    ? `Atividades Produtivas registradas: ${atividades.length}`
                    : 'Atividades Produtivas'}
                </Text>
              </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => handleDecision(creditos, "CreditoLista", "NovoCredito")}>
          <View style={{
            alignItems: 'stretch',
            flexDirection: 'row',
            padding: 10,
            borderWidth: 2,
            borderColor: theme.colors.grayTheme.gray100
          }}>
            <Icones resizeMode="contain" source={require('../../../assets/images/credito.png')} />
            <Text
              type={textTypes.BUTTON_BOLD}
              color={creditos.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
              style={{ marginLeft: 10 }}
            >
              {creditos.length > 0
                ? `Créditos: ${creditos.length}`
                : 'Crédito'}
            </Text>
          </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => temporario()}>
          <View style={{
            alignItems: 'stretch',
            flexDirection: 'row',
            padding: 10,
            borderWidth: 2,
            borderColor: theme.colors.grayTheme.gray100
          }}>
            <Icones resizeMode="contain" source={require('../../../assets/images/pesca.png')} />
            <Text
              type={textTypes.BUTTON_BOLD}
              color={pescaArtesanal.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
              style={{ marginLeft: 10 }}
            >
              {pescaArtesanal.length > 0
                ? `Pesca Artesanal: ${pescaArtesanal.length}`
                : 'Pesca Artesanal'}
            </Text>
          </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => temporario()}>
            <View style={{
              alignItems: 'stretch',
              flexDirection: 'row',
              padding: 10,
              borderWidth: 2,
              borderColor: theme.colors.grayTheme.gray100
            }}>
              <Icones resizeMode="contain" source={require('../../../assets/images/renda.png')} />
              <Text
                type={textTypes.BUTTON_BOLD}
                color={rendasOF.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                style={{ marginLeft: 10 }}
              >
                {rendasOF.length > 0
                  ? `Outras rendas informadas: ${rendasOF.length}`
                  : 'Outras Fontes de Renda'}
              </Text>
            </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => temporario()}>
              <View style={{
                alignItems: 'stretch',
                flexDirection: 'row',
                padding: 10,
                borderWidth: 2,
                borderColor: theme.colors.grayTheme.gray100
              }}>
                <Icon size={30} name='mobile' color='blue' />
                <Text
                  type={textTypes.BUTTON_BOLD}
                  color={servicos.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                  style={{ marginLeft: 10 }}
                >
                  {servicos.length > 0
                    ? `Serviços de comunicação registrados: ${servicos.length}`
                    : 'Serviços de Comunicação disponíveis'}
                </Text>
              </View>
        </TouchableOpacity>
      
</BenfeitoriaDetailContainer>
</ScrollView>     
   
   
  );
}

export default BenfeitoriaDetails;