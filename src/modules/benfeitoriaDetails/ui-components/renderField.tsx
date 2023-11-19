import { View } from 'react-native';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { LabelContainer } from '../styles/BenfeitoriaDetails.style';



export const renderField = (label: string, value: string | null| undefined) => {
    return (
         <View style={{ marginBottom: 10 }}>
          <LabelContainer>
            <Text type={textTypes.SUB_TITLE_BOLD} color={theme.colors.redTheme.red2}>
             {label}:
            </Text>
            </LabelContainer>
           <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
             {value? value : 'Informação não cadastrada'}
           </Text>
         </View>
       );
     };
 