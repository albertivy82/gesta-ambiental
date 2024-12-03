import React from 'react';
import { View } from 'react-native';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AlimentacaoType } from '../../../shared/types/AlimentacaoType';


const RenderItem = ({ item }: { item: AlimentacaoType}) => {
      console.log('executou o list?')
    return (
       
           <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
                  <Text
                  type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.blueTheme.blue1}
                   >
                    {item.alimentacaoPrincipal}
                   </Text>
          </View>
          
      );
};

export default RenderItem;
