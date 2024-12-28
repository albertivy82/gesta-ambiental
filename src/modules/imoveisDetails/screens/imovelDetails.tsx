import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { useBenfeitorias } from '../hooks/useBenfeitorias';
import { handleGerenciaFilhas } from '../hooks/useChild';
import { useServicosBasicos } from '../hooks/useServicoBasico';
import { ImovelDetailContainer } from '../styles/ImovelDetails.style';
import QuadroDeItens from '../ui-component/QuadroDeItens';
import EditConfirmation from '../ui-component/UseEditImovel';
import { renderField } from '../ui-component/renderFilds';





export interface ImovelParam {
 imovel: imovelBody;
}

const ImovelDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, ImovelParam>>>();
  const {contagemBenfeitoria} = useBenfeitorias(params.imovel.id);
  const {contagemServicosBasicos} = useServicosBasicos(params.imovel.id);
    
  
  

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

                    <QuadroDeItens
                      contagemItem={contagemServicosBasicos}
                      icone='office'
                      elemento='Serviços Básicos'
                      onPress={() => handleGerenciaFilhas(
                        navigation.navigate,{ 
                        imovel: params.imovel, 
                        contagemItem: contagemServicosBasicos, 
                        item: "Serviços Básicos" 
                      })}
                      />


                    <QuadroDeItens
                      contagemItem={contagemBenfeitoria}
                      icone='cogs'
                      elemento='Outros Serviços'
                      onPress={() => handleGerenciaFilhas(
                        navigation.navigate,
                        { 
                        imovel: params.imovel, 
                        contagemItem: contagemBenfeitoria, 
                        item: "Outros Serviços" 
                      })}
                      />

                    <QuadroDeItens
                      contagemItem={contagemBenfeitoria}
                      icone='tree'
                      elemento='Benfeitorias'
                      onPress={() => handleGerenciaFilhas(
                        navigation.navigate,
                        { 
                        imovel: params.imovel, 
                        contagemItem: contagemBenfeitoria, 
                        item: "Benfeitoria" 
                      })}
                      />


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
                      idLocal={params.imovel.idLocal}
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