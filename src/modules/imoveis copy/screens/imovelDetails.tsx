import { useEffect, useState } from 'react';

import { useRoute, RouteProp } from '@react-navigation/native';
import { TouchableOpacity, View, ScrollView} from 'react-native';
import { imovelBody } from '../../../shared/types/imovelBody';
import { getImoveis } from '../../../realm/services/imovelService';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';
import { ImovelContainer } from '../styles/Imovel.style';



export interface ImovelParam {
 imovel: imovelBody;
}




const ImovelDetails = () => {
  const { params } = useRoute<RouteProp<Record<string, ImovelParam>>>();



  const renderField = (label: string, value: string[] | null) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
          {label}: {value && value.length > 0 ? value.join(', ') : 'Informação não cadastrada'}
        </Text>
      </View>
    );
  };




  return (
    
       <ScrollView style={{ flex: 1 }}>
        <ImovelContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
                {renderField('Nome', [params.imovel.dataChegada])}
                {renderField('Município', [params.imovel.dataChegada])}
                {renderField('Esfera', [params.imovel.dataChegada])}
              </View>
       </ImovelContainer>
    </ScrollView>     
   
   
  );
}

export default ImovelDetails;