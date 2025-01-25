import { View } from 'react-native';
import { theme } from '../../themes/theme';
import { textTypes } from '../text/textTypes';
import Text from '../text/Text';

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