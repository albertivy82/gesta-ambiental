import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { theme } from '../../../shared/themes/theme';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { useImovel } from '../hooks/useImovel';
import { EntrevistadoDetailContainer, Icones } from '../styles/EntrevistadoDetails.style';
import EditConfirmation from '../ui-component/UseEditEntrevistado';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { imovelBody } from '../../../shared/types/imovelType';
import { Icon } from '../../../shared/components/icon/Icon';


export const hendleImovel = (navigate: NavigationProp<ParamListBase>['navigate'], imovel: imovelBody)=>{
     navigate('ImovelDetail', {imovel})
}

export const hendleNOvoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType)=>{
      navigate('NovoImovel', {entrevistado})
}


export interface EntrevistadoParam {
 entrevistado: EntrevistadoType;
}

const EntrevistadoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, EntrevistadoParam>>>();
  const {imovelPresente} = useImovel(params.entrevistado.id);
 
    
  
  

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
              {renderField('Serviços Públicos Deficitários', params.entrevistado.servicosDeficitarios)}
              {renderField('Já Sofreu Assaltos', params.entrevistado.sofreuAssaltos?.toString())}
              {renderField('Já Presenciou Assaltos', params.entrevistado.presenciouAssalto?.toString())}
              {renderField('Problemas de Violência no Local', params.entrevistado.problemasDeViolenciaLocal)}
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
                      
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.entrevistado.id} 
                      idLocal={params.entrevistado.idLocal}
                      deleteEndpoint="entrevistado" 
                      onDeleteSuccess={() => {
                            
                      }} 
                      />
            </View>

            <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                 
           

                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.grayTheme.gray80,
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    if (imovelPresente) {
                      hendleImovel(navigation.navigate, imovelPresente);
                    }else{
                      hendleNOvoImovel(navigation.navigate, params.entrevistado);
                    }
                  }}
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
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.redTheme.red}>
                        Sem imóvel cadastrado
                      </Text>
                    </View>
                  )}
               </TouchableOpacity>

               <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='leaf' color='green' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Vegetação</Text>
                        </View>
                    </TouchableOpacity>

                    
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/peixes.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Peixes</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/macaco.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Mamíferos</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/fauna.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>fauna</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/aves.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>aves</Text>
                        </View>
                    </TouchableOpacity>



          
              
      
       </EntrevistadoDetailContainer>
    </ScrollView>     
   
   
  );
}

export default EntrevistadoDetails;