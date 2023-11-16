import { useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { TouchableOpacity, View, ScrollView} from 'react-native';
import { imovelBody } from '../../../shared/types/imovelBody';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';
import { ImovelDetailContainer } from '../styles/ImovelDetails.style';
import { Icon } from '../../../shared/components/icon/Icon';
import { coordenadasBody } from '../../../shared/types/coordenadaBody';
import { EscolaType } from '../../../shared/types/EscolaType';
import { PostoType } from '../../../shared/types/postoTypes';
import { useBenfeitorias } from '../hooks/useBenfeitorias';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';



export interface ImovelParam {
 imovel: imovelBody;
}

//BLOCO IMOVEL
export const benfeitoriasDoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('Imovel', {localidadeId})
}


const ImovelDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, ImovelParam>>>();
  const {contagemBenfeitoria} = useBenfeitorias(params.imovel.id);
  
  
 
  const  handleGerenciaBenfeitorias =  (imovelId: number, contagemBenfeitorias: number) =>{
    if(contagemBenfeitoria>0){
      benfeitoriasDoImovel(navigation.navigate, imovelId);
    }
  }
  
  const renderField = (label: string, value: string | null| undefined) => {
     return (
          <View style={{ marginBottom: 10 }}>
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
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
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
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='man' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Entrevistado</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='droplet' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Saneamento</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='office' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Serviços Básicos</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='cogs' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Outros Serviços</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleGerenciaBenfeitorias(params.imovel.id, contagemBenfeitoria)}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                                          
                            <Icon size={30} name='tree' color='blue' />
                            <View style={{ flexDirection: 'column' }}> 
                                <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Benfeitorias</Text>
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
                      borderColor: theme.colors.blueTheme.blue2 
                    }}>

                    <TouchableOpacity onPress={() =>null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='bin' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Imóvel</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: theme.colors.blueTheme.blue2 }} />


                    <TouchableOpacity onPress={() => null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='pencil2' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Imóvel</Text>
                        </View>
                    </TouchableOpacity>
               </View>
               
              
      
       </ImovelDetailContainer>
    </ScrollView>     
   
   
  );
}

export default ImovelDetails;