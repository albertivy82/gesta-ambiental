import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { useAguas } from '../hooks/useAgua';
import { useAtividadesProdutivas } from '../hooks/useAtividadeProdutiva';
import { useCreditos } from '../hooks/useCredito';
import { useMoradores } from '../hooks/useMorador';
import { useRendasOutrasFontes } from '../hooks/useRendaOutrasfontes';
import { useServicosComunicacao } from '../hooks/useSevicoComunicacao';
import { BenfeitoriaDetailContainer, Icones } from '../styles/BenfeitoriaDetails.style';
import EditConfirmation from '../ui-components/UseEditBenfeitoria';


export const handleNavigation = <T,>(
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  benfeitoria: BenfeitoriaType
) => {
  navigate(route, { benfeitoria });
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



const BenfeitoriaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const benfeitoria = params.benfeitoria;
  const {moradores} = useMoradores(benfeitoria.id);
  const {aguas} = useAguas(benfeitoria.id);
  const {atividades} = useAtividadesProdutivas(params.benfeitoria.id);
  const {creditos} = useCreditos(params.benfeitoria.id);
  const {rendasOF} = useRendasOutrasFontes(params.benfeitoria.id);
  const {servicos} = useServicosComunicacao(params.benfeitoria.id);
  

   const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, benfeitoria);
      } else {
         handleNewEntry(navigation.navigate, newRoute, benfeitoria);
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
                
       <TouchableOpacity onPress={() => handleDecision(moradores, "Morador", "NovoMorador")}>
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
                      ? `Listagem de cadastrados`
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
                    ? `Dados Registradas`
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
                    ? `Listagem de  Atividades Produtivas`
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
                ? `Listagem de Créditos`
                : 'Crédito'}
            </Text>
          </View>
       </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDecision(rendasOF, "RendaOutrasFontesLista", "NovaRendaOutrasFontes")}>
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
                  ? `Listagem de Outras Rendas`
                  : 'Outras Fontes de Renda'}
              </Text>
            </View>
       </TouchableOpacity>

       <TouchableOpacity onPress={() => handleDecision(servicos, "ServicosComunicacaoLista", "NovoServicoComunicacao")}>
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
                    ? `Listagem de Serviços de Comunicação`
                    : 'Serviços de Comunicação disponíveis'}
                </Text>
              </View>
        </TouchableOpacity>
      
</BenfeitoriaDetailContainer>
</ScrollView>     
   
   
  );
}

export default BenfeitoriaDetails;