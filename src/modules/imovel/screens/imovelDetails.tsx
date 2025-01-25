import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { useBenfeitorias } from '../hooks/useBenfeitorias';
import { handleGerenciaFilhas } from '../hooks/useChild';
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
 
    
  
  

  return (
    
       <ScrollView style={{ flex: 1 }}>
        <ImovelDetailContainer>
              <View style={{ padding: 10, borderWidth: 1,  borderColor: theme.colors.grayTheme.gray100 }}>
              {renderField('Número', params.imovel.numero)}
              {renderField('Rua', params.imovel.rua)}
              {renderField('Referencial', params.imovel.referencial)}
              {renderField('Bairro', params.imovel.bairro)}
              {renderField('Latitude', params.imovel.latitude)}
              {renderField('Longitude', params.imovel.longitude)}
              {renderField('Área do Imóvel (m²)', params.imovel.areaImovel?.toString())}
              {renderField('Tipo de Solo', params.imovel.tipoSolo)}
              {renderField('Vizinhos Confinantes', params.imovel.vizinhosConfinantes)}
              {renderField('Situação Fundiária', params.imovel.situacaoFundiaria)}
              {renderField('Documentação do Imóvel', params.imovel.documentacaoImovel)}
              {renderField('Material utilizado no entorno do imóvel (Limites)', params.imovel.limites)}
              {renderField('Linhas de Barco Disponíveis', params.imovel.linhasDeBarco)}
              {renderField('Pavimentação', params.imovel.pavimentacao)}
              {renderField('Iluminação Pública', params.imovel.iluminacaoPublica)}
              {renderField('Equipamentos Urbanos Presentes', params.imovel.equipamentosUrbanos)}
              {renderField('Espaços de Esporte e Lazer', params.imovel.espacosEsporteLazer)}
              {renderField('Programa de Infraestrutura e Saneamento', params.imovel.programaInfraSaneamento)}
              {renderField('ID do Entrevistado Associado', params.imovel.entrevistado?.id?.toString())}
              {renderField('Sincronizado', params.imovel.sincronizado ? 'Sim' : 'Não')}
              {renderField('ID Local', params.imovel.idLocal)}
              {renderField('ID Pai', params.imovel.idFather)}
            </View>

                    
                    
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