import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';

export const detalharBenfeitoria = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType)=>{
    navigate('BenfeitoriaDetails', {benfeitoria})
}

const RenderItem = ({ item }: { item: BenfeitoriaType}) => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();   
    
    const  handleBenfeitoriaDetail =  (benfeitoria: BenfeitoriaType) =>{
        detalharBenfeitoria(navigation.navigate, benfeitoria );
     
    }
    
    
    return (
        <TouchableOpacity onPress={() => handleBenfeitoriaDetail(item)}>
             <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
              
              <Text
                 type={textTypes.BUTTON_REGULAR}
                 color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
               >
                 Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
              </Text>
              
              <Text
                 type={textTypes.BUTTON_REGULAR}
                 color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
               >
                 Tipo de Benfeitoria: {item.tipoBenfeitoria}
                </Text>
                
                <Text
                 type={textTypes.BUTTON_REGULAR}
                 color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
               >
                Função: {item.funcao}
               </Text>
               
                
          </View>
        </TouchableOpacity>
      );
};

export default RenderItem;
