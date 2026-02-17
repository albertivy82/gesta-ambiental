import { View } from 'react-native';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';

export const renderField = (label: string, value: string | null| undefined) => {
    return (
         <View style={{
            marginBottom: 10, 
            borderColor: theme.colors.grayTheme.gray100, 
            padding: 10,
            borderWidth: 1 } }>
            <Text type={textTypes.BUTTON_BOLD} color="#000000">
             {label}:
            </Text>
           <Text type={textTypes.BUTTON_REGULAR} color="#000000">
             {value? value : 'Informação não cadastrada'}
           </Text>
         </View>
       );
     };