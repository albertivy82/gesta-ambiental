import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import { theme } from '../../../shared/themes/theme';
import { PescaArtesanalType } from '../../../shared/types/PescaArtesanal';
import { PescaArtesanalDetailContainer } from '../styles/pescaArtesanal.style';
import EditConfirmation from '../ui-components/UseEditPescaArtesanal';
import { useDestinosPesca } from '../hooks/useDestinoPesca';
import { useQuantidadesPescaPorTipo } from '../hooks/useQuantidadePescaPorTipo';
import { useEspecies } from '../hooks/useEspecie';
import { useEmbarcacoes } from '../hooks/useEmbarcacao';
import { textTypes } from '../../../shared/components/text/textTypes';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';




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
  pescaArtesanal: PescaArtesanalType
) => {
  navigate(route, { pescaArtesanal });
};

export interface PescaArtesanalParam {
 pescaArtesanal: PescaArtesanalType;
}



const PescaArtesanalDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params} = useRoute<RouteProp<Record<string, PescaArtesanalParam>>>();
  const {destinoPesca} = useDestinosPesca(params.pescaArtesanal.id);
  const {quantidadePescaPorTipo} = useQuantidadesPescaPorTipo(params.pescaArtesanal.id);
  const {embarcacao} = useEmbarcacoes(params.pescaArtesanal.id);
  const {especie} = useEspecies(params.pescaArtesanal.id);
    

   const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, data);
      } else {
        handleNewEntry(navigation.navigate, newRoute, params.pescaArtesanal);
      }
    };
  
   
  return (
    
       <ScrollView style={{ flex: 1 }}>
        <PescaArtesanalDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Perfil', params.pescaArtesanal.freqPescaSemanal?.toString())}  
                {renderField('Data de nascimento', params.pescaArtesanal.horasPorDia?.toString())}
                {renderField('Local onde ocorre a pesca: ', params.pescaArtesanal.localDaPesca)}
                {renderField('Horário que ocorrea', params.pescaArtesanal.horarioPrefencialPesca)}
                {renderField('Descarte de peixe por pesca', params.pescaArtesanal.descartePorPescaria?.toString())}
                {renderField('Forma de custeio da pesca', params.pescaArtesanal.custeio?.toString())}
                {renderField('Quantidade de gelo usado na pesca', params.pescaArtesanal.geloPorPescaria?.toString())}
                {renderField('Como o peixe é conservado', params.pescaArtesanal.conservacaoPeixe)}
                {renderField('Qual é o custo do gelo', params.pescaArtesanal.custoGeloPorPescaria?.toString())}
                {renderField('Composição do rancho', params.pescaArtesanal.composicaoRancho)}
                {renderField('Quanto é o custo do rancho por pesca', params.pescaArtesanal.custoRanchoPorViagem?.toString())}
                {renderField('Quantidade de combustível por viagem', params.pescaArtesanal.combustivelPorViagem?.toString())}
                {renderField('Custo de combustível por viagem', params.pescaArtesanal.custoCombustivelPorViagem?.toString())}
                {renderField('Quantidade de pesca por safra', params.pescaArtesanal.pescaPorSafra?.toString())}
                {renderField('Local de pesca na safra', params.pescaArtesanal.localPescaSafra)}
                {renderField('Onde é o locald e reprodução do peixe', params.pescaArtesanal.localDeReproducaoPeixe)}
                {renderField('Período do defeso: ', params.pescaArtesanal.periodoDefeso)}
                {renderField('Conhece o defeso', params.pescaArtesanal.conheceDefeso)}
                {renderField('Concorda com o defeso', params.pescaArtesanal.concordaDefeso)}
                {renderField('Recebe defeso', params.pescaArtesanal.recebeDefeso)}
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
                      pescaArtesanal={params.pescaArtesanal} 
                      destino="NovaPescaArtesanal" 
                      onEditSuccess={() => {
                       
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.pescaArtesanal.id} 
                      idLocal={params.pescaArtesanal.idLocal}
                      deleteEndpoint="pesca-artesanal" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
                
             </View>

                <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                 
                 </View>
                       
                <TouchableOpacity onPress={() => handleDecision(destinoPesca, "DestinoPescaLista", "NovoDestinoPesca")}>
                      <View style={{
                        alignItems: 'stretch',
                        flexDirection: 'row',
                        padding: 10,
                        borderWidth: 2,
                        borderColor: theme.colors.grayTheme.gray100
                      }}>
                        <Icon size={30} name='leaf' color='green' />
                        <Text
                          type={textTypes.BUTTON_BOLD}
                          color={destinoPesca.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                          style={{ marginLeft: 10 }}
                        >
                          {destinoPesca.length > 0
                            ? `Registro de destinos de pesca: ${destinoPesca.length}`
                            : 'Destino da Pesca'}
                        </Text>
                      </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDecision(quantidadePescaPorTipo, "QuantidadePescaPorTipoLista", "QuantidadePescaPorTipoPesca")}>
                      <View style={{
                        alignItems: 'stretch',
                        flexDirection: 'row',
                        padding: 10,
                        borderWidth: 2,
                        borderColor: theme.colors.grayTheme.gray100
                      }}>
                        <Icon size={30} name='leaf' color='green' />
                        <Text
                          type={textTypes.BUTTON_BOLD}
                          color={quantidadePescaPorTipo.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                          style={{ marginLeft: 10 }}
                        >
                          {quantidadePescaPorTipo.length > 0
                            ? `Vegetações registradas: ${quantidadePescaPorTipo.length}`
                            : 'Vegetação'}
                        </Text>
                      </View>
                </TouchableOpacity>
                                
               
              
      
       </PescaArtesanalDetailContainer>
    </ScrollView>     
   
   
  );
}

export default PescaArtesanalDetails;