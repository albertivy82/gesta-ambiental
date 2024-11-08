import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { useBenfeitorias } from '../hooks/useBenfeitorias';
import { ImovelDetailContainer } from '../styles/ImovelDetails.style';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import EditConfirmation from '../ui-component/UseEditImovel';




export interface ImovelParam {
 imovel: imovelBody;
}

//BLOCO BENFEITORIA
export const benfeitoriasDoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], imovelId: number)=>{
  navigate('Benfeitorias', {imovelId})
}

export const novaBenfeitoria = (navigate: NavigationProp<ParamListBase>['navigate'], 
                                imovelId: number, 
                                idLocal:string|undefined,
                                sincronizado:boolean)=>{
                                  console.log("passando o param", idLocal)
  navigate('NovaBenfeitoria', {imovelId, idLocal, sincronizado})
}


const ImovelDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, ImovelParam>>>();
  const {contagemBenfeitoria} = useBenfeitorias(params.imovel.id);
  
 const  handleGerenciaBenfeitorias =  (imovelId: number, 
    idLocal:string|undefined, 
    sincronizado: boolean, 
    contagemBenfeitorias: number) =>{
          if(contagemBenfeitorias>0){
                      benfeitoriasDoImovel(navigation.navigate, imovelId);
          }else{
                    console.log("idLocal, 25/10/2024, 17:12", idLocal, imovelId)
                      novaBenfeitoria(navigation.navigate, imovelId, idLocal, sincronizado);
        }
      }
  
  const renderField = (label: string, value: string | null| undefined) => {
     return (
          <View style={{
             marginBottom: 10, 
             borderColor: theme.colors.grayTheme.gray100, 
             padding: 10,
             borderWidth: 1 } }>
             <Text type={textTypes.SUB_TITLE_SEMI_BOLD} color={theme.colors.blueTheme.blue1}>
              {label}:
             </Text>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.mainTheme.black}>
              {value? value : 'Informação não cadastrada'}
            </Text>
          </View>
        );
      };
  
    



  return (
    
       <ScrollView style={{ flex: 1 }}>
        <ImovelDetailContainer>
              <View style={{ padding: 10, borderWidth: 1,  borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Número', params.imovel.numero)}
                {renderField('Rua', params.imovel.rua)}
                {renderField('Refencial', params.imovel.referencial)}
                {renderField('Bairro', params.imovel.bairro)}
                {renderField('Latitude', params.imovel.latitude)}
                {renderField('Longitude', params.imovel.longitude)}

                {renderField('Material utilizado no entorno do imóvel', params.imovel.limites)}
                {renderField('Tipo do solo verificado no imóvel', params.imovel.tipoSolo)}
                
              
                {renderField('Situação Fundiária', params.imovel.situacaoFundiaria)}
                {renderField('Documentação', params.imovel.documentacaoImovel)}
                {renderField('Data de chegada na localidade', params.imovel.dataChegada)}
                {renderField('Intenção de mudar-se do imóvel', params.imovel.pretendeMudar)}
                {renderField('Motivo de querer mudar-se', params.imovel.motivoVontadeMudanca)}
           
                {renderField('Relação com a área', params.imovel.relacaoArea)}
                {renderField('Relação com os vizinhos', params.imovel.relacaoVizinhos)}
                {renderField('Linhas de barcos no local', params.imovel.linhasDeBarco)}
                {renderField('Principal meio utilizado como meio de transporte', params.imovel.transporte)}
                {renderField('Estruturas de esporte e lazer próximos ao imóvel', params.imovel.esporteLazer)}
            </View>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                           borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='man' color='brown' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.grayTheme.gray100}> Entrevistado</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          
                                          borderWidth: 2, 
                                           borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='droplet' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.grayTheme.gray100}> Saneamento</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          
                                          borderWidth: 2, 
                                           borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='office' color='gray' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.grayTheme.gray100}> Serviços Básicos</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          
                                          borderWidth: 2, 
                                           borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='cogs' color='green' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.grayTheme.gray100}>Outros Serviços</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleGerenciaBenfeitorias(
                                                                                  params.imovel.id,
                                                                                  params.imovel.idLocal, 
                                                                                  params.imovel.sincronizado, 
                                                                                  contagemBenfeitoria )}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          
                                          borderWidth: 2, 
                                           borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                                          
                            <Icon size={30} name='tree' color='orange' />
                            <View style={{ flexDirection: 'column' }}> 
                                <Text type={textTypes.BUTTON_BOLD} color={theme.colors.grayTheme.gray100}> Benfeitorias</Text>
                                <Text type={textTypes.PARAGRAPH_REGULAR} color={theme.colors.mainTheme.black}>
                                  {'benfeitorias cadastradas: '+contagemBenfeitoria.toString()}
                              </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: "#808080", 
                      backgroundColor: '#000000'
                    }}>                     
                     <EditConfirmation 
                      imovel={params.imovel} 
                      destino="NovoImovel" 
                      onEditSuccess={() => {
                      
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.imovel.id} 
                      deleteEndpoint="imovel" 
                      onDeleteSuccess={() => {
                            
                      }} 
                      />
                      </View>
               
              
      
       </ImovelDetailContainer>
    </ScrollView>     
   
   
  );
}

export default ImovelDetails;