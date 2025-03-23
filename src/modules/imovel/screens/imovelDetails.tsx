import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { useBenfeitorias } from '../hooks/useBenfeitorias';
import { ImovelDetailContainer } from '../styles/ImovelDetails.style';
import EditConfirmation from '../ui-component/UseEditImovel';
import { renderField } from '../ui-component/renderFilds';
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
  imovel: imovelBody
) => {
  navigate(route, { imovel });
};





export interface ImovelParam {
 imovel: imovelBody;
}

const ImovelDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, ImovelParam>>>();
  const {benfeitoria} = useBenfeitorias(params.imovel.id);
 
  const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, data);
      } else {
        handleNewEntry(navigation.navigate, newRoute, params.imovel);
      }
    };

    useEffect(() => {
        if (benfeitoria.length == 0) {
          Alert.alert(
            "Atenção!",
            "Este imovel ainda não apresenta dados de benfeirias coletados. Confira os itens no final da página."
          );
        }
      }, [benfeitoria]);
    
  
  

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
            
            
            <TouchableOpacity  onPress={() => {handleDecision(benfeitoria, "Benfeitorias", "NovaBenfeitoria")}}>
                          
                          {benfeitoria.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Benfeitoria registradas: {benfeitoria.length}
                           </Text>
     
                          ):( 
                            <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                              padding: 10,
                              borderWidth: 2, 
                              borderColor: theme.colors.grayTheme.gray100 
                            }}>
                              <Icon size={30} name='home3' color='red' />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>+ Benfeitorias</Text>
                          </View>
                          )}
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