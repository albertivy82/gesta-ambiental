import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { imovelBody } from '../../../shared/types/imovelType';
import { useBenfeitorias } from '../../entrevistadoDetails/hooks/useBenfeitorias';
import { ImovelDetailContainer } from '../styles/ImovelDetails.style';
import EditConfirmation from '../ui-component/UseEditImovel';
import { renderField } from '../ui-component/renderFilds';
import ImovelSection from '../ui-component/imovelSeccion';



export interface ImovelParam {
 imovel: imovelBody;
}

const ImovelDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, ImovelParam>>>();
  const imovel = params.imovel;
  const foccus =useIsFocused();
  const {benfeitoria} = useBenfeitorias( false, params.imovel.id);

  
  

  const handleDecision = (benfeitoria: BenfeitoriaType[]) => {
      if (Array.isArray(benfeitoria) ? benfeitoria.length > 0 : !!benfeitoria) {
        navigation.navigate("Benfeitorias", {imovel});
      } else {
        navigation.navigate("NovaBenfeitoria", {imovel});
      }
    };

    

  return (
    
       <ScrollView style={{ flex: 1 }}>
        <ImovelDetailContainer>
             <ImovelSection imovel={params.imovel} />

            
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
            
            
            <TouchableOpacity onPress={() => handleDecision(benfeitoria)}>
                  <View
                    style={{
                      alignItems: 'stretch',
                      flexDirection: 'row',
                      padding: 10,
                      borderWidth: 2,
                      borderColor: theme.colors.grayTheme.gray100
                    }}
                  >
                    <Icon size={30} name="home3" color="red" />
                    <Text
                      type={textTypes.BUTTON_BOLD}
                      color={benfeitoria.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                      style={{ marginLeft: 10 }}
                    >
                      {benfeitoria.length > 0
                        ? `Listagem de Benfeitorias`
                        : ' + Benfeitorias'}
                    </Text>
                  </View>
              </TouchableOpacity>
              
  
       </ImovelDetailContainer>
    </ScrollView>     
   
   
  );
}

export default ImovelDetails;