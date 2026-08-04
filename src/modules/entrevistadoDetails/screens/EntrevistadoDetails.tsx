import { NavigationProp, ParamListBase, RouteProp, useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { getImovel } from '../../../realm/services/imovelService';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { imovelBody } from '../../../shared/types/imovelType';
import { useImovel } from '../hooks/useImovel';
import { EntrevistadoDetailContainer } from '../styles/EntrevistadoDetails.style';
import EditConfirmation from '../ui-component/UseEditEntrevistado';
import FormSection from '../../../shared/components/FormSection';
import ImovelSection from '../../imovel/ui-component/imovelSeccion';
import EntrevistadoSection from '../ui-component/EntrevistadoSection';

// Para entidades MULTIPLAS (vegetacao, peixes, etc.)
export const handleNavegacaoFilhas = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  rota: string, 
  entrevistado: EntrevistadoType
) => {
  navigate(rota, { entrevistado });
};

// Para entidade ÚNICA (imóvel)
export const handleImovelNavigation = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  rota: string, 
  imovel?: imovelBody,
  entrevistado?: EntrevistadoType
) => {
  if (imovel) {
    navigate(rota, { imovel });
  } else if (entrevistado) {
    navigate("NovoImovel", { entrevistado });
  }
};





export interface EntrevistadoParam {
 entrevistado: EntrevistadoType;
}

const EntrevistadoDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, EntrevistadoParam>>>();
  const foccus =useIsFocused();
  const {imovelPresente, loadingImovel} = useImovel(params.entrevistado.id, foccus);
 
  const loading = loadingImovel;   

  useFocusEffect(
      useCallback(() => {
        getImovel(params.entrevistado.id);
      }, [params.entrevistado.id])
    );

 
  const handleDecision = (
    data: any[] | undefined,
    detailRoute: string,
    newRoute: string
  ) => {
    if (data && data.length > 0) {
      handleNavegacaoFilhas(navigation.navigate, detailRoute, params.entrevistado);
    } else {
      handleNavegacaoFilhas(navigation.navigate, newRoute, params.entrevistado);
    }
  };
  
    
  if (loading) {
    return (
      <EntrevistadoDetailContainer
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <ActivityIndicator
          animating={true}
          size={80}      
          color="#ff4500"
          style={{ marginTop: 20 }}
        />
  
        <Text
          type={textTypes.BUTTON_REGULAR}
          color="#000"
          margin="20px 0 0 0"
        >
          Sincronizando dados...
        </Text>
      </EntrevistadoDetailContainer>
    );
  }

  

  return (
    
       <ScrollView style={{ flex: 1 }}>
        <EntrevistadoDetailContainer>
          <EntrevistadoSection entrevistado={params.entrevistado}>


                 
              <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    marginTop: 5,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#dcdcdc',
                  }}>                     
                     <EditConfirmation 
                      entrevistado={params.entrevistado} 
                      destino="NovoEntrevistado" 
                      onEditSuccess={() => {
                       //voltar para listagem de entrevistados
                      }} 
                      />

                      <View style={{width: 1,
                                    height: 22,
                                    backgroundColor: '#dcdcdc',
                      }} />
                              
                      <DeleteConfirmation 
                      id={params.entrevistado.id} 
                      idLocal={params.entrevistado.idLocal}
                      deleteEndpoint="entrevistado" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
               </View>
         </EntrevistadoSection>
            
                
          <TouchableOpacity
                 onPress={() => handleImovelNavigation(navigation.navigate, "ImovelDetail", imovelPresente, params.entrevistado)}>
                  {imovelPresente ? (
                    <ImovelSection imovel={imovelPresente} />
                  ) : (
                    <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                      padding: 10,
                      borderWidth: 2, 
                      borderColor: theme.colors.grayTheme.gray100 
                    }}>
                      <Icon size={30} name='home3' color='red' />
                      <Text type={textTypes.BUTTON_BOLD} color={theme.colors.redTheme.red}> Sem imóvel cadastrado - Adicionar Imovel</Text>
                  </View>
                  )}
        </TouchableOpacity>

                   
     
       </EntrevistadoDetailContainer>
    </ScrollView>     
   
   
  );
}

export default EntrevistadoDetails;