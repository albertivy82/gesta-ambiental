import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { BenfeitoriaDetailContainer, Icones } from '../styles/BenfeitoriaDetails.style';
import { renderField } from '../ui-components/renderField';
import { useMoradores } from '../hooks/useMorador';
import { useAtividadesProdutivas } from '../hooks/useAtividadeProdutiva';
import { useServicosComunicacao } from '../hooks/useSevicoComunicacao';
import { useAguas } from '../hooks/useAgua';
import { useCreditos } from '../hooks/useCredito';
import { useRendasOutrasFontes } from '../hooks/useRendaOutrasfontes';
import { usePescaArtesanal } from '../hooks/usePescaArtesanal';


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



const BenfeitoriaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const {moradores} = useMoradores(params.benfeitoria.id);
  const {atividades} = useAtividadesProdutivas(params.benfeitoria.id);
  const {servicos} = useServicosComunicacao(params.benfeitoria.id);
  const {aguas} = useAguas(params.benfeitoria.id);
  const {creditos} = useCreditos(params.benfeitoria.id);
  const {rendasOF} = useRendasOutrasFontes(params.benfeitoria.id);
  const {pescaArtesanal} = usePescaArtesanal(params.benfeitoria.id);


  

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
                {renderField('Nivel de alagamentos', params.benfeitoria.alagamentos)}
                {renderField('Efluentes', params.benfeitoria.efluentes)}
                {renderField('Resíduos', params.benfeitoria.residuos)}
                {renderField('Fonte de Energia', params.benfeitoria.fonteEnergia)}
                {renderField('Fonte de Enrgia para preparar alimentos', params.benfeitoria.energiaAlimentos)}
                {renderField('Informativo predominante', params.benfeitoria.informativoPredominante)}
              
            </View>


            <TouchableOpacity  onPress={() => {handleDecision(moradores, "moradoresDetails", "NovoMorador")}}>
                          
                          {moradores.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Moradores Cadstrados: {moradores.length}
                           </Text>
     
                          ):( 
                              <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                padding: 10,
                                borderWidth: 2, 
                                borderColor: theme.colors.grayTheme.gray100
                              }}>
                              <Icones resizeMode="contain" source={require('../../../assets/images/moradores.png')} />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Moradores</Text>
                              </View>
                          )}
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => {handleDecision(atividades, "AtividadesDetails", "NovaAtividade")}}>
                          
                          {atividades.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Atividades Produtivas registradas: {atividades.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100
                            }}>
                              <Icones resizeMode="contain" source={require('../../../assets/images/producao.png')} />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Ativiades Produtivas</Text>
                          </View>
                          )}
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => {handleDecision(servicos, "servicosDetails", "NovoServico")}}>
                          
                          {servicos.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Serviços de comunicação registrados: {servicos.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100 
                            }}>
                              <Icon size={30} name='mobile' color='blue' />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Serviços de Comunicação disponiveis</Text>
                          </View>
                          )}
            </TouchableOpacity>


            <TouchableOpacity  onPress={() => {handleDecision(aguas, "aguasDetails", "NovaAgua")}}>
                          
                          {aguas.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           ÁGUAS?: {aguas.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100
                            }}>
                <Icones resizeMode="contain" source={require('../../../assets/images/agua.png')} />
                <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Água</Text>
            </View>
                          )}
            </TouchableOpacity>

         
            <TouchableOpacity  onPress={() => {handleDecision(rendasOF, "ImovelDetails", "NovoImovel")}}>
                          
                          {rendasOF.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Outras rendas informadas: {rendasOF.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100
                            }}>
                              <Icones resizeMode="contain" source={require('../../../assets/images/renda.png')} />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Outras Fontes de Renda</Text>
                          </View>
                         )}
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => {handleDecision(creditos, "CreditoDetails", "NovoCredito")}}>
                          
                          {creditos.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Creditos: {creditos.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100
                            }}>
                          <Icones resizeMode="contain" source={require('../../../assets/images/credito.png')} />
                          <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Crédito</Text>
                      </View>
                           
                          )}
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => {handleDecision(pescaArtesanal, "ImovelDetails", "NovoImovel")}}>
                          
                          {pescaArtesanal.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Pesca Artesanal: {pescaArtesanal.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100
                            }}>
                <Icones resizeMode="contain" source={require('../../../assets/images/pesca.png')} />
                <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Pesca Artesanal</Text>
            </View>
                          )}
            </TouchableOpacity>


                   
                   

                   

                   
                    

              <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      
                      borderWidth: 2, 
                      borderColor: theme.colors.grayTheme.gray100 
                    }}>

                    <TouchableOpacity onPress={() =>null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='bin' color='red' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Imóvel</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: theme.colors.grayTheme.gray100 }} />


                    <TouchableOpacity onPress={() => null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='pencil2' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Imóvel</Text>
                        </View>
                    </TouchableOpacity>
               </View>
               
              
      
       </BenfeitoriaDetailContainer>
    </ScrollView>     
   
   
  );
}

export default BenfeitoriaDetails;