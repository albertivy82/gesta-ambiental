import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { useAves } from '../hooks/useAve';
import { useFauna } from '../hooks/usefauna';
import { useImovel } from '../hooks/useImovel';
import { useMamiferos } from '../hooks/useMamifero';
import { usePeixes } from '../hooks/usePeixe';
import { useVegetacoes } from '../hooks/useVegetacao';
import { EntrevistadoDetailContainer, Icones } from '../styles/EntrevistadoDetails.style';
import EditConfirmation from '../ui-component/UseEditEntrevistado';
import { useEffect } from 'react';


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
  entrevistado: EntrevistadoType
) => {
  navigate(route, { entrevistado });
};




export interface EntrevistadoParam {
 entrevistado: EntrevistadoType;
}

const EntrevistadoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, EntrevistadoParam>>>();
  const {imovelPresente} = useImovel(params.entrevistado.id);
  const {vegetacao} = useVegetacoes(params.entrevistado.id);
  const {fauna} = useFauna(params.entrevistado.id);
  const {peixes} = usePeixes(params.entrevistado.id);
  const {mamiferos} = useMamiferos(params.entrevistado.id);
  const {aves} = useAves(params.entrevistado.id);

 
   // Alerta caso não haja imóveis
   useEffect(() => {
    if (!imovelPresente) {
      Alert.alert(
        "O entrevistado não possui imóveis cadastrados.",
        "Siga até o final da página para inserir dados do imóvel"
      );
    }
  }, [imovelPresente]);

  useEffect(() => {
    if ([fauna, vegetacao, peixes, mamiferos, aves].some((arr) => arr.length === 0)) {
      Alert.alert(
        "Atenção!",
        "Tem itens sobre a biodiversidade que não foram coletados. Confira os itens no final da página."
      );
    }
  }, [fauna, vegetacao, peixes, mamiferos, aves]);

  /**
   * Método genérico para decisão de navegação
   */
  const handleDecision = <T,>(
    data: T | T[],
    detailRoute: string,
    newRoute: string
  ) => {
    if (Array.isArray(data) ? data.length > 0 : !!data) {
      handleNavigation(navigation.navigate, detailRoute, data);
    } else {
      handleNewEntry(navigation.navigate, newRoute, params.entrevistado);
    }
  };
  
  

  return (
    
       <ScrollView style={{ flex: 1 }}>
        <EntrevistadoDetailContainer>
              <View style={{ padding: 10, borderWidth: 1,  borderColor: theme.colors.grayTheme.gray100 }}>
            {renderField('Nome', params.entrevistado.nome)}
            {renderField('Naturalidade', params.entrevistado.naturalidade)}
            {renderField('Data de Nascimento', params.entrevistado.nascimentoData)}
            {renderField('Sexo', params.entrevistado.sexo)}
            {renderField('Apelido', params.entrevistado.apelido)}
            {renderField('Escolaridade', params.entrevistado.escolaridade)}
            {renderField('Estado Civil', params.entrevistado.estadoCivil)}
            {renderField('Religião', params.entrevistado.religiao)}
            {renderField('Morador do imóvel', params.entrevistado.morador)}
            {renderField('Data de Chegada', params.entrevistado.dataChegada)}
            {renderField('Pretende Mudar', params.entrevistado.pretendeMudar)}
            {renderField('Motivo de Querer Mudar-se', params.entrevistado.motivoVontadeMudanca)}
            {renderField('Relação com a Área do Imóvel', params.entrevistado.relacaoAreaImovel)}
            {renderField('Relação com os Vizinhos', params.entrevistado.relacaoVizinhos)}
            {renderField('Tipo de Alimentação', params.entrevistado.tipoAlimentacao)}
            {renderField('Locais de Compras', params.entrevistado.localCompras)}
            {renderField('Como Cuida da Saúde da Família', params.entrevistado.comoCuidaSaudeFamilia)} 
            {renderField('Quantos assaltos já sofreu:', params.entrevistado.sofreuAssaltos?.toString())}
            {renderField('Quantos assaltos já presenciou:', params.entrevistado.presenciouAssalto?.toString())}
            {renderField('Problemas de Violência no Local', params.entrevistado.problemasDeViolenciaLocal)}
            {renderField('Instituição Conhecida', params.entrevistado.instituicaoConhecida)} 
            {renderField('Importância de Proteger o Meio Ambiente', params.entrevistado.importanciaDeProtegerAmbiente)} 
            {renderField('Importância de Proteger a Fauna', params.entrevistado.importanciaDeProtegerFauna)} 
            {renderField('Qual Espaço Precisa ser Preservado', params.entrevistado.qualEspacoPrecisaSerPreservado)}
            {renderField('Problemas Relacionados ao Meio Ambiente', params.entrevistado.problemasRelacionadosAoAmbiente)}
            {renderField('Conhece UCs', params.entrevistado.conheceUcs)}
            {renderField('Conhece Proposta de UC', params.entrevistado.conheceUcProposta)}
            {renderField('Conhece Área da UC', params.entrevistado.conheceAreaUc)}
            {renderField('Utiliza Área da UC', params.entrevistado.utilizaAreaUc)}
            {renderField('Proposta de Melhoria da Área', params.entrevistado.propostaMelhorarArea)}
            {renderField('Indicado para Consulta Pública', params.entrevistado.indicadoConsultaPublica)}
            {renderField('Contato do Indicado', params.entrevistado.contatoIndicadoConsultaPublica)}

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
                      entrevistado={params.entrevistado} 
                      destino="NovoEntrevistado" 
                      onEditSuccess={() => {
                       //voltar para listagem de entrevistados
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.entrevistado.id} 
                      idLocal={params.entrevistado.idLocal}
                      deleteEndpoint="entrevistado" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
            </View>

            <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                 
          </View>
                
          <TouchableOpacity
                 onPress={() => handleDecision(imovelPresente, "ImovelDetails", "NovoImovel")}
                >
                  {imovelPresente ? (
                    <View style={{ alignItems: 'center' }}> 
                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                        Imóvel Cadastrado
                      </Text>
                      <View style={{ marginTop: 10 }}>  
                        {renderField('Documentação do Imóvel', imovelPresente.documentacaoImovel)}
                        {renderField('Sincronizado', imovelPresente.sincronizado ? 'Sim' : 'Não')}
                      </View>
                    </View>
                  ) : (
                    <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                      padding: 10,
                      borderWidth: 2, 
                      borderColor: theme.colors.grayTheme.gray100 
                    }}>
                      <Icon size={30} name='home3' color='red' />
                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.redTheme.red}> Adicionar Imovel</Text>
                  </View>
                  )}
        </TouchableOpacity>

         

        <TouchableOpacity  onPress={() => {handleDecision(imovelPresente, "ImovelDetails", "NovoImovel")}}>
                          
                     {vegetacao.length >0? (

                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                      Vegetações registradas: {vegetacao.length}
                      </Text>

                     ):(   
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='leaf' color='green' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Vegetação</Text>
                        </View>
                    )}  
        </TouchableOpacity>

                    
              
              <TouchableOpacity  onPress={() => {handleDecision(imovelPresente, "ImovelDetails", "NovoImovel")}}>
                          
                          {peixes.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Peixes registrados: {peixes.length}
                           </Text>
     
                          ):( 
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/peixes.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Peixes</Text>
                        </View>
                          )}
              </TouchableOpacity>

              <TouchableOpacity  onPress={() => {handleDecision(imovelPresente, "ImovelDetails", "NovoImovel")}}>
                          
                          {mamiferos.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Itens de mamíferosregistrados: {mamiferos.length}
                           </Text>
     
                          ):( 
                           <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                            padding: 10,
                                            borderWidth: 2, 
                                            borderColor: theme.colors.grayTheme.gray100 
                                          }}>
                              <Icones resizeMode="contain" source={require('../../../assets/images/macaco.png')} />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Mamíferos</Text>
                          </View>
                          )}
              </TouchableOpacity>

              <TouchableOpacity  onPress={() => {handleDecision(imovelPresente, "ImovelDetails", "NovoImovel")}}>
                          
                          {fauna.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                              Itens de fauna registrados: {fauna.length}
                           </Text>
     
                          ):( 
                           
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/fauna.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>fauna</Text>
                        </View>
                   
                          )}
              </TouchableOpacity>



              <TouchableOpacity  onPress={() => {handleDecision(aves, "AvesLista", "NovaAve")}}>
                          
                          {aves.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Itens de aves registrados: {aves.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100 
                            }}>
                              <Icones resizeMode="contain" source={require('../../../assets/images/aves.png')} />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>aves</Text>
                          </View>
                          )}
              </TouchableOpacity>

              
     
       </EntrevistadoDetailContainer>
    </ScrollView>     
   
   
  );
}

export default EntrevistadoDetails;