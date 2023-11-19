import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BenfeitoriaType } from '../../shared/types/BenfeitoriaType';
import { textTypes } from '../../shared/components/text/textTypes';
import { theme } from '../../shared/themes/theme';
import Text from '../../shared/components/text/Text';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

export const detalharBenfeitoria = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType)=>{
    navigate('BenfeitoriaDetails', {benfeitoria})
  }

const RenderItem = ({ item }: { item: BenfeitoriaType}) => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();   
    
    const  handleBenfeitoriaDetail =  (benfeitoria: BenfeitoriaType) =>{
        detalharBenfeitoria(navigation.navigate, benfeitoria );
     
    }
    console.log(item)
    
    return (
        <TouchableOpacity onPress={() => handleBenfeitoriaDetail(item)}>
           <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
                  
                  <Text
                  type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.blueTheme.blue1}
                   >
                    Benfeitoria: {item.id}
                   </Text>
                
                
                <Text
                  type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.blueTheme.blue1}
                >
                  Função: {item.funcao}
                </Text>
                
                <Text
                  type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.blueTheme.blue1}
                >
                  Tipo: {item.tipoBenfeitoria}
                 
                </Text>
                
                
          </View>
        </TouchableOpacity>
      );
};

export default RenderItem;
