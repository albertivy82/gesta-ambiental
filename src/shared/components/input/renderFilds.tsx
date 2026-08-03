import { View } from 'react-native';
import { theme } from '../../themes/theme';
import { textTypes } from '../text/textTypes';
import Text from '../text/Text';

export const renderField = (label: string, value: string | null| undefined) => {
    return (<View
                style={{
                  paddingVertical: 6,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#e5e5e5',
                }}
>
            <Text type={textTypes.BUTTON_BOLD} color="#046809f1">
             {label}:
            </Text>
           <Text type={textTypes.BUTTON_REGULAR} color="#000000">
             {value? value : 'Informação não cadastrada'}
           </Text>
         </View>
       );
     };