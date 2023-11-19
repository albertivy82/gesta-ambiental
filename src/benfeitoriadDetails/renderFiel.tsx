import { View } from 'react-native';
import Text from "../shared/components/text/Text";
import { textTypes } from "../shared/components/text/textTypes";
import { theme } from "../shared/themes/theme";


export const renderField = (label: string, value: string | null| undefined) => {
    return (
         <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.SUB_TITLE_SEMI_BOLD} color={theme.colors.blueTheme.blue1}>
             {label}:
            </Text>
           <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.mainTheme.black}>
             {value? value : 'Informação não cadastrada'}
           </Text>
         </View>
       );
     };
 